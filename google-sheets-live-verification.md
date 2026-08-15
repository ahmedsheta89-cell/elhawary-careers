# سجل التحقق الحي من تكامل Google Sheets

**التاريخ:** 16 أغسطس 2026

**الرابط:** https://elhawary-careers-2026.web.app/admin

**الحساب المستخدم:** مدير النظام — ahmed.sheta89@gmail.com

## النتيجة

تم فتح لوحة الإدارة الحية بنجاح بعد اكتمال التحقق من صلاحيات الحساب. ظهر تبويب **الطلبات** ضمن تبويبات لوحة الإدارة، وعند فتحه ظهرت بطاقة **Google Sheets** بعنوان «تكامل اختياري وآمن».

ظهرت البطاقة للمدير مع الحقول التالية:

- Google OAuth Client ID
- Spreadsheet ID
- اسم ورقة العمل
- حفظ إعدادات Sheets
- مزامنة الطلبات الآن

ظهر في البطاقة توضيح أن Firestore هو المصدر الأساسي، وأن رمز Google المميز لا يُخزّن في Firestore ويبقى مؤقتاً داخل جلسة المتصفح. كما ظهر أن التكامل مخصص للمدير فقط.

لم تُنفّذ مزامنة فعلية في هذا الاختبار لعدم إدخال OAuth Client ID أو Spreadsheet ID حقيقيين، ولتجنب إنشاء ملف أو صفوف اختبارية في حساب Google. يلزم تنفيذ اختبار مزامنة مضبوط بعد إكمال إعداد Google Cloud وفق الدليل `GOOGLE_SHEETS_SETUP_AR.md`.

## النشر المرتبط

- الالتزام البرمجي لتكامل Sheets: `b33541f`
- آخر نشر ناجح بعد التوثيق: `157908d`
- تشغيل GitHub Actions الأخير: https://github.com/ahmedsheta89-cell/elhawary-careers/actions/runs/31912389385
- النتيجة: lint وtypecheck وbuild وFirebase Hosting وFirestore Rules — ناجحة.
