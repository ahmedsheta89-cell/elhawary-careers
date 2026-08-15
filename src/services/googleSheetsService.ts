import type { AdminApplication } from '@/services/adminService';
import type { Job } from '@/types';

const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const DEFAULT_SHEET_NAME = 'Applications';

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

type TokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type GoogleIdentity = {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }) => TokenClient;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

export type GoogleSheetsSyncResult = {
  inserted: number;
  updated: number;
  spreadsheetId: string;
  sheetName: string;
};

const HEADERS = [
  'معرّف الطلب',
  'تاريخ التقديم',
  'الحالة',
  'معرّف الوظيفة',
  'المسمى الوظيفي',
  'اسم المتقدم',
  'البريد الإلكتروني',
  'الهاتف',
  'واتساب',
  'العنوان',
  'المؤهل العلمي',
  'الخبرات العملية',
  'المهارات',
  'السيرة الذاتية',
  'آخر مزامنة',
];

function requireConfiguredClient(clientId = GOOGLE_CLIENT_ID) {
  if (!clientId) {
    throw new Error(
      'لم يتم إعداد Google Sheets بعد. أضف VITE_GOOGLE_CLIENT_ID إلى إعدادات التطبيق.'
    );
  }
  return clientId;
}

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${GOOGLE_SCRIPT_URL}"]`
  );
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('تعذر تحميل خدمة Google.')), {
        once: true,
      });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('تعذر تحميل خدمة Google.'));
    document.head.appendChild(script);
  });
}

export function isGoogleSheetsConfigured(clientId = GOOGLE_CLIENT_ID) {
  return Boolean(clientId.trim());
}

export async function authorizeGoogleSheets(clientId = GOOGLE_CLIENT_ID) {
  const configuredClientId = requireConfiguredClient(clientId);
  await loadGoogleIdentityScript();
  const google = window.google;
  if (!google?.accounts?.oauth2) {
    throw new Error('خدمة تسجيل الدخول إلى Google غير متاحة حالياً.');
  }

  return new Promise<string>((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: configuredClientId,
      scope: GOOGLE_SHEETS_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description || 'لم يتم منح صلاحية Google Sheets.'));
          return;
        }
        resolve(response.access_token);
      },
    });
    client.requestAccessToken({ prompt: 'consent' });
  });
}

function assertSpreadsheetId(spreadsheetId: string) {
  const value = spreadsheetId.trim();
  if (!/^[a-zA-Z0-9_-]{20,}$/.test(value)) {
    throw new Error('معرّف ملف Google Sheets غير صحيح. انسخه من رابط الملف.');
  }
  return value;
}

function normalizeSheetName(sheetName: string) {
  const value = sheetName.trim() || DEFAULT_SHEET_NAME;
  if (value.length > 80 || /[\r\n]/.test(value)) {
    throw new Error('اسم ورقة Google Sheets غير صحيح.');
  }
  return value;
}

function quoteSheetName(sheetName: string) {
  return `'${sheetName.replaceAll("'", "''")}'`;
}

function submittedAtValue(value: unknown) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === 'function') return toDate().toISOString();
  }
  return '';
}

function jsonCell(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return '';
  return JSON.stringify(value);
}

function applicationRow(application: AdminApplication, jobs: Job[]) {
  const job = jobs.find((item) => item.id === application.jobId);
  const submittedAt = submittedAtValue(application.submittedAt);
  const row = [
    application.id,
    submittedAt,
    application.status,
    application.jobId,
    job?.title.ar || application.jobId,
    application.fullName,
    application.email,
    application.phone,
    application.whatsappNumber || '',
    typeof application.address === 'string' ? application.address : '',
    jsonCell(application.education),
    jsonCell(application.experience),
    jsonCell(application.skills),
    application.cvReceived ? 'تم الاستلام' : 'لم تُرفق داخل الموقع',
    new Date().toISOString(),
  ];
  return row.map((cell) => (cell == null ? '' : String(cell)));
}

async function sheetsRequest<T>(
  accessToken: string,
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const payload = (await response.json().catch(() => ({}))) as {
    error?: { message?: string };
  } & T;
  if (!response.ok) {
    throw new Error(payload.error?.message || 'تعذر التواصل مع Google Sheets.');
  }
  return payload;
}

export async function syncApplicationsToGoogleSheet(options: {
  accessToken: string;
  spreadsheetId: string;
  sheetName?: string;
  applications: AdminApplication[];
  jobs: Job[];
}): Promise<GoogleSheetsSyncResult> {
  const spreadsheetId = assertSpreadsheetId(options.spreadsheetId);
  const sheetName = normalizeSheetName(options.sheetName || DEFAULT_SHEET_NAME);
  const encodedRange = encodeURIComponent(`${quoteSheetName(sheetName)}!A:O`);
  const valuesUrl = `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${encodedRange}`;
  const existing = await sheetsRequest<{ values?: string[][] }>(
    options.accessToken,
    valuesUrl
  );
  const rows = existing.values || [];

  if (rows.length === 0 || rows[0]?.[0] !== HEADERS[0]) {
    await sheetsRequest(
      options.accessToken,
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(
        `${quoteSheetName(sheetName)}!A1:O1`
      )}?valueInputOption=RAW`,
      {
        method: 'PUT',
        body: JSON.stringify({ range: `${quoteSheetName(sheetName)}!A1:O1`, majorDimension: 'ROWS', values: [HEADERS] }),
      }
    );
  }

  const rowById = new Map<string, number>();
  rows.slice(1).forEach((row, index) => {
    if (row[0]) rowById.set(row[0], index + 2);
  });

  const updates = [] as Array<{ range: string; majorDimension: string; values: string[][] }>;
  const newRows: string[][] = [];
  let updated = 0;
  options.applications.forEach((application) => {
    const row = applicationRow(application, options.jobs);
    const existingRow = rowById.get(application.id);
    if (existingRow) {
      updates.push({
        range: `${quoteSheetName(sheetName)}!A${existingRow}:O${existingRow}`,
        majorDimension: 'ROWS',
        values: [row],
      });
      updated += 1;
    } else {
      newRows.push(row);
    }
  });

  if (updates.length > 0) {
    await sheetsRequest(
      options.accessToken,
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        body: JSON.stringify({ valueInputOption: 'RAW', data: updates }),
      }
    );
  }

  if (newRows.length > 0) {
    await sheetsRequest(
      options.accessToken,
      `${GOOGLE_SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(
        `${quoteSheetName(sheetName)}!A:O`
      )}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        body: JSON.stringify({ majorDimension: 'ROWS', values: newRows }),
      }
    );
  }

  return { inserted: newRows.length, updated, spreadsheetId, sheetName };
}

export { DEFAULT_SHEET_NAME };
