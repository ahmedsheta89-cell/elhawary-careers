import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Input, Textarea } from '@/app/components/ui/input';
import type { PageAppearance, SiteContent, SiteText } from '@/services/siteContentService';

type AboutContent = SiteContent['pages']['about'];
type BenefitsContent = SiteContent['pages']['benefits'];

type Props = {
  value: SiteContent;
  onChange: (next: SiteContent) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  saved: boolean;
};

const emptyText: SiteText = { ar: '', en: '' };

function TextPair({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: SiteText;
  onChange: (next: SiteText) => void;
  multiline?: boolean;
}) {
  const Component = multiline ? Textarea : Input;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Component
        label={`${label} — عربي`}
        value={value.ar}
        dir="rtl"
        onChange={(event) => onChange({ ...value, ar: event.target.value })}
      />
      <Component
        label={`${label} — English`}
        value={value.en}
        dir="ltr"
        onChange={(event) => onChange({ ...value, en: event.target.value })}
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
          aria-label={label}
        />
        <code className="min-w-[72px] text-left text-xs text-slate-500">{value}</code>
      </span>
    </label>
  );
}

function AppearanceEditor({
  value,
  onChange,
  flags,
}: {
  value: PageAppearance;
  onChange: (next: PageAppearance) => void;
  flags: Array<{ key: keyof PageAppearance; label: string }>;
}) {
  const update = (patch: Partial<PageAppearance>) => onChange({ ...value, ...patch });
  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <summary className="cursor-pointer font-bold text-slate-800">المظهر والأقسام الظاهرة</summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ColorInput label="لون بداية التدرج" value={value.heroFrom} onChange={(heroFrom) => update({ heroFrom })} />
        <ColorInput label="لون نهاية التدرج" value={value.heroTo} onChange={(heroTo) => update({ heroTo })} />
        <ColorInput label="لون نص العنوان" value={value.heroText} onChange={(heroText) => update({ heroText })} />
        <ColorInput label="لون النص الثانوي" value={value.heroMuted} onChange={(heroMuted) => update({ heroMuted })} />
        <ColorInput label="خلفية الأقسام" value={value.sectionBackground} onChange={(sectionBackground) => update({ sectionBackground })} />
        <ColorInput label="خلفية البطاقات" value={value.cardBackground} onChange={(cardBackground) => update({ cardBackground })} />
        <ColorInput label="حدود البطاقات" value={value.cardBorder} onChange={(cardBorder) => update({ cardBorder })} />
        <ColorInput label="اللون المميز" value={value.accent} onChange={(accent) => update({ accent })} />
        <ColorInput label="بداية تدرج الدعوة" value={value.ctaFrom} onChange={(ctaFrom) => update({ ctaFrom })} />
        <ColorInput label="نهاية تدرج الدعوة" value={value.ctaTo} onChange={(ctaTo) => update({ ctaTo })} />
        <ColorInput label="نص الدعوة" value={value.ctaText} onChange={(ctaText) => update({ ctaText })} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {flags.map((flag) => (
          <label key={String(flag.key)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={Boolean(value[flag.key])}
              onChange={(event) => update({ [flag.key]: event.target.checked } as Partial<PageAppearance>)}
              className="h-4 w-4 accent-sky-600"
            />
            {flag.label}
          </label>
        ))}
      </div>
    </details>
  );
}

function EditorActions({ onSave, onReset, saving, saved }: Omit<Props, 'value' | 'onChange'>) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
      {saved ? <span className="text-sm font-bold text-emerald-700">تم حفظ التغييرات بنجاح.</span> : <span className="text-xs text-slate-500">الحفظ متاح للمدير فقط.</span>}
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onReset} disabled={saving} className="rounded-xl">تراجع</Button>
        <Button type="button" onClick={onSave} loading={saving} className="rounded-xl bg-sky-700 px-5 hover:bg-sky-800">حفظ تغييرات الصفحة</Button>
      </div>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <h4 className="text-lg font-black text-slate-900">{title}</h4>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

export function PageContentEditor({ value, onChange, onSave, onReset, saving, saved }: Props) {
  const about = value.pages.about;
  const benefits = value.pages.benefits;

  const updateAbout = (patch: Partial<AboutContent>) =>
    onChange({ ...value, pages: { ...value.pages, about: { ...about, ...patch } } });
  const updateBenefits = (patch: Partial<BenefitsContent>) =>
    onChange({ ...value, pages: { ...value.pages, benefits: { ...benefits, ...patch } } });

  const updateAboutParagraph = (index: number, next: SiteText) => {
    const storyParagraphs = about.storyParagraphs.map((item, itemIndex) => itemIndex === index ? next : item);
    updateAbout({ storyParagraphs });
  };
  const updateAboutValue = (index: number, patch: Partial<AboutContent['values'][number]>) => {
    const values = about.values.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    updateAbout({ values });
  };
  const updateBenefitItem = (index: number, patch: Partial<BenefitsContent['items'][number]>) => {
    const items = benefits.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    updateBenefits({ items });
  };
  const updateAdditionalItem = (index: number, patch: Partial<BenefitsContent['additionalItems'][number]>) => {
    const additionalItems = benefits.additionalItems.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    updateBenefits({ additionalItems });
  };
  const updateGrowthStage = (index: number, patch: Partial<BenefitsContent['growthStages'][number]>) => {
    const growthStages = benefits.growthStages.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item);
    updateBenefits({ growthStages });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-100 bg-sky-50/50 p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-sky-700">تحكم بصري كامل</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">محرر تبويب «من نحن»</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">عدّل كل النصوص، أضف أو احذف الفقرات والقيم، وتحكم في الألوان والأقسام الظاهرة دون لمس الكود.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-sky-700 shadow-sm">صفحة عامة: /about</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <SectionHeading title="واجهة الصفحة" />
            <TextPair label="الشارة" value={about.eyebrow} onChange={(eyebrow) => updateAbout({ eyebrow })} />
            <TextPair label="العنوان الرئيسي" value={about.title} onChange={(title) => updateAbout({ title })} />
            <TextPair label="الوصف" value={about.description} onChange={(description) => updateAbout({ description })} multiline />
          </div>

          <div className="space-y-4">
            <SectionHeading title="قسم قصتنا" />
            <TextPair label="شارة القصة" value={about.storyBadge} onChange={(storyBadge) => updateAbout({ storyBadge })} />
            <TextPair label="عنوان القصة" value={about.storyTitle} onChange={(storyTitle) => updateAbout({ storyTitle })} />
            {about.storyParagraphs.map((paragraph, index) => (
              <div key={`about-paragraph-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800">الفقرة {index + 1}</span>
                  <Button type="button" variant="outline" onClick={() => updateAbout({ storyParagraphs: about.storyParagraphs.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg px-3 py-2 text-xs text-rose-700">حذف الفقرة</Button>
                </div>
                <TextPair label="نص الفقرة" value={paragraph} onChange={(next) => updateAboutParagraph(index, next)} multiline />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => updateAbout({ storyParagraphs: [...about.storyParagraphs, { ...emptyText }] })} className="rounded-xl">+ إضافة فقرة</Button>
            <div className="grid gap-3 md:grid-cols-2">
              <TextPair label="شارة التأسيس" value={about.foundationLabel} onChange={(foundationLabel) => updateAbout({ foundationLabel })} />
              <TextPair label="وصف التأسيس" value={about.foundationDescription} onChange={(foundationDescription) => updateAbout({ foundationDescription })} />
            </div>
          </div>

          <div className="space-y-4">
            <SectionHeading title="القيم الأساسية" description="يمكنك تعديل أي قيمة أو حذفها أو إضافة قيم جديدة." />
            <TextPair label="عنوان القيم" value={about.valuesTitle} onChange={(valuesTitle) => updateAbout({ valuesTitle })} />
            <TextPair label="وصف القيم" value={about.valuesDescription} onChange={(valuesDescription) => updateAbout({ valuesDescription })} multiline />
            {about.values.map((item, index) => (
              <div key={`about-value-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800">القيمة {index + 1}</span>
                  <Button type="button" variant="outline" onClick={() => updateAbout({ values: about.values.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg px-3 py-2 text-xs text-rose-700">حذف القيمة</Button>
                </div>
                <div className="space-y-3">
                  <TextPair label="اسم القيمة" value={item.title} onChange={(title) => updateAboutValue(index, { title })} />
                  <TextPair label="وصف القيمة" value={item.description} onChange={(description) => updateAboutValue(index, { description })} multiline />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => updateAbout({ values: [...about.values, { title: { ...emptyText }, description: { ...emptyText } }] })} className="rounded-xl">+ إضافة قيمة</Button>
          </div>

          <div className="space-y-4">
            <SectionHeading title="دعوة التقديم في أسفل الصفحة" />
            <TextPair label="عنوان الدعوة" value={about.ctaTitle} onChange={(ctaTitle) => updateAbout({ ctaTitle })} />
            <TextPair label="وصف الدعوة" value={about.ctaDescription} onChange={(ctaDescription) => updateAbout({ ctaDescription })} multiline />
            <TextPair label="زر الوظائف" value={about.ctaPrimary} onChange={(ctaPrimary) => updateAbout({ ctaPrimary })} />
            <TextPair label="زر المزايا" value={about.ctaSecondary} onChange={(ctaSecondary) => updateAbout({ ctaSecondary })} />
          </div>

          <AppearanceEditor
            value={about.appearance}
            onChange={(appearance) => updateAbout({ appearance })}
            flags={[
              { key: 'showStory', label: 'إظهار قسم قصتنا' },
              { key: 'showStats', label: 'إظهار الإحصاءات' },
              { key: 'showValues', label: 'إظهار القيم الأساسية' },
              { key: 'showCta', label: 'إظهار دعوة التقديم' },
            ]}
          />
          <EditorActions onSave={onSave} onReset={onReset} saving={saving} saved={saved} />
        </div>
      </section>

      <section className="rounded-3xl border border-teal-100 bg-teal-50/50 p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-teal-700">تحكم بصري كامل</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">محرر تبويب «المزايا»</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">عدّل بطاقات المزايا والمزايا الإضافية ومسار النمو والدعوة النهائية، مع اختيار الأيقونة وتغيير الألوان.</p>
          </div>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-teal-700 shadow-sm">صفحة عامة: /benefits</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <SectionHeading title="واجهة الصفحة" />
            <TextPair label="الشارة" value={benefits.eyebrow} onChange={(eyebrow) => updateBenefits({ eyebrow })} />
            <TextPair label="العنوان الرئيسي" value={benefits.title} onChange={(title) => updateBenefits({ title })} />
            <TextPair label="الوصف" value={benefits.description} onChange={(description) => updateBenefits({ description })} multiline />
          </div>

          <div className="space-y-4">
            <SectionHeading title="المزايا الرئيسية" description="أضف أو احذف البطاقات واختر الأيقونة المناسبة لكل ميزة." />
            {benefits.items.map((item, index) => (
              <div key={`benefit-item-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800">الميزة {index + 1}</span>
                  <Button type="button" variant="outline" onClick={() => updateBenefits({ items: benefits.items.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg px-3 py-2 text-xs text-rose-700">حذف الميزة</Button>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">الأيقونة
                    <select value={item.icon} onChange={(event) => updateBenefitItem(index, { icon: event.target.value })} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100">
                      {['health', 'growth', 'bonus', 'balance', 'transport', 'environment'].map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                  </label>
                  <TextPair label="عنوان الميزة" value={item.title} onChange={(title) => updateBenefitItem(index, { title })} />
                  <TextPair label="وصف الميزة" value={item.description} onChange={(description) => updateBenefitItem(index, { description })} multiline />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => updateBenefits({ items: [...benefits.items, { icon: 'health', title: { ...emptyText }, description: { ...emptyText } }] })} className="rounded-xl">+ إضافة ميزة</Button>
          </div>

          <div className="space-y-4">
            <SectionHeading title="المزايا الإضافية" />
            <TextPair label="عنوان القسم" value={benefits.additionalTitle} onChange={(additionalTitle) => updateBenefits({ additionalTitle })} />
            <TextPair label="وصف القسم" value={benefits.additionalDescription} onChange={(additionalDescription) => updateBenefits({ additionalDescription })} multiline />
            {benefits.additionalItems.map((item, index) => (
              <div key={`additional-item-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-bold text-slate-800">الميزة الإضافية {index + 1}</span>
                  <Button type="button" variant="outline" onClick={() => updateBenefits({ additionalItems: benefits.additionalItems.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg px-3 py-2 text-xs text-rose-700">حذف</Button>
                </div>
                <div className="space-y-3">
                  <TextPair label="العنوان" value={item.title} onChange={(title) => updateAdditionalItem(index, { title })} />
                  <TextPair label="الوصف" value={item.description} onChange={(description) => updateAdditionalItem(index, { description })} multiline />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => updateBenefits({ additionalItems: [...benefits.additionalItems, { title: { ...emptyText }, description: { ...emptyText } }] })} className="rounded-xl">+ إضافة ميزة إضافية</Button>
          </div>

          <div className="space-y-4">
            <SectionHeading title="مسار النمو المهني" />
            <TextPair label="عنوان المسار" value={benefits.growthTitle} onChange={(growthTitle) => updateBenefits({ growthTitle })} />
            <TextPair label="وصف المسار" value={benefits.growthDescription} onChange={(growthDescription) => updateBenefits({ growthDescription })} multiline />
            {benefits.growthStages.map((stage, index) => (
              <div key={`growth-stage-${index}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <TextPair label={`المستوى ${index + 1}`} value={stage.level} onChange={(level) => updateGrowthStage(index, { level })} />
                <TextPair label="المدة" value={stage.time} onChange={(time) => updateGrowthStage(index, { time })} />
                <Button type="button" variant="outline" onClick={() => updateBenefits({ growthStages: benefits.growthStages.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-lg px-3 py-2 text-xs text-rose-700">حذف</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => updateBenefits({ growthStages: [...benefits.growthStages, { level: { ...emptyText }, time: { ...emptyText } }] })} className="rounded-xl">+ إضافة مرحلة</Button>
            <TextPair label="عنوان بطاقة النمو" value={benefits.growthHighlightTitle} onChange={(growthHighlightTitle) => updateBenefits({ growthHighlightTitle })} />
            <TextPair label="وصف بطاقة النمو" value={benefits.growthHighlightDescription} onChange={(growthHighlightDescription) => updateBenefits({ growthHighlightDescription })} multiline />
          </div>

          <div className="space-y-4">
            <SectionHeading title="الدعوة النهائية" />
            <TextPair label="العنوان" value={benefits.ctaTitle} onChange={(ctaTitle) => updateBenefits({ ctaTitle })} />
            <TextPair label="الوصف" value={benefits.ctaDescription} onChange={(ctaDescription) => updateBenefits({ ctaDescription })} multiline />
            <TextPair label="زر الوظائف" value={benefits.ctaPrimary} onChange={(ctaPrimary) => updateBenefits({ ctaPrimary })} />
            <TextPair label="زر التواصل" value={benefits.ctaSecondary} onChange={(ctaSecondary) => updateBenefits({ ctaSecondary })} />
          </div>

          <AppearanceEditor
            value={benefits.appearance}
            onChange={(appearance) => updateBenefits({ appearance })}
            flags={[
              { key: 'showAdditional', label: 'إظهار المزايا الإضافية' },
              { key: 'showGrowth', label: 'إظهار مسار النمو' },
              { key: 'showCta', label: 'إظهار الدعوة النهائية' },
            ]}
          />
          <EditorActions onSave={onSave} onReset={onReset} saving={saving} saved={saved} />
        </div>
      </section>
    </div>
  );
}
