import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { useSiteContent } from '@/hooks/useSiteContent';
import { getSiteText, type SiteContent } from '@/services/siteContentService';

type LegalDocument = SiteContent['legal']['privacy'];

type LegalPageProps = {
  document: LegalDocument;
  icon: typeof ShieldCheck;
};

function LegalDocumentPage({ document, icon: Icon }: LegalPageProps) {
  const text = getSiteText;

  return (
    <div className="bg-background-alternate min-h-screen py-12" dir="rtl">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-text-secondary hover:text-text-primary mb-8 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الرئيسية
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-primary-100 text-primary-700 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon className="h-6 w-6" />
          </div>
          <p className="text-primary-700 mb-2 font-semibold">{text(document.eyebrow)}</p>
          <h1 className="text-text-primary mb-3 text-3xl font-bold sm:text-4xl">
            {text(document.title)}
          </h1>
          <p className="text-text-secondary max-w-3xl text-lg leading-8">
            {text(document.description)}
          </p>
          <p className="text-text-muted mt-4 text-sm">
            {text(document.updatedLabel)}: {document.updatedAt}
          </p>
        </motion.header>

        <div className="space-y-5">
          {document.sections.map((section, index) => (
            <motion.div
              key={`${text(section.title)}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card>
                <article className="p-6 sm:p-8">
                  <h2 className="text-text-primary mb-3 text-xl font-bold">
                    {text(section.title)}
                  </h2>
                  <p className="text-text-secondary whitespace-pre-line leading-8">
                    {text(section.body)}
                  </p>
                </article>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  const { content, isLoading } = useSiteContent();
  if (isLoading) return <LegalLoading />;
  return <LegalDocumentPage document={content.legal.privacy} icon={ShieldCheck} />;
}

export function TermsPage() {
  const { content, isLoading } = useSiteContent();
  if (isLoading) return <LegalLoading />;
  return <LegalDocumentPage document={content.legal.terms} icon={Scale} />;
}

function LegalLoading() {
  return (
    <div className="bg-background-alternate flex min-h-[60vh] items-center justify-center" dir="rtl">
      <p className="text-text-secondary">جاري تحميل الصفحة...</p>
    </div>
  );
}
