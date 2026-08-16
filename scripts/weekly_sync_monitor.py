#!/usr/bin/env python3
"""Read-only Google Sheets health monitor with optional isolated QA performance test."""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SPREADSHEET_ID = os.getenv(
    "ELHAWARY_SPREADSHEET_ID", "1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4"
)
APPLICATIONS_SHEET = os.getenv("ELHAWARY_APPLICATIONS_SHEET", "Applications")
QA_SHEET = os.getenv("ELHAWARY_QA_SHEET", "QA_Batch_Test")
EXPECTED_HEADERS = [
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
EXPECTED_QA_IDS = [f"qa-batch-{number:03d}" for number in range(1, 5)]


def gws_values(range_name: str) -> tuple[list[list[str]], float]:
    started = time.perf_counter()
    command = [
        "gws",
        "sheets",
        "spreadsheets",
        "values",
        "get",
        "--params",
        json.dumps({"spreadsheetId": SPREADSHEET_ID, "range": range_name}, ensure_ascii=False),
        "--format",
        "json",
    ]
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
    if completed.returncode != 0:
        raise RuntimeError(
            f"gws failed for {range_name}: {completed.stderr.strip() or completed.stdout.strip()}"
        )
    try:
        payload = json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"gws returned invalid JSON for {range_name}") from error
    return payload.get("values", []), elapsed_ms


def id_counts(rows: list[list[str]]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for row in rows[1:]:
        application_id = row[0].strip() if row else ""
        if application_id:
            counts[application_id] = counts.get(application_id, 0) + 1
    return counts


def parse_timestamp(value: str) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def run_batch_test() -> dict[str, Any]:
    started = time.perf_counter()
    command = [sys.executable, "scripts/batch_sync_test.py"]
    completed = subprocess.run(command, capture_output=True, text=True, check=False)
    elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
    result_path = Path("batch-sync-test-results.json")
    result: dict[str, Any] = {}
    if result_path.exists():
        try:
            result = json.loads(result_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            result = {"passed": False, "parseError": True}
    result["processReturnCode"] = completed.returncode
    result["durationMs"] = elapsed_ms
    if completed.returncode != 0:
        result["processStderr"] = completed.stderr[-2000:]
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Weekly El Hawary Google Sheets monitor")
    parser.add_argument("--run-batch-test", action="store_true", help="run isolated two-round QA test")
    parser.add_argument(
        "--max-stale-days",
        type=float,
        default=7.0,
        help="flag the newest production sync as stale after this many days",
    )
    args = parser.parse_args()

    checked_at = datetime.now(timezone.utc)
    report: dict[str, Any] = {
        "checkedAt": checked_at.isoformat().replace("+00:00", "Z"),
        "spreadsheetId": SPREADSHEET_ID,
        "applicationsSheet": APPLICATIONS_SHEET,
        "qaSheet": QA_SHEET,
        "checks": {},
        "passed": False,
    }

    try:
        application_values, applications_read_ms = gws_values(
            f"{APPLICATIONS_SHEET}!A1:O"
        )
        qa_values, qa_read_ms = gws_values(f"{QA_SHEET}!A1:O")
    except RuntimeError as error:
        report["error"] = str(error)
        Path("weekly-sync-monitor-results.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 2

    application_headers = application_values[0] if application_values else []
    qa_headers = qa_values[0] if qa_values else []
    application_counts = id_counts(application_values)
    qa_counts = id_counts(qa_values)
    all_application_duplicates = {
        key: count for key, count in application_counts.items() if count > 1
    }
    qa_issues = {
        key: qa_counts.get(key, 0)
        for key in EXPECTED_QA_IDS
        if qa_counts.get(key, 0) != 1
    }

    last_sync_values: list[datetime] = []
    malformed_timestamps = 0
    for row in application_values[1:]:
        timestamp = parse_timestamp(row[14].strip() if len(row) > 14 else "")
        if timestamp is None:
            if row and any(cell.strip() for cell in row):
                malformed_timestamps += 1
        else:
            last_sync_values.append(timestamp)
    newest_sync = max(last_sync_values) if last_sync_values else None
    age_days = (
        round((checked_at - newest_sync).total_seconds() / 86400, 3)
        if newest_sync
        else None
    )

    report["checks"] = {
        "applicationsHeaderMatches": application_headers == EXPECTED_HEADERS,
        "qaHeaderMatches": qa_headers == EXPECTED_HEADERS,
        "applicationsDataRows": max(len(application_values) - 1, 0),
        "applicationsUniqueIds": len(application_counts),
        "applicationsDuplicateIds": all_application_duplicates,
        "qaExpectedIds": EXPECTED_QA_IDS,
        "qaRowCounts": {key: qa_counts.get(key, 0) for key in EXPECTED_QA_IDS},
        "qaIssues": qa_issues,
        "malformedLastSyncTimestamps": malformed_timestamps,
        "newestApplicationSync": newest_sync.isoformat().replace("+00:00", "Z")
        if newest_sync
        else None,
        "newestSyncAgeDays": age_days,
        "staleThresholdDays": args.max_stale_days,
        "staleSync": age_days is not None and age_days > args.max_stale_days,
        "readLatencyMs": {
            "applications": applications_read_ms,
            "qa": qa_read_ms,
        },
    }

    if args.run_batch_test:
        report["batchTest"] = run_batch_test()

    structural_pass = (
        report["checks"]["applicationsHeaderMatches"]
        and report["checks"]["qaHeaderMatches"]
        and not all_application_duplicates
        and not qa_issues
        and malformed_timestamps == 0
    )
    batch_pass = not args.run_batch_test or bool(report.get("batchTest", {}).get("passed"))
    report["passed"] = structural_pass and batch_pass
    Path("weekly-sync-monitor-results.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

