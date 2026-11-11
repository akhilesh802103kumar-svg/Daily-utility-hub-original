import React, { useState } from 'react';
import { DailyUtilityHubLogo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { Language } from '../types';
import { translations } from '../i18n';
import {
  Menu,
  X,
  Globe,
  Sparkles,
  Layers,
  Info,
  Mail,
  Home
} from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateHome: () => void;
  onNavigateTools: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenLogoKit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onNavigateHome,
  onNavigateTools,
  onOpenAbout,
  onOpenContact,
  onOpenLogoKit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const handleMobileNav = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark & Vector Toolbox Logo */}
        <div className="flex items-center gap-3">
          <DailyUtilityHubLogo
            size="md"
            variant="full"
            onClick={onNavigateHome}
          />
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#1456D9] transition-colors whitespace-nowrap"
          >
            {t.home}
          </button>
          <button
            onClick={onNavigateTools}
            className="hover:text-[#1456D9] transition-colors whitespace-nowrap"
          >
            {t.allTools}
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-[#1456D9] transition-colors whitespace-nowrap"
          >
            {t.aboutUs}
          </button>
          <button
            onClick={onOpenContact}
            className="hover:text-[#1456D9] transition-colors whitespace-nowrap"
          >
            {t.contact}
          </button>
          <button
            onClick={onOpenLogoKit}
            className="text-xs text-[#6D35D5] hover:text-[#1456D9] font-bold flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brand Kit</span>
          </button>
        </nav>

        {/* Zone 3: Actions - Language selector & PWA Install Button */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Language Toggle Dropdown / Button */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#172554] hover:bg-slate-50 transition"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-[#1456D9]" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Language toggle for mobile */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#1456D9] bg-slate-50"
          >
            {language === 'en' ? 'हिन्दी' : 'EN'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <button
            onClick={() => handleMobileNav(onNavigateHome)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left font-bold text-sm text-[#172554] hover:bg-blue-50"
          >
            <Home className="w-4 h-4 text-[#1456D9]" />
            <span>{t.home}</span>
          </button>
          <button
            onClick={() => handleMobileNav(onNavigateTools)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left font-bold text-sm text-[#172554] hover:bg-blue-50"
          >
            <Layers className="w-4 h-4 text-[#1456D9]" />
            <span>{t.allTools} (6 Active)</span>
          </button>
          <button
            onClick={() => handleMobileNav(onOpenAbout)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left font-bold text-sm text-[#172554] hover:bg-blue-50"
          >
            <Info className="w-4 h-4 text-[#1456D9]" />
            <span>{t.aboutUs}</span>
          </button>
          <button
            onClick={() => handleMobileNav(onOpenContact)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left font-bold text-sm text-[#172554] hover:bg-blue-50"
          >
            <Mail className="w-4 h-4 text-[#1456D9]" />
            <span>{t.contact}</span>
          </button>
          <button
            onClick={() => handleMobileNav(onOpenLogoKit)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left font-bold text-sm text-[#6D35D5] hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Official Brand Kit & Logos</span>
          </button>

          <div className="pt-3 border-t border-slate-100">
            <PWAInstallButton />
          </div>
        </div>
      )}
    </header>
  );
};
