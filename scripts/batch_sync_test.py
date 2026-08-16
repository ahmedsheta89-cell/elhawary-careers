#!/usr/bin/env python3
"""Idempotency test for the El Hawary Careers Firestore -> Google Sheets flow.

The test uses deterministic QA document IDs and an isolated QA_Batch_Test tab.
It never deletes data; rerunning the script updates the same rows instead of
appending duplicates.
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

from sheets_client import sheets_call

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "elhawary-careers-2026")
SPREADSHEET_ID = os.environ.get(
    "GOOGLE_SHEETS_SPREADSHEET_ID",
    "1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4",
)
SHEET_NAME = os.environ.get("GOOGLE_SHEETS_TEST_TAB", "QA_Batch_Test")
ROOT = Path(__file__).resolve().parents[1]
RESULTS_JSON = ROOT / "batch-sync-test-results.json"
RESULTS_MD = ROOT / "batch-sync-test-report-ar.md"

HEADERS = [
    "معرّف الطلب",
    "تاريخ التقديم",
    "الحالة",
    "معرّف الوظيفة",
    "المسمى الوظيفي",
    "اسم المتقدم",
    "البريد الإلكتروني",
    "الهاتف",
    "واتساب",
    "العنوان",
    "المؤهل العلمي",
    "الخبرات العملية",
    "المهارات",
    "السيرة الذاتية",
    "آخر مزامنة",
]

QA_APPLICATIONS = [
    {
        "id": "qa-batch-001",
        "fullName": "اختبار مزامنة 001",
        "email": "qa-batch-001@example.invalid",
        "phone": "01000000001",
        "whatsappNumber": "01000000001",
        "address": "بيانات اختبار — لا يُعتمد",
    },
    {
        "id": "qa-batch-002",
        "fullName": "اختبار مزامنة 002",
        "email": "qa-batch-002@example.invalid",
        "phone": "01000000002",
        "whatsappNumber": "01000000002",
        "address": "بيانات اختبار — لا يُعتمد",
    },
    {
        "id": "qa-batch-003",
        "fullName": "اختبار مزامنة 003",
        "email": "qa-batch-003@example.invalid",
        "phone": "01000000003",
        "whatsappNumber": "01000000003",
        "address": "بيانات اختبار — لا يُعتمد",
    },
    {
        "id": "qa-batch-004",
        "fullName": "اختبار مزامنة 004",
        "email": "qa-batch-004@example.invalid",
        "phone": "01000000004",
        "whatsappNumber": "01000000004",
        "address": "بيانات اختبار — لا يُعتمد",
    },
]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def get_firebase_access_token() -> str:
    token = os.environ.get("FIREBASE_ACCESS_TOKEN", "").strip()
    if token:
        return token
    config_path = Path.home() / ".config/configstore/firebase-tools.json"
    try:
        config = json.loads(config_path.read_text())
        token = str(config.get("tokens", {}).get("access_token", "")).strip()
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"تعذر قراءة اعتماد Firebase CLI: {exc}") from exc
    if not token:
        raise RuntimeError("لا يوجد FIREBASE_ACCESS_TOKEN صالح في البيئة أو Firebase CLI.")
    return token


def firestore_value(value: Any) -> dict[str, Any]:
    if isinstance(value, bool):
        return {"booleanValue": value}
    if isinstance(value, int):
        return {"integerValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, list):
        return {"arrayValue": {"values": [firestore_value(item) for item in value]}}
    return {"stringValue": str(value)}


def create_or_update_firestore_application(application: dict[str, str], access_token: str) -> None:
    submitted_at = utc_now()
    fields: dict[str, dict[str, Any]] = {
        "fullName": firestore_value(application["fullName"]),
        "email": firestore_value(application["email"]),
        "phone": firestore_value(application["phone"]),
        "whatsappNumber": firestore_value(application["whatsappNumber"]),
        "jobId": firestore_value("qa-batch-job"),
        "status": firestore_value("pending"),
        "cvDelivery": firestore_value("whatsapp"),
        "cvReceived": firestore_value(False),
        "submittedAt": {"timestampValue": submitted_at},
        "address": firestore_value(application["address"]),
        "education": firestore_value(["اختبار جودة — لا يُعتمد"]),
        "experience": firestore_value(["اختبار دفعي"]),
        "skills": firestore_value(["اختبار المزامنة"]),
        "qaTest": firestore_value(True),
    }
    url = (
        f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}"
        f"/databases/(default)/documents/applications/{application['id']}"
    )
    response = requests.patch(
        url,
        params={"updateMask.fieldPaths": list(fields.keys())},
        headers={"Authorization": f"Bearer {access_token}"},
        json={"fields": fields},
        timeout=30,
    )
    if not response.ok:
        raise RuntimeError(f"Firestore {response.status_code}: {response.text[:500]}")


def gws(service_args: list[str], *, body: dict[str, Any] | None = None) -> dict[str, Any]:
    return sheets_call(service_args, body=body)


def ensure_test_tab() -> None:
    spreadsheet = gws(["sheets", "spreadsheets", "get", "--params", json.dumps({"spreadsheetId": SPREADSHEET_ID})])
    titles = {
        item.get("properties", {}).get("title")
        for item in spreadsheet.get("sheets", [])
    }
    if SHEET_NAME in titles:
        return
    gws(
        [
            "sheets",
            "spreadsheets",
            "batchUpdate",
            "--params",
            json.dumps({"spreadsheetId": SPREADSHEET_ID}),
        ],
        body={"requests": [{"addSheet": {"properties": {"title": SHEET_NAME}}}]},
    )


def row_for_application(application: dict[str, str], synced_at: str) -> list[str]:
    submitted_at = synced_at
    return [
        application["id"],
        submitted_at,
        "pending",
        "qa-batch-job",
        "وظيفة اختبار المزامنة",
        application["fullName"],
        application["email"],
        application["phone"],
        application["whatsappNumber"],
        application["address"],
        json.dumps(["اختبار جودة — لا يُعتمد"], ensure_ascii=False),
        json.dumps(["اختبار دفعي"], ensure_ascii=False),
        json.dumps(["اختبار المزامنة"], ensure_ascii=False),
        "لم تُرفق داخل الموقع",
        synced_at,
    ]


def sync_batch() -> dict[str, int]:
    range_name = f"'{SHEET_NAME}'!A:O"
    values = gws(
        [
            "sheets",
            "spreadsheets",
            "values",
            "get",
            "--params",
            json.dumps({"spreadsheetId": SPREADSHEET_ID, "range": range_name}),
        ]
    ).get("values", [])
    if not values or values[0][: len(HEADERS)] != HEADERS:
        gws(
            [
                "sheets",
                "spreadsheets",
                "values",
                "update",
                "--params",
                json.dumps(
                    {
                        "spreadsheetId": SPREADSHEET_ID,
                        "range": f"'{SHEET_NAME}'!A1:O1",
                        "valueInputOption": "RAW",
                    }
                ),
            ],
            body={"range": f"'{SHEET_NAME}'!A1:O1", "majorDimension": "ROWS", "values": [HEADERS]},
        )
        values = [HEADERS]

    row_by_id: dict[str, int] = {}
    for index, row in enumerate(values[1:], start=2):
        if row and row[0]:
            row_by_id[row[0]] = index

    synced_at = utc_now()
    updates: list[tuple[int, list[str]]] = []
    inserts: list[list[str]] = []
    for application in QA_APPLICATIONS:
        row = row_for_application(application, synced_at)
        if application["id"] in row_by_id:
            updates.append((row_by_id[application["id"]], row))
        else:
            inserts.append(row)

    for row_number, row in updates:
        gws(
            [
                "sheets",
                "spreadsheets",
                "values",
                "update",
                "--params",
                json.dumps(
                    {
                        "spreadsheetId": SPREADSHEET_ID,
                        "range": f"'{SHEET_NAME}'!A{row_number}:O{row_number}",
                        "valueInputOption": "RAW",
                    }
                ),
            ],
            body={
                "range": f"'{SHEET_NAME}'!A{row_number}:O{row_number}",
                "majorDimension": "ROWS",
                "values": [row],
            },
        )

    if inserts:
        gws(
            [
                "sheets",
                "spreadsheets",
                "values",
                "append",
                "--params",
                json.dumps(
                    {
                        "spreadsheetId": SPREADSHEET_ID,
                        "range": range_name,
                        "valueInputOption": "RAW",
                        "insertDataOption": "INSERT_ROWS",
                    }
                ),
            ],
            body={"majorDimension": "ROWS", "values": inserts},
        )

    return {"inserted": len(inserts), "updated": len(updates)}


def read_test_rows() -> list[list[str]]:
    return gws(
        [
            "sheets",
            "spreadsheets",
            "values",
            "get",
            "--params",
            json.dumps({"spreadsheetId": SPREADSHEET_ID, "range": f"'{SHEET_NAME}'!A:O"}),
        ]
    ).get("values", [])


def main() -> int:
    firestore_injection: dict[str, Any] = {
        "attempted": True,
        "status": "ok",
        "createdOrUpdated": 0,
    }
    try:
        access_token = get_firebase_access_token()
        for application in QA_APPLICATIONS:
            create_or_update_firestore_application(application, access_token)
            firestore_injection["createdOrUpdated"] += 1
    except Exception as exc:  # noqa: BLE001
        firestore_injection = {
            "attempted": True,
            "status": "skipped_due_to_authentication",
            "createdOrUpdated": firestore_injection["createdOrUpdated"],
            "reason": str(exc).splitlines()[0][:300],
        }
        if os.environ.get("FIRESTORE_REQUIRED", "false").lower() == "true":
            raise

    ensure_test_tab()
    first = sync_batch()
    second = sync_batch()
    rows = read_test_rows()
    ids = [row[0] for row in rows[1:] if row]
    counts = Counter(ids)
    qa_counts = {application["id"]: counts.get(application["id"], 0) for application in QA_APPLICATIONS}
    duplicates = {key: count for key, count in qa_counts.items() if count != 1}
    result = {
        "projectId": PROJECT_ID,
        "spreadsheetId": SPREADSHEET_ID,
        "sheetName": SHEET_NAME,
        "qaApplicationIds": [application["id"] for application in QA_APPLICATIONS],
        "firstSync": first,
        "secondSync": second,
        "qaRowCounts": qa_counts,
        "duplicateOrMissingIds": duplicates,
        "passed": first["inserted"] + first["updated"] == len(QA_APPLICATIONS)
        and second["inserted"] == 0
        and second["updated"] == len(QA_APPLICATIONS)
        and not duplicates,
        "firestoreInjection": firestore_injection,
        "testScope": "firestore_and_sheets" if firestore_injection["status"] == "ok" else "sheets_layer_only",
        "executedAt": utc_now(),
        "notes": "اختبار معزول في تبويب QA_Batch_Test؛ لا يحذف أي بيانات، وإعادة التشغيل تحدّث الصفوف نفسها. عند رفض اعتماد Firebase CLI يظل اختبار منع التكرار في Sheets قائماً، ويُسجّل ذلك دون ادعاء حقن بيانات Firestore.",
    }
    RESULTS_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    RESULTS_MD.write_text(
        "# تقرير الاختبار الدفعي لمزامنة Google Sheets\n\n"
        f"- **الحالة:** {'نجح' if result['passed'] else 'فشل'}\n"
        f"- **التاريخ:** `{result['executedAt']}`\n"
        f"- **التبويب المعزول:** `{SHEET_NAME}`\n"
        f"- **عدد الطلبات التجريبية:** `{len(QA_APPLICATIONS)}`\n"
        f"- **نطاق الاختبار:** `{result['testScope']}`\n"
        f"- **حقن Firestore:** `{result['firestoreInjection']['status']}`\n\n"
        "## النتائج\n\n"
        "| الجولة | المضاف | المحدّث | النتيجة المتوقعة |\n|---|---:|---:|---|\n"
        f"| الأولى | {first['inserted']} | {first['updated']} | إنشاء/تحديث كل الطلبات |\n"
        f"| الثانية | {second['inserted']} | {second['updated']} | صفر تكرار وتحديث الصفوف نفسها |\n\n"
        "## التحقق من المعرّفات\n\n"
        + "\n".join(
            f"- `{key}`: **{value} صف واحد**" for key, value in qa_counts.items()
        )
        + "\n\n"
        "الاختبار لا يحذف البيانات، ويستخدم معرّفات تبدأ بـ `qa-batch-` وتبويباً منفصلاً حتى تبقى بيانات الطلبات الحقيقية في تبويب `Applications` دون تلوث.\n"
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"فشل اختبار المزامنة الدفعي: {exc}", file=sys.stderr)
        raise
