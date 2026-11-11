import React, { useState, useRef } from 'react';
import {
  Mail,
  Download,
  Check,
  Lock,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Share2,
  RefreshCw,
  FileDown,
  Eye,
  Sliders,
  CheckCircle2,
  X,
  Type,
  Palette,
  ArrowRight,
  Shield,
  Smartphone,
  Heart,
  Users
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { triggerSafeDownload } from '../../utils/security';
import {
  INVITATION_TEMPLATES,
  INVITATION_CATEGORIES,
  InvitationTemplate,
  InvitationCategory
} from '../../data/invitationTemplates';
import {
  IndianWeddingCardData,
  DEFAULT_ROYAL_TRADITIONAL_DATA,
  DEFAULT_PURPLE_FLORAL_DATA
} from './invitations/types';
import { RoyalTraditionalWedding } from './invitations/RoyalTraditionalWedding';
import { ElegantPurpleFloralWedding } from './invitations/ElegantPurpleFloralWedding';

export const InvitationMaker: React.FC = () => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<InvitationCategory | 'all'>('wedding');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');

  // Currently active template (default is Template 1: Royal Traditional Wedding)
  const defaultTemplate =
    INVITATION_TEMPLATES.find((t) => t.id === 'wed-royal-traditional') || INVITATION_TEMPLATES[0];
  const [activeTemplate, setActiveTemplate] = useState<InvitationTemplate>(defaultTemplate);

  // Dedicated Indian Wedding Card State (for Template 1 and Template 2)
  const [weddingData, setWeddingData] = useState<IndianWeddingCardData>(DEFAULT_ROYAL_TRADITIONAL_DATA);

  // General Template State (for birthday, baby shower, anniversary, etc.)
  const [eventTitle, setEventTitle] = useState('Wedding Ceremony');
  const [honoree, setHonoree] = useState('Aarav & Ananya');
  const [hostName, setHostName] = useState('The Sharma & Verma Families');
  const [eventDate, setEventDate] = useState('Sunday, 14 December 2026');
  const [eventTime, setEventTime] = useState('7:00 PM Onwards');
  const [venue, setVenue] = useState('The Grand Heritage Palace');
  const [address, setAddress] = useState('Grand Ballroom, Heritage Boulevard, MG Road, Bengaluru');
  const [invitationMessage, setInvitationMessage] = useState(
    'With the blessings of our family, we request the pleasure of your company on this auspicious occasion.'
  );
  const [rsvpInfo, setRsvpInfo] = useState('+91 98765 43210 (Kindly RSVP by Dec 1)');

  // Styling customizer for general cards
  const [fontChoice, setFontChoice] = useState<'serif' | 'sans' | 'script' | 'display'>('serif');
  const [customTextColor, setCustomTextColor] = useState<string>('#800020');
  const [customAccentColor, setCustomAccentColor] = useState<string>('#D97706');

  // Locked template preview modal state
  const [lockedModalTemplate, setLockedModalTemplate] = useState<InvitationTemplate | null>(null);

  // Mobile editor tab toggle: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  // Export states
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Ref to the live preview card container for html2canvas
  const cardPreviewRef = useRef<HTMLDivElement | null>(null);
  const editorTopRef = useRef<HTMLDivElement | null>(null);

  // Check if current active template is one of the specialized wedding templates
  const isRoyalTraditional = activeTemplate.id === 'wed-royal-traditional';
  const isPurpleFloral = activeTemplate.id === 'wed-purple-floral';
  const isSpecializedWedding = isRoyalTraditional || isPurpleFloral;

  // Handle template selection
  const handleSelectTemplate = (template: InvitationTemplate) => {
    if (!template.isFree) {
      // Locked template: show preview modal only!
      setLockedModalTemplate(template);
      return;
    }

    setActiveTemplate(template);

    if (template.id === 'wed-royal-traditional') {
      setWeddingData({ ...DEFAULT_ROYAL_TRADITIONAL_DATA });
    } else if (template.id === 'wed-purple-floral') {
      setWeddingData({ ...DEFAULT_PURPLE_FLORAL_DATA });
    } else {
      // General free template
      setEventTitle(template.defaultTitle);
      setHonoree(template.defaultHonoree);
      setHostName(template.defaultHost);
      setInvitationMessage(template.defaultMessage);
      setFontChoice(template.fontFamily);
      setCustomTextColor(template.primaryTextColor);
      setCustomAccentColor(template.accentTextColor);
    }

    if (editorTopRef.current) {
      editorTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset form to template defaults
  const handleResetToDefaults = () => {
    if (activeTemplate.id === 'wed-royal-traditional') {
      setWeddingData({ ...DEFAULT_ROYAL_TRADITIONAL_DATA });
    } else if (activeTemplate.id === 'wed-purple-floral') {
      setWeddingData({ ...DEFAULT_PURPLE_FLORAL_DATA });
    } else {
      setEventTitle(activeTemplate.defaultTitle);
      setHonoree(activeTemplate.defaultHonoree);
      setHostName(activeTemplate.defaultHost);
      setInvitationMessage(activeTemplate.defaultMessage);
      setFontChoice(activeTemplate.fontFamily);
      setCustomTextColor(activeTemplate.primaryTextColor);
      setCustomAccentColor(activeTemplate.accentTextColor);
      setEventDate('Sunday, 14 December 2026');
      setEventTime('7:00 PM Onwards');
      setVenue('The Grand Heritage Palace');
      setAddress('Grand Ballroom, Heritage Boulevard, MG Road, Bengaluru');
      setRsvpInfo('+91 98765 43210 (Kindly RSVP by Dec 1)');
    }
  };

  // Generate WhatsApp / SMS shareable message text
  const getShareableText = () => {
    if (isSpecializedWedding) {
      return `✨ *${weddingData.subTitle?.toUpperCase() || 'WEDDING CEREMONY'}* ✨\n\n` +
        `🤵 *Groom:* ${weddingData.groomName} (Son of ${weddingData.groomParents})\n` +
        `👰 *Bride:* ${weddingData.brideName} (Daughter of ${weddingData.brideParents})\n\n` +
        `"${weddingData.invitationMessage}"\n\n` +
        `📅 *Date:* ${weddingData.eventDate}\n` +
        `⏰ *Time:* ${weddingData.eventTime}\n` +
        `📍 *Venue:* ${weddingData.venueName}\n` +
        `🗺️ *Address:* ${weddingData.venueAddress}\n\n` +
        `💖 *With Love:* ${weddingData.familyName}\n\n` +
        `_Created with Daily Utility Hub (All in One Website)_`;
    }

    return `✨ *${eventTitle.toUpperCase()}* ✨\n\n${hostName ? `Hosted by: ${hostName}\n` : ''}${
      honoree ? `In honor of: *${honoree}*\n\n` : '\n'
    }"${invitationMessage}"\n\n📅 *Date:* ${eventDate}\n⏰ *Time:* ${eventTime}\n📍 *Venue:* ${venue}\n🗺️ *Address:* ${address}\n\n📞 *RSVP:* ${rsvpInfo}\n\n_Created on Daily Utility Hub (All in One Website)_`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getShareableText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
    }
  };

  // High-Resolution DOM Capture using html2canvas
  const captureCardCanvas = async (): Promise<HTMLCanvasElement> => {
    if (!cardPreviewRef.current) {
      throw new Error('Preview container not found');
    }

    // Scroll to top of preview card temporarily to ensure full render capture
    const canvas = await html2canvas(cardPreviewRef.current, {
      scale: 2.5, // 2.5x retina clarity for crisp print quality
      useCORS: true,
      logging: false,
      backgroundColor: null,
    });

    return canvas;
  };

  // Download as High-Resolution PNG
  const handleDownloadPng = async () => {
    setIsExportingPng(true);
    try {
      const canvas = await captureCardCanvas();
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const cleanTitle = isSpecializedWedding
        ? `${weddingData.groomName}_${weddingData.brideName}_Wedding`
        : eventTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);

      triggerSafeDownload(dataUrl, `DailyUtilityHub_${cleanTitle}_Invitation.png`);
      setExportNotice('High-resolution invitation PNG downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Unable to export PNG image. Please try again.');
    } finally {
      setIsExportingPng(false);
    }
  };

  // Download as Print-Ready PDF
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const canvas = await captureCardCanvas();
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Create A5 Portrait PDF (Standard luxury wedding card size: 148mm x 210mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const cleanTitle = isSpecializedWedding
        ? `${weddingData.groomName}_${weddingData.brideName}_Wedding`
        : eventTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);

      pdf.save(`DailyUtilityHub_${cleanTitle}_Invitation.pdf`);
      setExportNotice('Print-ready invitation PDF generated and downloaded!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Unable to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Filter templates
  const filteredTemplates = INVITATION_TEMPLATES.filter((tmpl) => {
    if (selectedCategory !== 'all' && tmpl.category !== selectedCategory) {
      return false;
    }
    if (filterType === 'free' && !tmpl.isFree) return false;
    if (filterType === 'premium' && tmpl.isFree) return false;
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#1456D9] via-[#6D35D5] to-[#FF9D24] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Digital Invitation Maker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Craft Elegant Invitations in Minutes
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed">
            Choose from over 50 unique designer cards across Weddings, Birthdays, Anniversaries,
            Baby Showers, Housewarmings, and Festivals. Featuring our 2 flagship Indian Wedding
            Masterpiece templates.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>10 Free Forever Templates</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Lock className="w-4 h-4 text-amber-300" />
              <span>42 Premium Templates (Preview Mode)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Smartphone className="w-4 h-4 text-cyan-300" />
              <span>Instant PNG & PDF Export</span>
            </div>
          </div>
        </div>

        {/* Decorative corner orb */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Success / Export Toast Notice */}
      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Live Editor & Preview Section */}
      <div ref={editorTopRef} className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9D24]">
              Active Workspace
            </span>
            <h2 className="text-2xl font-black text-[#172554] flex items-center gap-2">
              <span>Editing: {activeTemplate.name}</span>
              <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Free Template
              </span>
            </h2>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1456D9] bg-white border border-slate-200 hover:border-blue-300 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Mobile View Toggle Buttons */}
        <div className="lg:hidden flex items-center p-1 bg-slate-200 rounded-2xl mb-4">
          <button
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'edit'
                ? 'bg-white text-[#172554] shadow-sm'
                : 'text-slate-600 hover:text-[#172554]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. Edit Text & Details</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-white text-[#1456D9] shadow-sm'
                : 'text-slate-600 hover:text-[#172554]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Live Card & Download</span>
          </button>
        </div>

        {/* Editor Grid: Controls on left, Live Card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Editor Controls */}
          <div
            className={`lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5 ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#172554] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1456D9]" />
                <span>
                  {isSpecializedWedding ? 'Wedding Invitation Fields' : 'Customize Details'}
                </span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1456D9]">
                Live Preview
              </span>
            </div>

            {/* SPECIALIZED INDIAN WEDDING FORM (Template 1 & Template 2) */}
            {isSpecializedWedding ? (
              <div className="space-y-4">
                {/* 1. Groom's Details */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Groom's Information</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Groom's Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.groomName}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, groomName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-bold text-[#172554] bg-white"
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Groom's Parents' Names
                    </label>
                    <input
                      type="text"
                      value={weddingData.groomParents}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, groomParents: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none bg-white"
                      placeholder="e.g. Mr. Rajesh & Mrs. Sunita Sharma"
                    />
                  </div>
                </div>

                {/* 2. Bride's Details */}
                <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-900">
                    <Heart className="w-3.5 h-3.5 text-rose-600" />
                    <span>Bride's Information</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bride's Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.brideName}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, brideName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-bold text-[#172554] bg-white"
                      placeholder="e.g. Ananya Verma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bride's Parents' Names
                    </label>
                    <input
                      type="text"
                      value={weddingData.brideParents}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, brideParents: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none bg-white"
                      placeholder="e.g. Mr. Vikram & Mrs. Rekha Verma"
                    />
                  </div>
                </div>

                {/* 3. Wedding Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Wedding Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={weddingData.eventDate}
                        onChange={(e) =>
                          setWeddingData((prev) => ({ ...prev, eventDate: e.target.value }))
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none font-medium"
                        placeholder="e.g. Sunday, 14 Dec 2026"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Wedding Time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={weddingData.eventTime}
                        onChange={(e) =>
                          setWeddingData((prev) => ({ ...prev, eventTime: e.target.value }))
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none font-medium"
                        placeholder="e.g. 7:00 PM Onwards"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                {/* 4. Venue Name & Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Venue Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={weddingData.venueName}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, venueName: e.target.value }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                      placeholder="e.g. The Grand Heritage Palace"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={weddingData.venueAddress}
                    onChange={(e) =>
                      setWeddingData((prev) => ({ ...prev, venueAddress: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                    placeholder="e.g. Grand Ballroom, Heritage Boulevard, MG Road, Bengaluru"
                  />
                </div>

                {/* 5. Invitation Message & Family Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Invitation Message
                  </label>
                  <textarea
                    rows={2}
                    value={weddingData.invitationMessage}
                    onChange={(e) =>
                      setWeddingData((prev) => ({ ...prev, invitationMessage: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none resize-none"
                    placeholder="With the blessings of our family, we request the pleasure of your company..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Family Name
                    </label>
                    <input
                      type="text"
                      value={weddingData.familyName}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, familyName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-bold"
                      placeholder="e.g. Sharma & Verma Family"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={weddingData.badgeText || ''}
                      onChange={(e) =>
                        setWeddingData((prev) => ({ ...prev, badgeText: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-[#1456D9] outline-none font-medium"
                      placeholder={isRoyalTraditional ? 'Your Presence will make our day special!' : 'Please Join Us'}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD GENERAL TEMPLATE FORM */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Honoree / Couple
                  </label>
                  <input
                    type="text"
                    value={honoree}
                    onChange={(e) => setHonoree(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Hosted By
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Invitation Message
                  </label>
                  <textarea
                    rows={2}
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    RSVP
                  </label>
                  <input
                    type="text"
                    value={rsvpInfo}
                    onChange={(e) => setRsvpInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1456D9] outline-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* Mobile switch to preview button */}
            <div className="lg:hidden pt-3">
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className="w-full py-3 rounded-2xl bg-[#1456D9] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>View Live Preview Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Live Invitation Card Preview & Export Buttons */}
          <div
            className={`lg:col-span-6 space-y-5 ${
              mobileTab === 'edit' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* The Live Rendered Card Container */}
            <div className="w-full max-w-md mx-auto">
              {isRoyalTraditional ? (
                <RoyalTraditionalWedding ref={cardPreviewRef} data={weddingData} />
              ) : isPurpleFloral ? (
                <ElegantPurpleFloralWedding ref={cardPreviewRef} data={weddingData} />
              ) : (
                /* Fallback for other general free templates */
                <div
                  ref={cardPreviewRef}
                  style={{
                    backgroundColor: activeTemplate.cardBg,
                    borderColor: activeTemplate.borderColor,
                    color: customTextColor,
                    aspectRatio: '1 / 1.414'
                  }}
                  className="w-full rounded-3xl p-6 sm:p-8 border-4 shadow-2xl relative flex flex-col justify-between overflow-hidden font-serif"
                >
                  <div
                    style={{ borderColor: activeTemplate.borderColor }}
                    className="absolute inset-3 border rounded-2xl opacity-60 pointer-events-none"
                  />
                  <div className="text-center pt-2 relative z-10 space-y-1">
                    <p style={{ color: customAccentColor }} className="text-xs italic">
                      {hostName}
                    </p>
                    <h3 className="text-2xl font-black">{eventTitle}</h3>
                    <p style={{ color: customAccentColor }} className="text-xl font-bold">
                      {honoree}
                    </p>
                  </div>
                  <div className="text-center my-auto py-2 relative z-10 text-xs italic px-4">
                    "{invitationMessage}"
                  </div>
                  <div className="relative z-10 space-y-2 text-center text-xs">
                    <div
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        borderColor: activeTemplate.borderColor
                      }}
                      className="rounded-2xl p-3 border"
                    >
                      <p style={{ color: customAccentColor }} className="font-bold">
                        {eventDate} &bull; {eventTime}
                      </p>
                      <p className="font-semibold">{venue}</p>
                      <p className="text-[11px] opacity-80">{address}</p>
                      <p className="text-[10px] font-bold mt-1">RSVP: {rsvpInfo}</p>
                    </div>
                    <div className="text-[10px] opacity-60">Daily Utility Hub &bull; All in One Website</div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS: Download PNG, Download PDF, Copy WhatsApp */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3 max-w-md mx-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Export & Share Invitation</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Client-side private
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* PNG Download */}
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExportingPng}
                  className="w-full py-3 px-4 rounded-2xl bg-[#1456D9] hover:bg-[#1456D9]/90 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingPng ? 'Rendering PNG...' : 'Download PNG'}</span>
                </button>

                {/* PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="w-full py-3 px-4 rounded-2xl bg-[#6D35D5] hover:bg-[#6D35D5]/90 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isExportingPdf ? 'Building PDF...' : 'Download PDF'}</span>
                </button>
              </div>

              {/* WhatsApp Invitation Text Copy */}
              <button
                type="button"
                onClick={handleCopyText}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedText ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>{copiedText ? 'Copied Invitation Text!' : 'Copy WhatsApp / Message Text'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TEMPLATE GALLERY: Show All 52+ Templates with the Two Featured Wedding Masterpieces */}
      <div className="pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1456D9]">
              <Sparkles className="w-4 h-4" />
              <span>Explore 52+ Unique Templates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172554] tracking-tight mt-0.5">
              Choose an Invitation Template
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Select either of our two featured Indian Wedding templates to customize, or browse our
              celebration categories.
            </p>
          </div>

          {/* Filter Pills: All / Free / Premium */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all'
                  ? 'bg-white text-[#172554] shadow-sm'
                  : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              All (52)
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                filterType === 'free'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Free (10)</span>
            </button>
            <button
              onClick={() => setFilterType('premium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                filterType === 'premium'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Premium (42)</span>
            </button>
          </div>
        </div>

        {/* Category Tabs: All 8 Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#1456D9] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Categories (52)
          </button>
          {INVITATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#1456D9] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTemplates.map((template) => {
            const isSelected = activeTemplate.id === template.id;

            return (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`group relative rounded-3xl p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  template.isFree
                    ? isSelected
                      ? 'border-[#1456D9] ring-2 ring-[#1456D9]/25 bg-white shadow-lg'
                      : 'border-slate-200 bg-white hover:border-blue-300 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-amber-300 shadow-sm'
                }`}
              >
                {/* Visual Card Mockup Preview */}
                <div
                  style={{
                    backgroundColor: template.cardBg,
                    borderColor: template.borderColor,
                    color: template.primaryTextColor
                  }}
                  className="w-full aspect-[1/1.3] rounded-2xl p-3 border-2 relative overflow-hidden flex flex-col justify-between shadow-inner"
                >
                  {/* Subtle inner border */}
                  <div
                    style={{ borderColor: template.borderColor }}
                    className="absolute inset-1.5 border rounded-xl opacity-50 pointer-events-none"
                  />

                  {/* Corner accents */}
                  <div
                    style={{ color: template.borderColor }}
                    className="text-[9px] font-serif absolute top-2 left-2 opacity-70"
                  >
                    ❖
                  </div>
                  <div
                    style={{ color: template.borderColor }}
                    className="text-[9px] font-serif absolute top-2 right-2 opacity-70"
                  >
                    ❖
                  </div>

                  {/* Badges on card top */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-xs">
                      {template.categoryLabel}
                    </span>

                    {template.isFree ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Free</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>

                  {/* Center Mockup Info */}
                  <div className="relative z-10 text-center my-auto px-1 space-y-1">
                    <div
                      style={{ color: template.accentTextColor }}
                      className="text-[10px] italic font-serif line-clamp-1"
                    >
                      {template.defaultHost}
                    </div>
                    <div className="text-xs font-black tracking-tight line-clamp-1">
                      {template.defaultTitle}
                    </div>
                    <div
                      style={{ color: template.accentTextColor }}
                      className="text-sm font-extrabold line-clamp-1 drop-shadow-xs"
                    >
                      {template.defaultHonoree}
                    </div>
                  </div>

                  {/* Bottom details line */}
                  <div className="relative z-10 text-center text-[8px] opacity-75 border-t border-white/20 pt-1">
                    {template.tag}
                  </div>

                  {/* Locked Overlay for Premium Templates */}
                  {!template.isFree && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center p-3 text-center transition group-hover:bg-slate-950/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg mb-1.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-black text-white tracking-wide uppercase">
                        Premium
                      </span>
                      <span className="text-[9px] text-amber-200 mt-0.5 font-medium">
                        Preview Only
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Meta below Mockup */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-[#172554] line-clamp-1 group-hover:text-[#1456D9] transition">
                      {template.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{template.tag}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    {template.isFree ? (
                      <span className="text-xs font-bold text-[#1456D9] flex items-center gap-1 group-hover:underline">
                        <span>{isSelected ? 'Currently Editing' : 'Open in Editor'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>View Premium</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LOCKED TEMPLATE MODAL: "Premium Template – Subscription Coming Soon" */}
      {lockedModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden animate-scale-up">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-gradient-to-br from-amber-400/25 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setLockedModalTemplate(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  Premium Template
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#172554] mt-0.5">
                  {lockedModalTemplate.name}
                </h3>
              </div>
            </div>

            {/* Crucial Message per user specification */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 mb-5">
              <div className="flex items-center gap-2 font-black text-sm text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Premium Template – Subscription Coming Soon</span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                This is a designer locked template. Downloading locked templates for free is disabled.
                A premium subscription model is launching soon with unlimited ultra-HD exports, custom
                calligraphy fonts, and royalty-free music attachments.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLockedModalTemplate(null);
                  handleSelectTemplate(defaultTemplate);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#1456D9] text-white font-bold text-xs sm:text-sm hover:bg-[#1456D9]/90 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Edit Free Wedding Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLockedModalTemplate(null)}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
