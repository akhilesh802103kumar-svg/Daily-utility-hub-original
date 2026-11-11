import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroIllustration } from './components/HeroIllustration';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeModal } from './components/WelcomeModal';
import { LogoModal } from './components/LogoModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { LegalModal } from './components/LegalModal';
import { MobileBottomBar } from './components/MobileBottomBar';
import { Footer } from './components/Footer';
import { ComingSoonSection } from './components/ComingSoonSection';

// The 6 Active Tools - Code Split & Lazy Loaded for 2GB/3GB RAM Android Performance
const PdfTools = React.lazy(() =>
  import('./components/tools/PdfTools').then((m) => ({ default: m.PdfTools }))
);
const ImageCompressor = React.lazy(() =>
  import('./components/tools/ImageCompressor').then((m) => ({ default: m.ImageCompressor }))
);
const KeywordGenerator = React.lazy(() =>
  import('./components/tools/KeywordGenerator').then((m) => ({ default: m.KeywordGenerator }))
);
const FinancialCalculator = React.lazy(() =>
  import('./components/tools/FinancialCalculator').then((m) => ({ default: m.FinancialCalculator }))
);
const InvitationMaker = React.lazy(() =>
  import('./components/tools/InvitationMaker').then((m) => ({ default: m.InvitationMaker }))
);
const QrGenerator = React.lazy(() =>
  import('./components/tools/QrGenerator').then((m) => ({ default: m.QrGenerator }))
);

import { ActiveToolId, Language } from './types';
import { toolCatalog, translations } from './i18n';
import {
  Search,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Calculator,
  Mail,
  QrCode,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';

const toolIconMap: Record<string, React.ElementType> = {
  FileText,
  Image: ImageIcon,
  Search,
  Calculator,
  Mail,
  QrCode,
};

const ToolLoadingSkeleton: React.FC = () => (
  <div className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[380px] animate-pulse">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1456D9]/15 to-[#6D35D5]/15 flex items-center justify-center text-[#1456D9]">
      <Sparkles className="w-7 h-7 animate-spin text-[#1456D9]" />
    </div>
    <div className="space-y-1.5 max-w-sm">
      <h3 className="text-lg font-extrabold text-[#172554]">Loading Tool Workspace</h3>
      <p className="text-xs text-[#64748B]">
        Preparing high-performance client-side processing module. No files or private data leave your device.
      </p>
    </div>
    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 pt-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      <span>Secure Local Sandbox</span>
    </div>
  </div>
);

export default function App() {
  // Splash and Welcome state
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Localization State
  const [language, setLanguage] = useState<Language>('en');

  // Navigation & Active View State
  const [activeView, setActiveView] = useState<'home' | 'tools'>('home');
  const [activeTool, setActiveTool] = useState<ActiveToolId | null>(null);

  // Search Query for Tools
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Refs
  const toolsSectionRef = useRef<HTMLDivElement | null>(null);

  // Handle browser route sync (/tools/pdf, /tools/image-compressor, /tools/keyword-generator, etc.)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/tools/pdf') {
        setActiveTool('pdf-tools');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools/image-compressor') {
        setActiveTool('image-compressor');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools/keyword-generator') {
        setActiveTool('keyword-generator');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools/financial-calculator') {
        setActiveTool('financial-calculator');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools/qr-generator') {
        setActiveTool('qr-generator');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools/invitation-maker') {
        setActiveTool('invitation-maker');
        setActiveView('tools');
        setShowSplash(false);
      } else if (path === '/tools') {
        setActiveView('tools');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Handle splash finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Show Welcome Screen on first launch
    setShowWelcome(true);
  };

  const handleExploreTools = () => {
    setActiveView('tools');
    if (toolsSectionRef.current) {
      toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTool = (id: ActiveToolId) => {
    setActiveTool(id);
    setActiveView('tools');

    // Update browser URL route
    const routeMap: Record<ActiveToolId, string> = {
      'pdf-tools': '/tools/pdf',
      'image-compressor': '/tools/image-compressor',
      'keyword-generator': '/tools/keyword-generator',
      'financial-calculator': '/tools/financial-calculator',
      'qr-generator': '/tools/qr-generator',
      'invitation-maker': '/tools/invitation-maker',
    };

    window.history.pushState(null, '', routeMap[id] || '/tools');

    if (toolsSectionRef.current) {
      toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    setActiveView('home');
    setActiveTool(null);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools based on search query
  const filteredTools = toolCatalog.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.titleHi.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  });

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#172554] font-sans selection:bg-[#1456D9]/15 selection:text-[#1456D9]">
      {/* 1. Splash Screen */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {/* 2. Welcome Screen Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onExplore={handleExploreTools}
        onGetStarted={() => {
          setActiveView('tools');
          if (toolCatalog[0]) setActiveTool(toolCatalog[0].id);
          if (toolsSectionRef.current) {
            toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Brand Logo & Asset Showcase Modal */}
      <LogoModal isOpen={showLogoModal} onClose={() => setShowLogoModal(false)} />

      {/* About Us Modal */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />

      {/* Contact Us Modal */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

      {/* Legal Privacy & Terms Modal */}
      <LegalModal
        isOpen={legalModal !== null}
        type={legalModal || 'privacy'}
        onClose={() => setLegalModal(null)}
      />

      {/* Navigation Bar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onNavigateHome={handleNavigateHome}
        onNavigateTools={() => {
          setActiveView('tools');
          window.history.pushState(null, '', '/tools');
          if (toolsSectionRef.current) {
            toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenLogoKit={() => setShowLogoModal(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-[#F5F7FC] to-[#F5F7FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading, Tagline, Search, CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Trust Badges */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-bold text-[#1456D9]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF9D24]" />
                  <span>{t.freeAndPrivate}</span>
                  <span className="text-slate-300">·</span>
                  <span>{t.noLoginRequired}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172554] leading-[1.15]">
                  Daily Utility{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1456D9] via-[#2563EB] to-[#6D35D5]">
                    Hub
                  </span>
                </h1>

                {/* All in One Website Tagline */}
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-bold text-[#FF9D24] uppercase tracking-wider">
                    {t.tagline}
                  </p>
                  <p className="text-base sm:text-lg font-medium text-[#64748B]">
                    {t.welcomeSubtitle}
                  </p>
                  <p className="text-sm font-medium text-[#6D35D5]">
                    {t.welcomeHi}
                  </p>
                </div>

                {/* Search Tools Field */}
                <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                  <div className="relative flex items-center shadow-lg shadow-blue-900/5 rounded-2xl bg-white border border-slate-200/90 focus-within:border-[#1456D9] focus-within:ring-2 focus-within:ring-[#1456D9]/20 transition">
                    <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim().length > 0 && toolsSectionRef.current) {
                          toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      placeholder={t.searchPlaceholder}
                      className="w-full py-3.5 pl-3 pr-4 rounded-2xl text-xs sm:text-sm outline-none text-[#172554] font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    onClick={handleExploreTools}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#1456D9] to-[#6D35D5] hover:opacity-95 shadow-lg shadow-blue-600/20 transition active:scale-[0.98]"
                  >
                    <span>{t.exploreTools}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowLogoModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-[#1456D9] bg-white hover:bg-blue-50/80 border border-slate-200 transition"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF9D24]" />
                    <span>{t.viewLogoKit}</span>
                  </button>
                </div>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-extrabold text-[#172554]">6 Active</span>
                    <p className="text-[11px] text-slate-500">Core everyday tools</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-extrabold text-[#10B981]">100% Free</span>
                    <p className="text-[11px] text-slate-500">No hidden fees</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-extrabold text-[#6D35D5]">Private</span>
                    <p className="text-[11px] text-slate-500">Device-only RAM</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Original SVG Illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroIllustration className="w-full max-w-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE TOOLS WORKSPACE & CATALOG */}
        <section ref={toolsSectionRef} className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1456D9] mb-1">
                <Zap className="w-4 h-4 text-[#FF9D24]" />
                <span>Instant Digital Arsenal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554]">
                {language === 'hi' ? '६ एक्टिव डिजिटल टूल्स' : 'Six Active Everyday Tools'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                {language === 'hi'
                  ? 'सभी टूल्स आपके डिवाइस में सीधे चलते हैं — तुरंत उपयोग करें'
                  : 'Fast, secure and private utilities running locally in your browser'}
              </p>
            </div>

            {/* Quick Filter Reset / Active Counter */}
            <div className="flex items-center gap-2">
              {activeTool && (
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  &larr; View All 6 Cards
                </button>
              )}
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-[#1456D9] border border-blue-100">
                {filteredTools.length} Available
              </span>
            </div>
          </div>

          {/* ACTIVE TOOL VIEW (IF ONE SELECTED) */}
          {activeTool && (
            <div className="mb-14 space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <button
                    onClick={handleNavigateHome}
                    className="hover:text-[#1456D9] transition"
                  >
                    Home
                  </button>
                  <span>/</span>
                  <button
                    onClick={() => {
                      setActiveTool(null);
                      window.history.pushState(null, '', '/tools');
                    }}
                    className="hover:text-[#1456D9] transition"
                  >
                    Tools
                  </button>
                  <span>/</span>
                  <span className="font-bold text-[#172554]">
                    {toolCatalog.find((t) => t.id === activeTool)?.title || activeTool}
                  </span>
                  {activeTool && (
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[#1456D9]">
                      {activeTool === 'pdf-tools'
                        ? '/tools/pdf'
                        : activeTool === 'image-compressor'
                        ? '/tools/image-compressor'
                        : activeTool === 'keyword-generator'
                        ? '/tools/keyword-generator'
                        : activeTool === 'financial-calculator'
                        ? '/tools/financial-calculator'
                        : activeTool === 'qr-generator'
                        ? '/tools/qr-generator'
                        : activeTool === 'invitation-maker'
                        ? '/tools/invitation-maker'
                        : '/tools'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setActiveTool(null);
                    window.history.pushState(null, '', '/tools');
                  }}
                  className="text-xs font-bold text-[#1456D9] hover:underline flex items-center gap-1 self-end sm:self-auto"
                >
                  <span>Close Workspace</span>
                  <span>&times;</span>
                </button>
              </div>

              <React.Suspense fallback={<ToolLoadingSkeleton />}>
                {activeTool === 'pdf-tools' && <PdfTools />}
                {activeTool === 'image-compressor' && <ImageCompressor />}
                {activeTool === 'keyword-generator' && <KeywordGenerator />}
                {activeTool === 'financial-calculator' && <FinancialCalculator />}
                {activeTool === 'invitation-maker' && <InvitationMaker />}
                {activeTool === 'qr-generator' && <QrGenerator />}
              </React.Suspense>
            </div>
          )}

          {/* THE 6 ACTIVE TOOLS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const Icon = toolIconMap[tool.iconName] || FileText;
              const isSelected = activeTool === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.id)}
                  className={`group relative p-6 rounded-3xl bg-white border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                    isSelected
                      ? 'border-[#1456D9] ring-2 ring-[#1456D9]/20 shadow-lg'
                      : 'border-slate-200/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Card Top Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        style={{ backgroundColor: tool.accentBg, color: tool.color }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Tool #{index + 1}
                      </span>
                    </div>

                    {/* Category Label */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {tool.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#172554] mt-0.5 group-hover:text-[#1456D9] transition-colors">
                      {language === 'hi' ? tool.titleHi : tool.title}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs font-semibold text-[#1456D9] mt-1">
                      {language === 'hi' ? tool.taglineHi : tool.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                      {language === 'hi' ? tool.descriptionHi : tool.description}
                    </p>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1456D9] group-hover:text-[#6D35D5] transition-colors">
                    <span>{isSelected ? 'Currently Open' : t.openTool}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 my-6">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-[#172554]">No matching active tools</h4>
              <p className="text-xs text-slate-500 mt-1">Try searching for "PDF", "Image", "EMI", or "QR"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1456D9]"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* COMING SOON SECTION */}
          <ComingSoonSection language={language} />
        </section>
      </main>

      {/* FOOTER */}
      <Footer
        language={language}
        onSelectTool={handleSelectTool}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenPrivacy={() => setLegalModal('privacy')}
        onOpenTerms={() => setLegalModal('terms')}
        onOpenLogoKit={() => setShowLogoModal(true)}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomBar
        activeView={activeView}
        onNavigateHome={() => {
          setActiveView('home');
          setActiveTool(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTools={() => {
          setActiveView('tools');
          if (toolsSectionRef.current) {
            toolsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenLogoKit={() => setShowLogoModal(true)}
      />
    </div>
  );
}
