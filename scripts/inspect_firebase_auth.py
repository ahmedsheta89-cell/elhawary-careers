import json
from pathlib import Path

candidates = [
    Path.home() / '.config/configstore/firebase-tools.json',
    Path.home() / '.config/configstore/firebase-tools.json.backup',
]
for path in candidates:
    if not path.exists():
        continue
    try:
        data = json.loads(path.read_text())
    except Exception as exc:
        print(path, 'unreadable', type(exc).__name__)
        continue
    print(path)
    if isinstance(data, dict):
        print('top-level keys:', sorted(data.keys()))
        tokens = data.get('tokens')
        if isinstance(tokens, dict):
            print('token keys:', sorted(tokens.keys()))
            print('has refresh_token:', bool(tokens.get('refresh_token')))
            print('has access_token:', bool(tokens.get('access_token')))
    else:
        print('not a dict')
