import React from 'react';
import { DailyUtilityHubLogo } from './Logo';
import { ShieldCheck, Heart, Sparkles, Smartphone } from 'lucide-react';
import { ActiveToolId, Language } from '../types';
import { toolCatalog, translations } from '../i18n';

interface FooterProps {
  language: Language;
  onSelectTool: (id: ActiveToolId) => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenLogoKit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectTool,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
  onOpenLogoKit,
}) => {
  const t = translations[language];

  return (
    <footer className="mt-28 border-t border-slate-200/90 bg-white pb-20 md:pb-12 pt-16 text-[#172554]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <DailyUtilityHubLogo size="md" />
            <p className="text-xs sm:text-sm text-[#64748B] max-w-sm leading-relaxed">
              {t.footerAboutDesc}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Client-Side • No Data Uploads</span>
            </div>
          </div>

          {/* 6 Active Tools Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Suite</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              {toolCatalog.map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => onSelectTool(tool.id)}
                    className="hover:text-[#1456D9] transition text-left"
                  >
                    {language === 'hi' ? tool.titleHi : tool.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Legal & Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button onClick={onOpenAbout} className="hover:text-[#1456D9] transition">
                  {t.aboutUs}
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-[#1456D9] transition">
                  {t.contactUs}
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-[#1456D9] transition">
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-[#1456D9] transition">
                  {t.termsConditions}
                </button>
              </li>
            </ul>
          </div>

          {/* Brand & PWA Assets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resources</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <button
                  onClick={onOpenLogoKit}
                  className="hover:text-[#6D35D5] flex items-center gap-1.5 transition text-[#6D35D5]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Download SVG Logo Kit</span>
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block">
                  Progressive Web App Ready
                </span>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block">
                  Designed for Desktop & Mobile Touch
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>{t.copyright}</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted for high performance & everyday digital independence.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
