import React, { useState } from 'react';
import { X, Mail, Send, Check, MessageSquare, Phone } from 'lucide-react';
import { DailyUtilityHubIcon } from './Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Feature Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1456D9]/10 text-[#1456D9] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#172554]">Contact Daily Utility Hub</h2>
              <p className="text-xs text-[#64748B]">We welcome your feedback and tool requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#172554]">Message Received!</h3>
              <p className="text-xs text-[#64748B] max-w-xs">
                Thank you for contacting the Daily Utility Hub engineering team. We typically respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#172554] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1456D9] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#172554] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1456D9] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#172554] mb-1">Inquiry Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1456D9] outline-none bg-white"
                >
                  <option value="Feature Request">Request a New Active Tool</option>
                  <option value="Bug Report">Report an Issue / Bug</option>
                  <option value="Feedback">General Feedback & Appreciation</option>
                  <option value="Partnership">Partnership & Integration</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#172554] mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we make Daily Utility Hub better for your workflow?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#1456D9] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-[#1456D9] hover:bg-[#1456D9]/90 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Official Support: contact@dailyutilityhub.com</span>
            <span>Worldwide 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
