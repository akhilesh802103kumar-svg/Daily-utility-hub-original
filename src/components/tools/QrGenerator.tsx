import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { validateFileSize, triggerSafeDownload } from '../../utils/security';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Globe,
  Wifi,
  FileText,
  Phone,
  Mail,
  Palette,
  Sparkles,
  MessageCircle,
  Image as ImageIcon,
  RotateCcw,
  Upload,
  Info,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { DailyUtilityHubIcon } from '../Logo';

export type QrPayloadType =
  | 'url'
  | 'text'
  | 'whatsapp'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'photo';

export const QrGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QrPayloadType>('url');

  // Input states per type
  const [urlInput, setUrlInput] = useState('https://dailyutilityhub.com');
  const [textInput, setTextInput] = useState('Welcome to Daily Utility Hub - All in One Website');

  // WhatsApp inputs
  const [waCountryCode, setWaCountryCode] = useState('+91');
  const [waPhone, setWaPhone] = useState('9876543210');
  const [waMessage, setWaMessage] = useState('Hello! I scanned your WhatsApp QR code from Daily Utility Hub.');

  // Wi-Fi inputs
  const [wifiSsid, setWifiSsid] = useState('MyHome_WiFi');
  const [wifiPass, setWifiPass] = useState('SecurePass2026');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);

  // Email inputs
  const [emailTo, setEmailTo] = useState('support@dailyutilityhub.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry via Utility Hub');
  const [emailBody, setEmailBody] = useState('Hello team, I would like to get more information.');

  // Phone inputs
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');

  // Photo inputs (Data URL / Photo link)
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');

  // Styling & Options
  const [fgColor, setFgColor] = useState('#1456D9');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [qrResolution, setQrResolution] = useState<number>(360);

  // Center Website Logo Settings (Requested by user: "QR photo ke andar website ka chhota logo hona chahiye jab ye genetare kr ke aaye to")
  const [embedWebsiteLogo, setEmbedWebsiteLogo] = useState<boolean>(true);
  const [logoSizePercent, setLogoSizePercent] = useState<number>(22); // 22% is optimal for H-level QR

  // Output states
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgString, setSvgString] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const photoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute final QR payload
  const getPayload = (): string => {
    switch (qrType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput.trim();
      case 'whatsapp': {
        const cleanNumber = `${waCountryCode}${waPhone}`.replace(/[^0-9]/g, '');
        const msgParam = waMessage.trim() ? `?text=${encodeURIComponent(waMessage.trim())}` : '';
        return `https://wa.me/${cleanNumber}${msgParam}`;
      }
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPass};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone': {
        const fullPhone = `${phoneCountryCode}${phoneNumber}`.replace(/\s+/g, '');
        return `tel:${fullPhone}`;
      }
      case 'photo':
        return photoDataUrl || 'https://dailyutilityhub.com/icon.svg';
      default:
        return urlInput;
    }
  };

  // Re-generate QR code whenever inputs, colors, or logo settings change
  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    setErrorMessage(null);

    // If embedding website logo in center, force error correction to 'H' (30% recovery)
    // so standard phone cameras can scan the QR code effortlessly
    const actualErrorLevel = embedWebsiteLogo ? 'H' : errorCorrection;

    // 1. Generate base QR code onto temporary canvas
    const canvas = document.createElement('canvas');
    canvas.width = qrResolution;
    canvas.height = qrResolution;

    QRCode.toCanvas(canvas, payload, {
      width: qrResolution,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: actualErrorLevel,
    })
      .then(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (embedWebsiteLogo) {
          // Load the website vector logo (/icon.svg) to draw into center
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          logoImg.onload = () => {
            const logoDimension = Math.round(qrResolution * (logoSizePercent / 100));
            const centerPos = Math.round((qrResolution - logoDimension) / 2);
            const badgePadding = Math.max(4, Math.round(logoDimension * 0.12));
            const badgeSize = logoDimension + badgePadding * 2;
            const badgePos = centerPos - badgePadding;

            // Draw clean rounded badge background for contrast
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 2;

            ctx.beginPath();
            ctx.roundRect(badgePos, badgePos, badgeSize, badgeSize, Math.round(badgeSize * 0.22));
            ctx.fill();

            // Hairline border around center logo badge
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw the website logo
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(logoImg, centerPos, centerPos, logoDimension, logoDimension);
            ctx.restore();

            const finalDataUrl = canvas.toDataURL('image/png');
            setPngDataUrl(finalDataUrl);

            // Also build vector SVG with embedded logo
            generateSvgWithLogo(payload, actualErrorLevel, logoDimension, centerPos, badgeSize, badgePos);
          };

          logoImg.onerror = () => {
            // Fallback if image fails to load
            const finalDataUrl = canvas.toDataURL('image/png');
            setPngDataUrl(finalDataUrl);
          };

          logoImg.src = '/icon.svg';
        } else {
          const finalDataUrl = canvas.toDataURL('image/png');
          setPngDataUrl(finalDataUrl);

          QRCode.toString(payload, {
            type: 'svg',
            width: qrResolution,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
            errorCorrectionLevel: actualErrorLevel,
          }).then((svg) => setSvgString(svg));
        }
      })
      .catch((err) => {
        setErrorMessage(`QR generation error: ${err.message}. If encoding a large photo, try smaller dimensions.`);
      });
  }, [
    qrType,
    urlInput,
    textInput,
    waCountryCode,
    waPhone,
    waMessage,
    wifiSsid,
    wifiPass,
    wifiSecurity,
    wifiHidden,
    emailTo,
    emailSubject,
    emailBody,
    phoneCountryCode,
    phoneNumber,
    photoDataUrl,
    fgColor,
    bgColor,
    errorCorrection,
    qrResolution,
    embedWebsiteLogo,
    logoSizePercent,
  ]);

  // Helper: Embed website logo into SVG string
  const generateSvgWithLogo = (
    payload: string,
    errorLevel: 'L' | 'M' | 'Q' | 'H',
    logoDimension: number,
    centerPos: number,
    badgeSize: number,
    badgePos: number
  ) => {
    QRCode.toString(payload, {
      type: 'svg',
      width: qrResolution,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorLevel,
    })
      .then((rawSvg) => {
        // Inject center logo badge and image tag before </svg>
        const centerOverlay = `
  <g id="website-center-logo">
    <rect x="${badgePos}" y="${badgePos}" width="${badgeSize}" height="${badgeSize}" rx="${Math.round(
          badgeSize * 0.22
        )}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
    <image href="/icon.svg" x="${centerPos}" y="${centerPos}" width="${logoDimension}" height="${logoDimension}" />
  </g>
</svg>`;
        const finalSvg = rawSvg.replace('</svg>', centerOverlay);
        setSvgString(finalSvg);
      })
      .catch(() => {});
  };

  // Handle Photo selection & resize for QR encoding
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFileSize(file, 10);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Photo file too large.');
        return;
      }
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Scale to compact dimensions (48x48 max) to ensure payload fits comfortably within standard QR capacity
          const maxDim = 48;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compactDataUrl = canvas.toDataURL('image/jpeg', 0.35);
          setPhotoDataUrl(compactDataUrl);
        };
        img.src = raw;
      };
      reader.readAsDataURL(file);
    }
  };

  // Download PNG
  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    triggerSafeDownload(pngDataUrl, `qrcode_${qrType}_hub_${Date.now()}.png`);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    triggerSafeDownload(blob, `qrcode_${qrType}_hub_${Date.now()}.svg`);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  // Copy Content / Image
  const handleCopy = async () => {
    if (!pngDataUrl) return;
    try {
      const res = await fetch(pngDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      navigator.clipboard.writeText(getPayload());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Reset to default
  const handleReset = () => {
    setUrlInput('https://dailyutilityhub.com');
    setTextInput('');
    setWaPhone('9876543210');
    setWaMessage('');
    setWifiSsid('');
    setWifiPass('');
    setEmailTo('');
    setPhoneNumber('');
    setPhotoDataUrl('');
    setPhotoName('');
    setFgColor('#1456D9');
    setBgColor('#FFFFFF');
    setEmbedWebsiteLogo(true);
    setLogoSizePercent(22);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-[#172554]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 via-white to-slate-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#172554]">QR Code Generator</h2>
              <p className="text-xs text-[#64748B]">
                Create custom QR codes with the official Daily Utility Hub website logo embedded in the center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Route: <span className="text-[#1456D9] font-mono">/tools/qr-generator</span>
            </span>
          </div>
        </div>

        {/* QR Payload Selector Tabs */}
        <div className="mt-6 flex p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none gap-1">
          {[
            { id: 'url', label: 'Website URL', icon: Globe },
            { id: 'text', label: 'Plain Text', icon: FileText },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
            { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'phone', label: 'Phone Call', icon: Phone },
            { id: 'photo', label: 'Photo QR', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = qrType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setQrType(tab.id as QrPayloadType)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Inputs & Styling */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Website URL Inputs */}
            {qrType === 'url' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#172554]">Website URL (Link)</label>
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-purple-500 outline-none"
                />
              </div>
            )}

            {/* 2. Text Inputs */}
            {qrType === 'text' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#172554]">Plain Text Message</label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type notes, addresses, or instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-500 outline-none"
                />
              </div>
            )}

            {/* 3. WhatsApp Inputs */}
            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Country Code</label>
                    <input
                      type="text"
                      value={waCountryCode}
                      onChange={(e) => setWaCountryCode(e.target.value)}
                      placeholder="+91"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Prefilled Message (Optional)</label>
                  <textarea
                    rows={2}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="e.g. Hi, I am interested in your services!"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    When scanned, WhatsApp opens directly to a chat with this number and message pre-typed.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Wi-Fi Inputs */}
            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Network SSID (Wi-Fi Name)</label>
                  <input
                    type="text"
                    required
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Office_Guest_WiFi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Password</label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      placeholder="Wi-Fi Password"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Security Encryption</label>
                    <select
                      value={wifiSecurity}
                      onChange={(e) => setWifiSecurity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <span>Hidden Network SSID</span>
                </label>
              </div>
            )}

            {/* 5. Email Inputs */}
            {qrType === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Recipient Email Address</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email Subject"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Body Text</label>
                    <input
                      type="text"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Message content"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Phone Inputs */}
            {qrType === 'phone' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Country Code</label>
                  <input
                    type="text"
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    placeholder="+91"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1">Telephone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono outline-none"
                  />
                </div>
              </div>
            )}

            {/* 7. Photo QR Inputs */}
            {qrType === 'photo' && (
              <div className="space-y-3">
                <div
                  onClick={() => photoFileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 p-5 rounded-2xl text-center cursor-pointer transition flex flex-col items-center gap-2"
                >
                  <input
                    ref={photoFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-bold text-[#172554]">
                    {photoName ? `Selected: ${photoName}` : 'Upload Photo to Embed in QR'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Image is automatically optimized to fit high-density QR data
                  </span>
                </div>

                {photoDataUrl && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img src={photoDataUrl} alt="Photo" className="w-12 h-12 rounded-lg object-cover border" />
                    <div className="text-xs">
                      <span className="font-bold text-[#172554] block">Photo Embedded</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Ready to scan</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EMBED WEBSITE LOGO IN CENTER FEATURE (User Prompt: "QR photo ke andar website ka chhota logo hona chahiye jab ye genetare kr ke aaye to") */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-white shadow-sm border border-blue-200">
                    <DailyUtilityHubIcon size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172554] block">
                      Embed Website Logo in Center
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      QR फोटो के अंदर वेबसाइट का लोगो (Toolbox + Lightning)
                    </span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={embedWebsiteLogo}
                    onChange={(e) => setEmbedWebsiteLogo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1456D9]" />
                </label>
              </div>

              {embedWebsiteLogo && (
                <div className="pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Logo Size Proportion:</span>
                  <div className="flex items-center gap-2">
                    {[18, 22, 26].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setLogoSizePercent(pct)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border transition ${
                          logoSizePercent === pct
                            ? 'bg-[#1456D9] text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pct === 22 ? 'Standard (22%)' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customization Styling Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-[#172554] block">Color & Resolution Styling</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Foreground QR Color */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    QR Pattern Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <div className="flex gap-1.5">
                      {['#1456D9', '#6D35D5', '#172554', '#10B981', '#000000'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFgColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-6 h-6 rounded-full border transition ${
                            fgColor === c ? 'ring-2 ring-purple-600 scale-110' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                    />
                    <div className="flex gap-1.5">
                      {['#FFFFFF', '#F5F7FC', '#FFFBEB', '#F0FDF4'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setBgColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-6 h-6 rounded-full border border-slate-300 transition ${
                            bgColor === c ? 'ring-2 ring-purple-600 scale-110' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error correction & Resolution */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Error Correction Level
                  </label>
                  <select
                    disabled={embedWebsiteLogo}
                    value={embedWebsiteLogo ? 'H' : errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="L">L (7% recovery)</option>
                    <option value="M">M (15% recovery)</option>
                    <option value="Q">Q (25% recovery)</option>
                    <option value="H">H (30% high recovery - Logo Safe)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Export Resolution
                  </label>
                  <select
                    value={qrResolution}
                    onChange={(e) => setQrResolution(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white outline-none"
                  >
                    <option value={280}>280 × 280 px (Standard)</option>
                    <option value={360}>360 × 360 px (High DPI)</option>
                    <option value={512}>512 × 512 px (Ultra HD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live QR Preview & Action Downloads */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="flex flex-col items-center w-full">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                Live High-DPI QR Preview
              </span>

              {/* QR Image Box */}
              <div
                style={{ backgroundColor: bgColor }}
                className="relative p-5 rounded-3xl border border-slate-200 shadow-md flex items-center justify-center transition-all group"
              >
                {pngDataUrl ? (
                  <img
                    src={pngDataUrl}
                    alt="Generated QR with Embedded Website Logo"
                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
                    Generating QR code with logo...
                  </div>
                )}
              </div>

              {/* Logo Active Indicator */}
              {embedWebsiteLogo && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Website Logo Embedded in Center</span>
                </div>
              )}

              {/* Payload String Box */}
              <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200 w-full text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Decoded Data
                </span>
                <p className="font-mono text-xs text-[#172554] truncate" title={getPayload()}>
                  {getPayload()}
                </p>
              </div>
            </div>

            {/* Actions: Download PNG, Download SVG, Copy */}
            <div className="w-full space-y-2.5 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSVG}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied to Clipboard!' : 'Copy QR Code Image / Content'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
