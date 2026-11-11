import React from 'react';
import { X, ShieldCheck, Zap, Lock, Globe, Heart } from 'lucide-react';
import { DailyUtilityHubIcon } from './Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/40">
          <div className="flex items-center gap-3">
            <DailyUtilityHubIcon size={40} />
            <div>
              <h2 className="text-xl font-bold text-[#172554]">About Daily Utility Hub</h2>
              <p className="text-xs text-[#64748B]">All in One Website • Digital Everyday Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#172554]">
          <div>
            <h3 className="text-base font-bold text-[#172554] mb-1.5">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Daily Utility Hub was founded on a simple principle: everyday digital tools should be instant, reliable, and completely free of friction. You shouldn't have to create an account, verify an email, or endure invasive paywalls just to convert an image, merge a PDF, calculate an EMI, or generate a QR code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <ShieldCheck className="w-5 h-5 text-[#1456D9] mb-2" />
              <h4 className="text-xs font-bold text-[#172554]">Zero Data Collection</h4>
              <p className="text-[11px] text-slate-500 mt-1">Your documents, images, and calculations never leave your browser memory.</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
              <Zap className="w-5 h-5 text-[#6D35D5] mb-2" />
              <h4 className="text-xs font-bold text-[#172554]">Ultra High Speed</h4>
              <p className="text-[11px] text-slate-500 mt-1">Engineered in modern TypeScript + React for sub-second client processing.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <Lock className="w-5 h-5 text-[#FF9D24] mb-2" />
              <h4 className="text-xs font-bold text-[#172554]">No Login Required</h4>
              <p className="text-[11px] text-slate-500 mt-1">Direct access without passwords, credentials, or personal identity checks.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-[#172554] mb-1">Architecture & Tech Stack</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built with React 19, TypeScript, and modern browser APIs including Web Canvas, Web Workers, and local crypto. Fully prepared for Progressive Web App (PWA) offline installation across Android, iOS, tablets, and desktop computers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1456D9] rounded-xl hover:bg-[#1456D9]/90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
