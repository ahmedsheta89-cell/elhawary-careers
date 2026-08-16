# بحث Google الرسمي عن إنشاء OAuth Client

تم البحث في 2026-08-16 أثناء إكمال ربط Google Sheets.

## النتيجة

Google توثق مورداً باسم `projects.locations.oauthClients` في Google Cloud IAM، مع عمليات إنشاء وسرد ووصف وتحديث وحذف OAuth clients. كما توجد وثائق `gcloud iam oauth-clients create`.

## الروابط الرسمية

- REST resource: https://docs.cloud.google.com/iam/docs/reference/rest/v1/projects.locations.oauthClients
- gcloud create: https://docs.cloud.google.com/sdk/gcloud/reference/iam/oauth-clients/create
- OAuth setup: https://support.google.com/googleapi/answer/6158849?hl=en

## صلاحية متاحة محلياً

جلسة Firebase CLI الموثّقة للحساب `ahmedsheta89@gmail.com` تحتوي على نطاق `https://www.googleapis.com/auth/cloud-platform`، ويمكن استخدامها لاستدعاء Google Cloud APIs دون عرض الرمز أو كلمة المرور. جلسة Google Workspace منفصلة تحتوي على Drive/Sheets فقط ولا تكفي وحدها لإنشاء OAuth Client.

## قيد مهم

المورد `projects.locations.oauthClients` قد يخص OAuth application integration في IAM/Workforce Identity، وليس بالضرورة نفس عميل Web الذي ينشئه Google Auth Platform لواجهة JavaScript. يجب التحقق من schema والـ API قبل الإنشاء، وعدم استخدامه إذا كان نوع المورد غير مناسب للتطبيق.

## النتيجة الحاسمة

توضح وثائق Google الرسمية أن Web OAuth Client الخاص بتطبيق JavaScript يُنشأ من Google Auth Platform → Clients، باختيار Web application وإضافة Authorized JavaScript origins. أما مورد `projects.locations.oauthClients` في IAM فهو لتكامل OAuth الخاص بـ Workforce Identity Federation، ويعمل فقط مع Identity-Aware Proxy؛ لذلك لم يتم استخدامه لإنشاء اعتماد بديل للموقع.

المطلوب للموقع:

- Web application client في Google Auth Platform.
- Authorized JavaScript origin: `https://elhawary-careers-2026.web.app`.
- Client ID فقط داخل لوحة الإدارة، دون Client Secret.

المراجع:

- https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
- https://support.google.com/cloud/answer/15549257
- https://docs.cloud.google.com/iam/docs/workforce-manage-oauth-app

## خيار Apps Script الاحتياطي

أوامر Google Workspace الموثّقة في الجلسة تدعم إنشاء مشاريع Apps Script، تحديث محتواها، إنشاء نسخ، وإنشاء Deployments. يمكن استخدام ذلك كخيار خلفي مجاني، لكن لم يتم اعتماده تلقائياً لأن نشر Web App واستدعاؤه من Firebase يحتاج ضبط وصول وسرّ/مصادقة إضافية، وقد يغيّر التصميم الحالي الذي يعتمد على OAuth مباشر من لوحة المدير.
