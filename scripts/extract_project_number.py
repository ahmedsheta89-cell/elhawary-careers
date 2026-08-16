#!/usr/bin/env python3
import json
import sys

payload = json.load(sys.stdin)
items = payload.get("result", payload) if isinstance(payload, dict) else payload
for project in items:
    if project.get("projectId") == "elhawary-careers-2026":
        print(f"{project.get('projectId')}|{project.get('projectNumber')}")
        break
else:
    raise SystemExit("project not found")
