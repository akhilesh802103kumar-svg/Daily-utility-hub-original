import React, { useState } from 'react';
import { DailyUtilityHubIcon, DailyUtilityHubLogo } from './Logo';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadSvgFile = (filename: string, path: string) => {
    const a = document.createElement('a');
    a.href = path;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copySvgText = (name: string) => {
    fetch('/icon.svg')
      .then((res) => res.text())
      .then((svgText) => {
        navigator.clipboard.writeText(svgText);
        setCopied(name);
        setTimeout(() => setCopied(null), 2500);
      })
      .catch(() => {
        // fallback
        setCopied(name);
        setTimeout(() => setCopied(null), 2000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1456D9]/10 text-[#1456D9]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554]">Daily Utility Hub Brand Kit</h2>
              <p className="text-xs text-[#64748B]">Official Vector SVG Logo, Icons, Favicon & PWA Assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close brand modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Full Brand Logo */}
          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#172554]">1. Full Vector Logo (Horizontal & Stacked)</h3>
                <p className="text-xs text-[#64748B]">Brand Name + Tagline + Toolbox Vector Symbol</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copySvgText('full-logo')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1456D9] bg-white border border-[#1456D9]/20 rounded-lg hover:bg-blue-50 transition"
                >
                  {copied === 'full-logo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'full-logo' ? 'Copied SVG' : 'Copy SVG'}
                </button>
                <button
                  onClick={() => downloadSvgFile('daily-utility-hub-logo.svg', '/icon.svg')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1456D9] rounded-lg hover:bg-[#1456D9]/90 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download SVG
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
              <DailyUtilityHubLogo size="lg" />
              <div className="h-10 w-px bg-slate-200 hidden sm:block" />
              <DailyUtilityHubLogo size="md" variant="stacked" />
            </div>
          </div>

          {/* 2. Grid for Icon-only, Favicon and PWA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Icon-Only Logo */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1456D9]">Logo Variant</span>
                <h4 className="text-sm font-bold text-[#172554] mt-1">Icon-Only Vector Logo</h4>
                <p className="text-xs text-[#64748B] mt-1">Toolbox + 4 symbols (PDF, Image, QR, Calc) + Lightning orbit</p>
              </div>
              <div className="my-5 flex items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <DailyUtilityHubIcon size={84} />
              </div>
              <button
                onClick={() => downloadSvgFile('daily-utility-hub-icon.svg', '/icon.svg')}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#1456D9] bg-white border border-[#1456D9]/30 rounded-lg hover:bg-blue-50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Icon SVG
              </button>
            </div>

            {/* Favicon */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D35D5]">Browser Asset</span>
                <h4 className="text-sm font-bold text-[#172554] mt-1">Favicon (SVG / ICO)</h4>
                <p className="text-xs text-[#64748B] mt-1">High-DPI scalable SVG tab icon with optical contrast</p>
              </div>
              <div className="my-5 flex items-center justify-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center gap-1">
                  <DailyUtilityHubIcon size={32} />
                  <span className="text-[10px] text-slate-400">32px Tab</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <DailyUtilityHubIcon size={48} />
                  <span className="text-[10px] text-slate-400">48px Bookmark</span>
                </div>
              </div>
              <button
                onClick={() => downloadSvgFile('favicon.svg', '/icon.svg')}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#6D35D5] bg-white border border-[#6D35D5]/30 rounded-lg hover:bg-purple-50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Favicon
              </button>
            </div>

            {/* PWA Icon */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF9D24]">App Installation</span>
                <h4 className="text-sm font-bold text-[#172554] mt-1">PWA & Mobile Icon</h4>
                <p className="text-xs text-[#64748B] mt-1">Maskable safe zone + standalone manifest ready</p>
              </div>
              <div className="my-5 flex items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="relative p-1.5 rounded-3xl bg-slate-100 border border-slate-200">
                  <DailyUtilityHubIcon size={76} />
                </div>
              </div>
              <button
                onClick={() => downloadSvgFile('pwa-icon-512x512.svg', '/icon.svg')}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#FF9D24] bg-white border border-[#FF9D24]/40 rounded-lg hover:bg-amber-50 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download PWA Icon
              </button>
            </div>
          </div>

          {/* Color Palette Specification */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Official Brand Color Palette</h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#1456D9] shadow-inner mb-2" />
                <span className="text-xs font-bold text-[#172554]">Blue</span>
                <p className="text-[11px] font-mono text-slate-500">#1456D9</p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#6D35D5] shadow-inner mb-2" />
                <span className="text-xs font-bold text-[#172554]">Purple</span>
                <p className="text-[11px] font-mono text-slate-500">#6D35D5</p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#FF9D24] shadow-inner mb-2" />
                <span className="text-xs font-bold text-[#172554]">Orange</span>
                <p className="text-[11px] font-mono text-slate-500">#FF9D24</p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#F5F7FC] border border-slate-200 mb-2" />
                <span className="text-xs font-bold text-[#172554]">Background</span>
                <p className="text-[11px] font-mono text-slate-500">#F5F7FC</p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#FFFFFF] border border-slate-200 mb-2" />
                <span className="text-xs font-bold text-[#172554]">White</span>
                <p className="text-[11px] font-mono text-slate-500">#FFFFFF</p>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                <div className="w-full h-8 rounded-lg bg-[#172554] shadow-inner mb-2" />
                <span className="text-xs font-bold text-[#172554]">Text Navy</span>
                <p className="text-[11px] font-mono text-slate-500">#172554</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#1456D9] rounded-xl hover:bg-[#1456D9]/90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
