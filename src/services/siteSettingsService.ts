import { doc, getDoc } from 'firebase/firestore';
import { config } from '@/config';
import { getFirebaseInstances, hasFirebaseConfig } from '@/lib/firebase';

export const DEFAULT_WHATSAPP_NUMBER = '0201000753375';

export type SiteSettings = {
  whatsappNumber: string;
  updatedAt?: string;
};

function normalizeWhatsAppNumber(value: string): string {
  return value.replace(/[^0-9]/g, '').trim();
}

export function getFallbackWhatsAppNumber(): string {
  return normalizeWhatsAppNumber(
    config.contact.whatsapp || DEFAULT_WHATSAPP_NUMBER
  );
}

export function toWhatsAppLinkNumber(value: string): string {
  const normalized = normalizeWhatsAppNumber(value);
  if (normalized.startsWith('00')) return normalized.slice(2);
  if (normalized.startsWith('20')) return normalized;
  if (normalized.startsWith('0')) return `20${normalized.slice(1)}`;
  return normalized;
}

export async function getPublicSiteSettings(): Promise<SiteSettings> {
  const fallback = getFallbackWhatsAppNumber();
  if (!hasFirebaseConfig()) return { whatsappNumber: fallback };

  try {
    const { db } = getFirebaseInstances();
    const snapshot = await getDoc(doc(db, 'settings', 'public'));
    const value = snapshot.data()?.whatsappNumber;
    if (typeof value !== 'string' || !normalizeWhatsAppNumber(value)) {
      return { whatsappNumber: fallback };
    }
    return { whatsappNumber: normalizeWhatsAppNumber(value) };
  } catch (error) {
    console.error('Unable to load public site settings', error);
    return { whatsappNumber: fallback };
  }
}

export { normalizeWhatsAppNumber };
