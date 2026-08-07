/**
 * Footer Component
 * Main footer with navigation links and contact info
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'روابط سريعة',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'الوظائف', href: '/careers' },
      { label: 'المزايا', href: '/benefits' },
      { label: 'من نحن', href: '/about' },
      { label: 'اتصل بنا', href: '/contact' },
    ],
  },
  {
    title: 'الأقسام',
    links: [
      { label: 'الصيادلة', href: '/careers?category=pharmacist' },
      { label: 'مساعدي الصيادلة', href: '/careers?category=assistant_pharmacist' },
      { label: 'مديري المتاجر', href: '/careers?category=store_manager' },
      { label: 'خدمة العملاء', href: '/careers?category=customer_service' },
    ],
  },
];

const contactInfo = [
  {
    icon: MapPin,
    label: 'العنوان',
    value: 'جمهورية مصر العربية',
  },
  {
    icon: Phone,
    label: 'الهاتف',
    value: '+20 XXX XXX XXXX',
  },
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'careers@elhawary.com',
  },
  {
    icon: Clock,
    label: 'ساعات العمل',
    value: '9 صباحاً - 6 مساءً',
  },
];

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn('bg-neutral-900 text-white', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">صيدلية الهواري</h3>
                <p className="text-sm text-neutral-400">El Hawary Pharmacy</p>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              منصة التوظيف الرسمية لصيدلية الهواري. نبحث عن أفضل الكوادر 
              الطبية والخدمية للانضمام إلى فريقنا المتميز.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="h-10 w-10 rounded-lg bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'facebook' && (
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    )}
                    {social === 'twitter' && (
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    )}
                    {social === 'linkedin' && (
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 11-2 2 2 2 0 012-2z" />
                    )}
                    {social === 'instagram' && (
                      <path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 9a3 3 0 113-3 3 3 0 01-3 3zm5.5-5.5a1 1 0 11-1-1 1 1 0 011 1z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-neutral-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400">{item.label}</p>
                    <p className="text-sm text-white">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm text-center md:text-right">
              © {new Date().getFullYear()} صيدلية الهواري. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <Link
                to="#"
                className="text-neutral-400 hover:text-white text-sm transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                to="#"
                className="text-neutral-400 hover:text-white text-sm transition-colors"
              >
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
