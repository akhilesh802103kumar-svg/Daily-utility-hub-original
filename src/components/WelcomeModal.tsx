import React from 'react';
import { DailyUtilityHubIcon } from './Logo';
import { Sparkles, ShieldCheck, Zap, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
  onGetStarted: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onExplore,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          aria-label="Close welcome prompt"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon with Energy Glow */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-[#1456D9]/15 blur-xl" />
            <DailyUtilityHubIcon size={80} className="relative z-10" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554]">
            Welcome to Daily Utility Hub
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-base sm:text-lg font-semibold text-[#1456D9]">
            Your Everyday Digital Tools, All in One Place.
          </p>

          {/* Hindi Requirement */}
          <p className="mt-1 text-sm font-medium text-[#64748B]">
            आपके रोज़मर्रा के डिजिटल टूल्स, एक ही जगह।
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 w-full my-6">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80 text-center">
              <ShieldCheck className="w-5 h-5 text-[#1456D9] mb-1.5" />
              <span className="text-xs font-bold text-[#172554]">No Login</span>
              <span className="text-[10px] text-[#64748B]">Zero barrier</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-purple-50/60 border border-purple-100/80 text-center">
              <Zap className="w-5 h-5 text-[#6D35D5] mb-1.5" />
              <span className="text-xs font-bold text-[#172554]">Instant</span>
              <span className="text-[10px] text-[#64748B]">Browser fast</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-50/60 border border-amber-100/80 text-center">
              <Sparkles className="w-5 h-5 text-[#FF9D24] mb-1.5" />
              <span className="text-xs font-bold text-[#172554]">100% Free</span>
              <span className="text-[10px] text-[#64748B]">Always open</span>
            </div>
          </div>

          {/* Action Buttons: Explore Tools and Get Started */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => {
                onExplore();
                onClose();
              }}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm text-[#1456D9] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition active:scale-[0.98]"
            >
              Explore Tools
            </button>
            <button
              onClick={() => {
                onGetStarted();
                onClose();
              }}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#1456D9] to-[#6D35D5] hover:opacity-95 shadow-md shadow-blue-500/20 transition active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
