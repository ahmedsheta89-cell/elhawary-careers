# حالة إعداد Google Sheets

- المشروع: `elhawary-careers-2026`
- Google Sheets API: **Enabled** كما ظهر في لقطة المستخدم.
- صفحة بيانات الاعتماد تفتح مسار Google Auth Platform.
- المتبقي: إعداد شاشة موافقة OAuth ثم إنشاء OAuth Client ID من نوع Web application، وإضافة أصل الموقع `https://elhawary-careers-2026.web.app`.
- العائق الحالي: جلسة المتصفح الآلية تعود إلى صفحة تسجيل الدخول في Google عند فتح صفحات Credentials/Branding، لذلك يجب أن يكمل المستخدم مصادقة Google يدوياً دون مشاركة كلمة المرور.
- لا حاجة لإنشاء مشروع Google Cloud جديد؛ الحساب بلغ حد المشاريع، والمشروع الحالي مناسب.

تم حفظ هذه الملاحظة في 2026-08-16 أثناء متابعة الإعداد.

## تحقق Google Workspace في 16 أغسطس 2026

تم التحقق عبر Google Workspace من ملف `El Hawary Careers Applications` بالمعرّف `1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4`. الملف يحتوي على تبويب مستقل باسم `Applications`، مثبت الصف الأول، ومُجهز بفلتر على الأعمدة الخمسة عشر. الصف الأول يحتوي على رؤوس الطلبات التالية: معرّف الطلب، تاريخ التقديم، الحالة، معرّف الوظيفة، المسمى الوظيفي، اسم المتقدم، البريد الإلكتروني، الهاتف، واتساب، العنوان، المؤهل العلمي، الخبرات العملية، المهارات، السيرة الذاتية، وآخر مزامنة. لا توجد صفوف طلبات بعد؛ التبويب جاهز للمزامنة الأولى من لوحة الإدارة.

رابط الملف: https://docs.google.com/spreadsheets/d/1xiU35KLjJg2r9dOUwaEV28SWFft8937cIjLDhWjxNt4/edit

## مزامنة فعلية للتحقق في 16 أغسطس 2026

تمت قراءة طلب واحد من Firestore بحالة `shortlisted`، وتجهيز صفه بنفس ترتيب خدمة `googleSheetsService.ts` ثم إدراجه في تبويب `Applications` عبر الحساب الموثّق. بعد الإدراج تمت إعادة قراءة الورقة والتحقق من وجود صف عناوين واحد وصف طلب واحد، مع 15 عموداً، ومعرّف طلب فريد واحد، و`duplicateApplicationIds: 0`.

هذه المزامنة أثبتت صحة ملف Sheets، ترتيب الأعمدة، وصحة تحويل بيانات الطلب. تشغيل المزامنة من واجهة الويب نفسها ما زال يتطلب OAuth Web Client ID من Google Auth Platform، وهو الاعتماد الوحيد غير المنشأ حتى الآن.

## الحالة النهائية بعد إنشاء OAuth Web Client
تم إنشاء OAuth Web Client من نوع Web application للمشروع الإنتاجي، مع إضافة أصل الموقع `https://elhawary-careers-2026.web.app`. تم حفظ Client ID في `settings/googleSheets` مع إبقاء Client Secret خارج المشروع وFirestore وGitHub. ملف Sheets وتبويب Applications جاهزان، ونتيجة المزامنة الفعلية السابقة ما زالت صفاً واحداً فريداً بلا تكرار. الاختبار الوحيد غير المؤكد آلياً هو ضغط زر المزامنة من جلسة المدير في واجهة الويب، لأن التبويب المتصل بالأتمتة لا يعرض جلسة المدير المفتوحة في نافذة Chrome الشخصية.

## 16 أغسطس 2026 — اختبار دفعي وتقييم Background Sync

- أُنشئ تبويب QA معزول باسم `QA_Batch_Test` داخل ملف `El Hawary Careers Applications`.
- نُفذت أربع هويات اختبار حتمية: `qa-batch-001` إلى `qa-batch-004`.
- الجولة الأولى: `inserted=4`, `updated=0`.
- الجولة الثانية: `inserted=0`, `updated=4`.
- تحقق القراءة المباشرة من `QA_Batch_Test!A1:O5` من وجود كل معرّف مرة واحدة فقط، وبقاء المخطط 15 عموداً.
- حاول السكربت إنشاء/تحديث طلبات QA في Firestore، لكن Firebase CLI access token المحلي رُفض من Firestore بـ HTTP 401؛ لذلك سُجل النطاق بوضوح كـ `sheets_layer_only` ولم تُعتبر بيانات Sheets بيانات طلبات إنتاجية.
- أُضيف `scripts/batch_sync_test.py` وتقريرا `batch-sync-test-results.json` و`batch-sync-test-report-ar.md`.
- التوصية التشغيلية: الإبقاء على المزامنة اليدوية المجانية؛ عدم تفعيل مزامنة خلفية فورية دون طبقة خادم ومتطلبات فوترة واضحة.
- تم تحديث مهارة التشغيل `elhawary-careers-operations` والتحقق منها بنجاح عبر `quick_validate.py`.
