"""Check whether the current Google Workspace OAuth token grants IAM/CRM scopes.

Checks the IAM and Resource Manager REST surfaces the WIF setup would need.
Prints only pass/fail status; never prints token values.
"""
import json
import os
import urllib.error
import urllib.request

TOKEN_ENVS = ("GOOGLE_WORKSPACE_CLI_TOKEN", "GOOGLE_DRIVE_TOKEN")

ENDPOINTS = (
    "https://iam.googleapis.com/v1/projects/elhawary-careers-2026/serviceAccounts",
    "https://cloudresourcemanager.googleapis.com/v1/projects",
    "https://iam.googleapis.com/v1/projects/elhawary-careers-2026/locations/global/workloadIdentityPools",
)


def main() -> int:
    token = next((os.environ[k] for k in TOKEN_ENVS if os.environ.get(k)), None)
    if not token:
        print("STATUS=NO_TOKEN")
        return 1
    for url in ENDPOINTS:
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            resp = urllib.request.urlopen(req, timeout=20)
            body = resp.read().decode()
            print(f"URL={url.split('//')[1].split('/')[1]} STATUS=ACCESS len={len(body)}")
        except urllib.error.HTTPError as e:
            print(f"URL={url.split('//')[1].split('/')[1]} STATUS=HTTP_{e.code}")
        except Exception as e:  # noqa: BLE001
            print(f"URL={url.split('//')[1].split('/')[1]} STATUS=ERROR {type(e).__name__}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
