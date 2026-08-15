import json
import sys
from datetime import date, timedelta
from pathlib import Path

import requests

PROJECT_ID = 'elhawary-careers-2026'
CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com'
CONFIG_PATH = Path.home() / '.config/configstore/firebase-tools.json'
TOKEN_URL = 'https://oauth2.googleapis.com/token'
COLLECTION_URL = (
    f'https://firestore.googleapis.com/v1/projects/{PROJECT_ID}'
    '/databases/(default)/documents/jobs'
)


def load_tokens():
    data = json.loads(CONFIG_PATH.read_text())
    return data['tokens']


def get_access_token(tokens):
    access_token = tokens.get('access_token')
    if access_token:
        return access_token
    response = requests.post(
        TOKEN_URL,
        data={
            'client_id': CLIENT_ID,
            'grant_type': 'refresh_token',
            'refresh_token': tokens['refresh_token'],
        },
        timeout=20,
    )
    response.raise_for_status()
    return response.json()['access_token']


def value(item):
    if isinstance(item, str):
        return {'stringValue': item}
    if isinstance(item, bool):
        return {'booleanValue': item}
    if isinstance(item, int):
        return {'integerValue': str(item)}
    if isinstance(item, float):
        return {'doubleValue': item}
    if isinstance(item, list):
        return {'arrayValue': {'values': [value(v) for v in item]}}
    if isinstance(item, dict):
        return {'mapValue': {'fields': {k: value(v) for k, v in item.items()}}}
    raise TypeError(f'Unsupported value: {type(item)!r}')


def main():
    today = date.today()
    payload = {
        'fields': {
            'title': value({'ar': 'صيدلي فرع', 'en': 'Branch Pharmacist'}),
            'description': value({
                'ar': 'نبحث عن صيدلي للانضمام إلى فريق صيدلية الهواري والمساهمة في تقديم خدمة دوائية متميزة للعملاء.',
                'en': 'We are looking for a pharmacist to join El Hawary Pharmacy and deliver excellent pharmaceutical service to our customers.',
            }),
            'requirements': value({
                'ar': [
                    'بكالوريوس صيدلة من جامعة معتمدة.',
                    'ترخيص مزاولة المهنة ساري.',
                    'مهارات تواصل وخدمة عملاء جيدة.',
                    'الالتزام بسياسات الصيدلية والعمل ضمن الفريق.',
                ],
                'en': [
                    'Bachelor of Pharmacy degree from an accredited university.',
                    'Valid professional license.',
                    'Good communication and customer-service skills.',
                    'Commitment to pharmacy policies and teamwork.',
                ],
            }),
            'responsibilities': value({
                'ar': [
                    'صرف الوصفات والأدوية وفق الإجراءات المعتمدة.',
                    'تقديم المشورة الدوائية المناسبة للعملاء.',
                    'متابعة المخزون وتواريخ الصلاحية.',
                    'الحفاظ على جودة وترتيب الفرع.',
                ],
                'en': [
                    'Dispense prescriptions and medicines according to approved procedures.',
                    'Provide appropriate pharmaceutical guidance to customers.',
                    'Monitor inventory and expiry dates.',
                    'Maintain branch quality and organization.',
                ],
            }),
            'category': value('pharmacist'),
            'type': value('full-time'),
            'experienceLevel': value('entry'),
            'educationLevel': value('bachelor'),
            'location': value({
                'city': 'جمهورية مصر العربية',
                'governorate': 'جميع الفروع حسب الاحتياج',
                'address': 'فروع صيدلية الهواري',
            }),
            'benefits': value([
                'بيئة عمل احترافية.',
                'فرص للتعلم والتطور.',
                'راتب ومزايا تنافسية حسب الخبرة.',
            ]),
            'postedDate': value(today.isoformat()),
            'expiryDate': value((today + timedelta(days=90)).isoformat()),
            'isActive': value(True),
            'applicationCount': value(0),
            'updatedAt': value(today.isoformat()),
        }
    }

    tokens = load_tokens()
    token = get_access_token(tokens)
    response = requests.post(
        COLLECTION_URL,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        json=payload,
        timeout=30,
    )
    if response.status_code == 401 and tokens.get('refresh_token'):
        refreshed = requests.post(
            TOKEN_URL,
            data={
                'client_id': CLIENT_ID,
                'grant_type': 'refresh_token',
                'refresh_token': tokens['refresh_token'],
            },
            timeout=20,
        )
        refreshed.raise_for_status()
        token = refreshed.json()['access_token']
        response = requests.post(
            COLLECTION_URL,
            headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
            json=payload,
            timeout=30,
        )
    if not response.ok:
        print(f'Firestore create failed: {response.status_code}', file=sys.stderr)
        print(response.text[:1000], file=sys.stderr)
        raise SystemExit(1)
    created = response.json()
    print(created.get('name', 'created'))


if __name__ == '__main__':
    main()
