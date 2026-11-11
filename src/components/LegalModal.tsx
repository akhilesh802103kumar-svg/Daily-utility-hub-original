import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-[#172554] flex items-center justify-center">
              {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554]">
                {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h2>
              <p className="text-xs text-[#64748B]">Last updated: November 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Text */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">1. Zero Server Upload Architecture</h3>
                <p>
                  Daily Utility Hub is built specifically to operate locally inside your browser client. When you compress an image, merge a PDF document, calculate loan figures, or generate a QR code, all data processing takes place using your device's memory and CPU. Your files, documents, and credentials are never sent to external servers or remote databases.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">2. No Account or Login Required</h3>
                <p>
                  We do not collect names, passwords, phone numbers, or credit cards. The application is completely open and does not implement user accounts or biometric profiling.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">3. Cookies & Local Storage</h3>
                <p>
                  We do not use tracking cookies or sell your browsing habits to third-party ad exchanges. Local storage is strictly used to store your UI preference (such as English vs. Hindi language toggle).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">4. Progressive Web App (PWA) Storage</h3>
                <p>
                  When you install Daily Utility Hub as a PWA, web application assets (CSS, JavaScript, and icons) are cached locally by your browser's CacheStorage API to enable fast offline access.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using Daily Utility Hub (referred to as "the Service"), you agree to these Terms and Conditions. If you do not agree with any part, please refrain from using the tools.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">2. Permitted Use</h3>
                <p>
                  All active utilities provided by Daily Utility Hub are provided free of charge for personal, educational, and commercial workflows. You may generate documents, compress marketing graphics, and produce invitations without royalty fees.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">3. Disclaimer of Financial & Legal Advice</h3>
                <p>
                  Calculators (such as the Loan EMI and GST calculators) are provided for estimation purposes only. Always consult a certified financial advisor or chartered accountant for official legal filing and bank disbursements.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172554] mb-1">4. Intellectual Property</h3>
                <p>
                  The original vector SVG logo, toolbox branding, and Daily Utility Hub name are the intellectual property of Daily Utility Hub. All files and outputs created by you remain your 100% exclusive property.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#1456D9] rounded-xl hover:bg-[#1456D9]/90 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
