# حالة إعداد WIF — تحديث لحظي (16 أغسطس 2026)

## ما اكتمل حتى الآن (مؤكد):

### GitHub Environment `sheets-monitoring` — 6 متغيرات كاملة:
| المتغير | القيمة |
|---|---|
| ELHAWARY_APPLICATIONS_SHEET | Applications |
| ELHAWARY_QA_SHEET | QA_Batch_Test |
| ELHAWARY_SPREADSHEET_ID | 1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4 |
| GCP_PROJECT_ID | elhawary-careers-2026 |
| GCP_SERVICE_ACCOUNT | sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com |
| GCP_WORKLOAD_IDENTITY_PROVIDER | projects/727033358903/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider |

### Google Cloud (حسب صور المستخدم):
- حساب الخدمة `sheets-ci` أُنشئ (رسالة "Service account created")
- Pool `github-actions-pool` بدأ إنشاؤه في نموذج New workload provider and pool
- Provider `github-provider`: Issuer صحيح، Allowed audiences صحيح (`https://github.com/ahmedsheta89-cell`)
- **لم يُؤكد حفظ Attribute mapping والـ Condition والـ Save النهائي**

## نتيجة آخر اختبار (Run #5, https://github.com/ahmedsheta89-cell/elhawary-careers/actions/runs/31945193751):
- فشل في خطوة google-github-actions/auth
- الخطأ: `invalid_target` — "The target service indicated by the 'audience' parameters is invalid. This might either be because the pool or provider is disabled or deleted or because it doesn't exist."
- التشخيص: Provider `github-provider` غير موجود فعلياً في Google Cloud بعد

## عقبات:
1. متصفح المستخدم: يحتاج تسجيل دخول Google مع CAPTCHA — تعذر الآلي
2. GitHub API (gh): GitHub App المثبّت يقرأ فقط، لا يستطيع إنشاء متغيرات أو dispatch — dispatch عبر واجهة GitHub نجح يدوياً
3. المتصفح الجديد (sandbox) غير مسجل دخول في Google — صفحة Sign in

## الخطوات المتبقية:
1. تأكيد المستخدم حفظ Provider في Google Cloud (mapping + condition + Save)
2. التأكد من مشاركة ملف Sheets مع sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com كـ Editor
3. إعادة تشغيل Sheets Monitor Dispatcher #6 يدوياً من واجهة GitHub Actions: https://github.com/ahmedsheta89-cell/elhawary-careers/actions/workflows/sheets-monitor-dispatcher.yml
4. التحقق من النجاح → تحديث التوثيق والمهارة → التسليم النهائي

## معلومات مرجعية:
- Project Number: 727033358903
- Issuer: https://token.actions.githubusercontent.com
- Condition: attribute.repository == 'ahmedsheta89-cell/elhawary-careers'
- Workflow: sheets-monitor-dispatcher.yml على main → ينشغل weekly-sheets-monitor.yml على launch-readiness
- موقع المنصة: https://elhawary-careers-2026.web.app/

## تحديث 2026-08-16: الحفظ المؤكد من صورة المستخدم
- رسالة نجاح ظاهرة: "Successfully created the pool and added the provider."
- نافذة Grant access مفتوحة، الخيارات:
  1) Grant access using federated identities (Recommended) - Download config (ADC)
  2) Grant access using service account impersonation
- ملاحظة: الخيار الافتراضي المحدد هو federated identities، لكن المطلوب فعلياً ربط service account impersonation لحساب sheets-ci
- ملاحظة مهمة: Workflow الحالي (بعد التعديل الذي رفعه المستخدم عبر واجهة GitHub) يضيف audience: https://github.com/ahmedsheta89-cell
  - إذا كان Provider محفوظاً على Default audience فقد يفشل OIDC؛ يجب التحقق من خيار Audiences في Provider settings


## تحديث 2026-08-16: نتيجة التشغيل رقم 6 بعد حفظ Provider
- Pool وProvider ظهرا فعلياً بحالة Enabled في Google Cloud.
- GitHub Environment يحتوي المتغيرات الستة المطلوبة.
- التشغيل: https://github.com/ahmedsheta89-cell/elhawary-careers/actions/runs/31963314363
- النتيجة: فشل في خطوة `Authenticate to Google Cloud with GitHub OIDC` فقط، قبل تشغيل فحص Sheets.
- الخطأ الدقيق: `invalid_grant` لأن Audience في ID Token هو مسار Provider الافتراضي `https://iam.googleapis.com/projects/727033358903/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider` بينما Provider يتوقع Audience مختلفاً.
- الاستنتاج التنفيذي: يجب توحيد Audience بين Google Cloud وWorkflow. بما أن Provider أنشئ مع Allowed audience `https://github.com/ahmedsheta89-cell`، فالحل المباشر هو تمرير `audience: https://github.com/ahmedsheta89-cell` داخل كل خطوة `google-github-actions/auth` في Workflowين، ثم إعادة التشغيل. بعد نجاح المصادقة نتحقق من صلاحية `roles/iam.workloadIdentityUser` وقراءة ملف Sheets.

## تحديث 2026-08-16: هوية حساب الخدمة الفعلية

أظهرت صور Google Cloud من صفحة Service account details أن الحساب موجود فعلياً، لكن بريده ليس البريد الذي استُخدم في Workflow.

| العنصر | القيمة |
|---|---|
| اسم الحساب الظاهر | `sheets-ci` |
| البريد الفعلي | `id-sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com` |
| البريد السابق الخاطئ | `sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com` |
| سبب خطأ Run #7 | `404 Not found; Gaia id not found` للبريد السابق |

الاستنتاج: لا حاجة لإنشاء حساب جديد أو حذف Pool/Provider. يجب تعديل `GCP_SERVICE_ACCOUNT` في GitHub Environment، ومشاركة Google Sheets، ومنح Workload Identity User باستخدام البريد الفعلي `id-sheets-ci@elhawary-careers-2026.iam.gserviceaccount.com`.

روابط المتابعة:
- GitHub Environment: https://github.com/ahmedsheta89-cell/elhawary-careers/settings/environments
- Google Sheets: https://docs.google.com/spreadsheets/d/1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4/edit
- WIF Pool: https://console.cloud.google.com/iam-admin/workloadidentity-pools/pool?project=elhawary-careers-2026&pool=github-actions-pool

