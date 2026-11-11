import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#1456D9] to-[#6D35D5] hover:opacity-95 shadow-sm transition active:scale-[0.98] ${
          compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
        }`}
        title="Install Daily Utility Hub to your home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl font-semibold text-[#1456D9] bg-blue-50 border border-blue-200 hover:bg-blue-100 transition ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
          }`}
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-fade-in relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#1456D9]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172554]">Install on iOS</h3>
                  <p className="text-xs text-[#64748B]">Safari Home Screen App</p>
                </div>
              </div>
              <p className="text-sm text-[#172554] space-y-2 mt-3 leading-relaxed">
                1. Tap the <strong className="text-[#1456D9]">Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong className="text-[#1456D9]">Add to Home Screen</strong>.<br />
                3. Enjoy instant offline access and standalone mode!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-[#172554] hover:bg-slate-200 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback demo install / info button
  return (
    <button
      onClick={() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {});
        }
        alert('Daily Utility Hub is PWA ready! To install, use your browser menu (e.g. Chrome "Install App" or Safari "Add to Home Screen").');
      }}
      className={`hidden sm:flex items-center gap-1.5 rounded-xl font-semibold text-[#1456D9] bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200/60 transition ${
        compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs'
      }`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install App</span>
    </button>
  );
};
