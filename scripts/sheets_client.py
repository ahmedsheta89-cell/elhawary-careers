"""Google Sheets adapter for local gws and GitHub OIDC authentication."""
from __future__ import annotations

import json
import os
import subprocess
from typing import Any

SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets"


def _params(service_args: list[str]) -> dict[str, Any]:
    try:
        index = service_args.index("--params")
        return json.loads(service_args[index + 1])
    except (ValueError, IndexError, json.JSONDecodeError) as exc:
        raise RuntimeError("تعذر تحليل معاملات Google Sheets") from exc


def _api_enabled() -> bool:
    return bool(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))


def _api_call(service_args: list[str], body: dict[str, Any] | None) -> dict[str, Any]:
    try:
        import google.auth
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise RuntimeError(
            "يلزم تثبيت google-auth وgoogle-api-python-client عند استخدام اعتماد GitHub OIDC"
        ) from exc

    credentials, _ = google.auth.default(scopes=[SHEETS_SCOPE])
    service = build("sheets", "v4", credentials=credentials, cache_discovery=False)
    params = _params(service_args)
    if service_args[:2] != ["sheets", "spreadsheets"]:
        raise RuntimeError(f"مسار Sheets غير مدعوم: {' '.join(service_args)}")
    if service_args[2] == "get":
        return service.spreadsheets().get(**params).execute()
    if service_args[2] == "batchUpdate":
        return service.spreadsheets().batchUpdate(body=body or {}, **params).execute()
    if service_args[2] == "values":
        operation = service_args[3]
        values = service.spreadsheets().values()
        if operation == "get":
            return values.get(**params).execute()
        if operation == "update":
            return values.update(body=body or {}, **params).execute()
        if operation == "append":
            return values.append(body=body or {}, **params).execute()
    raise RuntimeError(f"أمر Sheets غير مدعوم: {' '.join(service_args)}")


def sheets_call(service_args: list[str], *, body: dict[str, Any] | None = None) -> dict[str, Any]:
    """Run a Sheets request using OIDC credentials in CI or gws locally."""
    if _api_enabled():
        return _api_call(service_args, body)

    command = ["gws", *service_args, "--format", "json"]
    if body is not None:
        command.extend(["--json", json.dumps(body, ensure_ascii=False)])
    result = subprocess.run(command, check=False, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"gws فشل: {result.stderr.strip() or result.stdout.strip()}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"استجابة gws ليست JSON: {result.stdout[:500]}") from exc
