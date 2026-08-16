# خطوات GitHub Actions المتبقية لربط Google Sheets (دليل نهائي)

**الحالة الحالية:** بنية GitHub Actions كاملة ومثبتة ومعمّلة. كل الخطوات حتى المصادقة نجحت في التشغيل اليدوي الثالث (رقم العملية [31927725432](https://github.com/ahmedsheta89-cell/elhawary-careers/actions/runs/31927725432)). المتبقي خطوة واحدة من طرفك داخل Google Cloud Console لا يمكنني تنفيذها لأنها تتطلب الوصول إلى حساب Google الخاص بمشروع السحابة، ولا يوجد فيها أي سر.

## ما تم إنجازه في GitHub

| البند | الحالة |
|---|---|
| Workflow الأسبوعي `weekly-sheets-monitor.yml` على `launch-readiness` | منشور ومُصحّح (التزام `76cd0e5`) |
| Dispatcher `sheets-monitor-dispatcher.yml` على `main` | منشور ومُصحّح (التزام `4a9bf3e`)، مجدول كل أحد 09:00 UTC |
| `scripts/weekly_sync_monitor.py` و`sheets_client.py` و`requirements-monitor.txt` | منشورة على `launch-readiness` (التزام `1aabbe0`) |
| نتائج تشغيل #3 | 6 خطوات نجحت حتى المصادقة، ثم توقيف متوقع حتى إعداد WIF |

## الخطوة الوحيدة المتبقية: Workload Identity Federation في Google Cloud

افتح [Google Cloud Console](https://console.cloud.google.com/iam-admin/workloadidentity/pools) واختر مشروع `elhawary-careers-2026` ثم أنفّذ:

### 1. إنشاء Service Account محدودة الصلاحيات (دقيقة واحدة)

1. افتح [IAM Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=elhawary-careers-2026)
2. **Create Service Account** → الاسم: `sheets-ci`
3. الخطوة التالية مباشرة دون أي دور (لا نحتاج Cloud IAM)
4. انقر على الحساب المنشأ → تبويب **Permissions** → **Grant Access** → ابحث عن **Service Account User** وامنحها للحساب فقط إن أردت التحكم فيها يدوياً (اختياري)
5. أهم نقطة في تبويب **Permissions**: **Grant Access** → ابحث عن **Workload Identity Token Creator** → امنحه للحساب نفسه

### 2. إنشاء WIF Pool وProvider

1. افتح [Workload Identity Federation](https://console.cloud.google.com/iam-admin/workloadidentity/pools?project=elhawary-careers-2026)
2. **Create Pool** → الاسم: `github-actions-pool`
3. **Add Provider** → النوع: **OpenID Connect (OIDC)**
4. اسم المزوّد: `github-provider`
5.issuer URL: `https://token.actions.githubusercontent.com`
6. Audience: `https://github.com/ahmedsheta89-cell`
7. Attribute mapping: `google.subject=assertion.sub` و`attribute.repository=assertion.repository`
8. Attribute condition (مهم للأمان): `attribute.repository == 'ahmedsheta89-cell/elhawary-careers'`

### 3. منح صلاحيات الكتابة على ملف Sheets فقط

احرص على أن تكون الصلاحيات على **ملف Sheets تحديداً** وليس على مستوى المشروع:

1. افتح [ملف Google Sheets](https://docs.google.com/spreadsheets/d/1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4/edit)
2. **Share** → أضف البريد الإلكتروني الكامل للحساب `sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com` بصلاحية **Editor**

### 4. ربط GitHub بأسماء المتغيرات (Environment Variables)

1. افتح [Repository Environments](https://github.com/ahmedsheta89-cell/elhawary-careers/settings/environments/new)
2. اسم البيئة: `sheets-monitoring` (نفس الاسم في Workflow)
3. ثم افتح [Repository Variables](https://github.com/ahmedsheta89-cell/elhawary-careers/settings/variables/actions) وأضف تحت البيئة `sheets-monitoring` ثلاثة متغيرات (Values غير سرية):

| Name | Value |
|---|---|
| `GCP_PROJECT_ID` | `elhawary-careers-2026` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | القيمة من Console بعد إنشاء Provider، صيغتها: `projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT` | `sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com` |

رقم المشروع يظهر أعلى صفحة Cloud Console أو من: `gcloud projects describe elhawary-careers-2026 --format="value(projectNumber)"`

## التحقق النهائي

بعد إتمام الخطوات الأربعة، من صفحة [Actions](https://github.com/ahmedsheta89-cell/elhawary-careers/actions/workflows/sheets-monitor-dispatcher.yml) اضغط **Run workflow → Run workflow**. النتيجة المتوقعة: كل الخطوات خضراء، وارتifacts تحمل ملفات `weekly-sync-monitor-results.json` و`batch-sync-test-results.json` و`batch-sync-test-report-ar.md` دون أي سر داخلها.

بعدها يبدأ التشغيل التلقائي كل أحد الساعة 09:00 UTC (12:00 بتوقيتك) دون أي تدخل.

## مبادئ الأمان المطبقة (غير قابلة للتجاوز)

- لا توجد مفاتيح خدمة طويلة العمر ولا OAuth في المستودع أو السجلات.
- المصادقة عبر OIDC قصير العمر لكل تشغيل فقط (Workload Identity Federation).
- الصلاحيات مقيدة بمستودع واحد بـ Attribute condition على مستوى Provider.
- الحساب `sheets-ci` يمكنه الوصول إلى ملف Sheets الوحيد المحدد، لا إلى أي Google service آخر.
- النتائج المرفوعة artifact لا تحتوي أي سر، وفترة بقائها 30 يوماً فقط.
- الكود يعمل محلياً عبر gws بنفس المنطق المستخدم في GitHub Actions.
