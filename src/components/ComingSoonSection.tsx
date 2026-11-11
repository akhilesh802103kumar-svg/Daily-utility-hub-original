import React, { useState } from 'react';
import {
  Receipt,
  FileText,
  Video,
  Calendar,
  ArrowLeftRight,
  Crop,
  Volume2,
  GraduationCap,
  Utensils,
  Bell,
  Check,
  Clock,
  Sparkles,
  X,
  Shield,
  Zap
} from 'lucide-react';
import { comingSoonList } from '../i18n';
import { Language } from '../types';

interface ComingSoonSectionProps {
  language: Language;
}

const iconMap: Record<string, React.ElementType> = {
  Receipt,
  FileText,
  Video,
  Calendar,
  ArrowLeftRight,
  Crop,
  Volume2,
  GraduationCap,
  Utensils,
};

interface ToolModalData {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  icon: string;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ language }) => {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [subscribedId, setSubscribedId] = useState<string | null>(null);
  const [generalSuccess, setGeneralSuccess] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolModalData | null>(null);
  const [modalEmail, setModalEmail] = useState('');
  const [modalSubscribed, setModalSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.MouseEvent, toolId: string) => {
    e.stopPropagation();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      alert('Please enter a valid email address to receive early release alerts.');
      return;
    }
    setSubscribedId(toolId);
    setTimeout(() => setSubscribedId(null), 3500);
  };

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setGeneralSuccess(true);
    setTimeout(() => {
      setGeneralSuccess(false);
      setNotifyEmail('');
    }, 3500);
  };

  const handleModalSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEmail || !modalEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setModalSubscribed(true);
    setTimeout(() => {
      setModalSubscribed(false);
      setModalEmail('');
    }, 4000);
  };

  return (
    <section className="mt-20 pt-12 border-t border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF9D24] mb-1.5">
            <Clock className="w-4 h-4" />
            <span>Future Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554]">
            {language === 'hi' ? 'जल्द आ रहे नए टूल्स (9 टूल्स)' : 'Coming Soon to Daily Utility Hub'}
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            {language === 'hi'
              ? 'आने वाले 9 नए डिजिटल टूल्स — क्लिक करके विवरण देखें और प्री-रजिस्टर करें'
              : 'Explore the 9 upcoming tools in our pipeline — click any card for a preview'}
          </p>
        </div>

        {/* Global Alert Bar */}
        <form onSubmit={handleGeneralSubmit} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            placeholder="Enter email for early access..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#1456D9] outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1456D9] hover:bg-[#1456D9]/90 shrink-0 transition shadow-sm"
          >
            {generalSuccess ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            <span>{generalSuccess ? 'Subscribed' : 'Notify Me'}</span>
          </button>
        </form>
      </div>

      {/* Grid of Coming Soon Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {comingSoonList.map((tool) => {
          const Icon = iconMap[tool.icon] || Sparkles;
          const isNotified = subscribedId === tool.id;

          return (
            <div
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-[#1456D9]/10 group-hover:text-[#1456D9] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Coming Soon</span>
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {tool.category}
                </span>

                <h3 className="text-base font-bold text-[#172554] mt-0.5 group-hover:text-[#1456D9] transition-colors">
                  {language === 'hi' ? tool.titleHi : tool.title}
                </h3>

                <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {language === 'hi' ? tool.descriptionHi : tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md">
                  In Development
                </span>
                <button
                  type="button"
                  onClick={(e) => handleNotifySubmit(e, tool.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isNotified
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-50 text-[#1456D9] hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  {isNotified ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{isNotified ? 'Registered' : 'Notify'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Friendly Coming Soon Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden animate-scale-up">
            {/* Background ambient accent */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-gradient-to-br from-[#FF9D24]/20 via-[#6D35D5]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setSelectedTool(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                {React.createElement(iconMap[selectedTool.icon] || Sparkles, { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Coming Soon Tool
                </span>
                <h3 className="text-xl font-black text-[#172554] mt-0.5">
                  {language === 'hi' ? selectedTool.titleHi : selectedTool.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#64748B] leading-relaxed mb-5">
              {language === 'hi' ? selectedTool.descriptionHi : selectedTool.description}
            </p>

            {/* Feature Highlights */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172554]">
                <Zap className="w-4 h-4 text-[#FF9D24]" />
                <span>What we are building into this tool:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                <li>100% Client-side local processing — zero data uploaded or stored</li>
                <li>Mobile-first optimized design for Android, tablets, and desktops</li>
                <li>Instant high-resolution downloads with no watermarks</li>
                <li>Completely free to use upon release with no login required</li>
              </ul>
            </div>

            {/* Modal Notification Form */}
            <form onSubmit={handleModalSubscribe} className="space-y-3">
              <label className="block text-xs font-semibold text-[#172554]">
                Get notified the moment this tool launches:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-[#1456D9] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1456D9] hover:bg-[#1456D9]/90 shrink-0 transition shadow-sm flex items-center gap-1.5"
                >
                  {modalSubscribed ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{modalSubscribed ? 'Subscribed' : 'Notify Me'}</span>
                </button>
              </div>
              {modalSubscribed && (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>You are on the VIP early access list for {selectedTool.title}!</span>
                </p>
              )}
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                No spam, only release notification
              </span>
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
