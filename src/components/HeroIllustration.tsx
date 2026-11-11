import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background blur elements */}
      <div className="absolute -top-6 -left-6 w-56 h-56 bg-[#1456D9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-[#6D35D5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF9D24]/10 rounded-full blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 640 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[560px] drop-shadow-xl select-none"
        aria-label="Daily Utility Hub Digital Workstation Ecosystem"
      >
        <defs>
          <linearGradient id="heroBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1456D9" />
            <stop offset="100%" stopColor="#6D35D5" />
          </linearGradient>

          <linearGradient id="heroOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#FF9D24" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="heroCardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.9" />
          </linearGradient>

          <filter id="heroCardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#1E293B" floodOpacity="0.12" />
          </filter>

          <filter id="heroGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Path with Dash Array */}
        <ellipse
          cx="320"
          cy="240"
          rx="270"
          ry="150"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.7"
        />

        {/* Secondary Inner Orbit Path */}
        <ellipse
          cx="320"
          cy="240"
          rx="190"
          ry="105"
          stroke="url(#heroOrangeGrad)"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Central Workstation Platform */}
        <g transform="translate(160, 110)">
          {/* Workstation Laptop / Tablet Hub Base */}
          <rect
            x="40"
            y="70"
            width="240"
            height="150"
            rx="16"
            fill="url(#heroBlueGrad)"
            filter="url(#heroCardShadow)"
          />
          {/* Screen Inner Frame */}
          <rect x="48" y="78" width="224" height="134" rx="10" fill="#0F172A" />

          {/* Browser / App Header bar inside screen */}
          <rect x="48" y="78" width="224" height="22" rx="10" fill="#1E293B" />
          <circle cx="62" cy="89" r="3.5" fill="#EF4444" />
          <circle cx="73" cy="89" r="3.5" fill="#F59E0B" />
          <circle cx="84" cy="89" r="3.5" fill="#10B981" />
          <rect x="98" y="84" width="100" height="10" rx="5" fill="#334155" />

          {/* Dashboard Mini Widgets inside screen */}
          <rect x="58" y="108" width="94" height="46" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <line x1="68" y1="118" x2="105" y2="118" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="126" x2="135" y2="126" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <line x1="68" y1="134" x2="120" y2="134" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

          <rect x="160" y="108" width="102" height="46" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          {/* Mini Bar Chart */}
          <rect x="172" y="136" width="6" height="12" rx="2" fill="#818CF8" />
          <rect x="184" y="126" width="6" height="22" rx="2" fill="#6366F1" />
          <rect x="196" y="120" width="6" height="28" rx="2" fill="#38BDF8" />
          <rect x="208" y="115" width="6" height="33" rx="2" fill="#10B981" />
          <rect x="220" y="130" width="6" height="18" rx="2" fill="#FF9D24" />

          {/* Screen Bottom Action Row */}
          <rect x="58" y="162" width="204" height="40" rx="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <circle cx="78" cy="182" r="10" fill="#3B82F6" fillOpacity="0.2" />
          <path d="M 74 182 L 82 182 M 78 178 L 78 186" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
          <line x1="98" y1="178" x2="180" y2="178" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
          <line x1="98" y1="186" x2="150" y2="186" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
          <rect x="204" y="174" width="46" height="16" rx="4" fill="url(#heroOrangeGrad)" />
          <text x="227" y="185" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">RUN</text>

          {/* Stand Base */}
          <path d="M 120 220 L 200 220 L 215 240 L 105 240 Z" fill="#94A3B8" opacity="0.6" />
          <rect x="90" y="240" width="140" height="8" rx="4" fill="#64748B" />
        </g>

        {/* SATELLITE TOOL CARDS FLOATING AROUND */}

        {/* 1. PDF Tools Card (Top-Left Orbit) */}
        <g transform="translate(45, 55)" filter="url(#heroCardShadow)">
          <rect width="135" height="74" rx="12" fill="url(#heroCardGlass)" stroke="#EF4444" strokeWidth="1.5" />
          <rect x="12" y="12" width="28" height="34" rx="4" fill="#EF4444" />
          <text x="26" y="32" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">PDF</text>
          <text x="48" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">PDF Tools</text>
          <text x="48" y="38" fill="#64748B" fontSize="9" fontFamily="sans-serif">Merge & Extract</text>
          <line x1="12" y1="56" x2="120" y2="56" stroke="#E2E8F0" strokeWidth="1" />
          <text x="12" y="66" fill="#10B981" fontSize="8" fontWeight="600" fontFamily="sans-serif">100% Client-Side</text>
        </g>

        {/* 2. Image Compressor Card (Top-Right Orbit) */}
        <g transform="translate(460, 45)" filter="url(#heroCardShadow)">
          <rect width="140" height="78" rx="12" fill="url(#heroCardGlass)" stroke="#10B981" strokeWidth="1.5" />
          <rect x="12" y="12" width="32" height="32" rx="6" fill="#10B981" />
          {/* Mountain icon */}
          <path d="M 17 38 L 24 28 L 29 34 L 35 24 L 40 38 Z" fill="#FFFFFF" />
          <circle cx="34" cy="20" r="2.5" fill="#FDE047" />
          <text x="50" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Image Studio</text>
          <text x="50" y="38" fill="#64748B" fontSize="9" fontFamily="sans-serif">-74% Size Saved</text>
          <rect x="12" y="52" width="116" height="6" rx="3" fill="#E2E8F0" />
          <rect x="12" y="52" width="86" height="6" rx="3" fill="#10B981" />
        </g>

        {/* 3. Keyword Generator Card (Left Mid Orbit) */}
        <g transform="translate(15, 230)" filter="url(#heroCardShadow)">
          <rect width="135" height="74" rx="12" fill="url(#heroCardGlass)" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="12" y="14" width="28" height="28" rx="6" fill="#0284C7" />
          <circle cx="24" cy="26" r="6" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          <line x1="29" y1="31" x2="35" y2="37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <text x="48" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Keywords</text>
          <text x="48" y="38" fill="#0284C7" fontSize="9" fontWeight="600" fontFamily="sans-serif">SEO & Query Hub</text>
          <line x1="12" y1="52" x2="120" y2="52" stroke="#E2E8F0" strokeWidth="1" />
          <text x="12" y="64" fill="#64748B" fontSize="8" fontFamily="sans-serif">Search Volume: High</text>
        </g>

        {/* 4. Financial Calculator Card (Right Mid Orbit) */}
        <g transform="translate(475, 210)" filter="url(#heroCardShadow)">
          <rect width="145" height="78" rx="12" fill="url(#heroCardGlass)" stroke="#D97706" strokeWidth="1.5" />
          <rect x="12" y="14" width="28" height="30" rx="4" fill="#D97706" />
          <text x="26" y="33" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">₹</text>
          <text x="46" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Financial Calc</text>
          <text x="46" y="38" fill="#64748B" fontSize="9" fontFamily="sans-serif">EMI • SIP • GST</text>
          <rect x="12" y="52" width="120" height="14" rx="4" fill="#FEF3C7" />
          <text x="72" y="63" fill="#92400E" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Instant Amortization</text>
        </g>

        {/* 5. Digital Invitation Card (Bottom-Left Orbit) */}
        <g transform="translate(80, 360)" filter="url(#heroCardShadow)">
          <rect width="150" height="72" rx="12" fill="url(#heroCardGlass)" stroke="#E11D48" strokeWidth="1.5" />
          <rect x="12" y="14" width="28" height="28" rx="6" fill="#E11D48" />
          <path d="M 18 22 L 26 28 L 34 22 M 18 34 L 34 34 L 34 22 L 18 22 Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="48" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Invite Maker</text>
          <text x="48" y="38" fill="#E11D48" fontSize="9" fontWeight="600" fontFamily="sans-serif">Festive & Wedding</text>
          <text x="12" y="58" fill="#64748B" fontSize="8" fontFamily="sans-serif">Custom Themes & Export</text>
        </g>

        {/* 6. QR Code Generator Card (Bottom-Right Orbit) */}
        <g transform="translate(420, 350)" filter="url(#heroCardShadow)">
          <rect width="150" height="72" rx="12" fill="url(#heroCardGlass)" stroke="#6D35D5" strokeWidth="1.5" />
          <rect x="12" y="14" width="28" height="28" rx="6" fill="#6D35D5" />
          {/* Mini QR icon inside */}
          <rect x="16" y="18" width="6" height="6" fill="#FFFFFF" />
          <rect x="30" y="18" width="6" height="6" fill="#FFFFFF" />
          <rect x="16" y="32" width="6" height="6" fill="#FFFFFF" />
          <rect x="25" y="25" width="4" height="4" fill="#FDE047" />
          <text x="48" y="24" fill="#172554" fontSize="11" fontWeight="bold" fontFamily="sans-serif">QR Generator</text>
          <text x="48" y="38" fill="#6D35D5" fontSize="9" fontWeight="600" fontFamily="sans-serif">WiFi • URLs • vCard</text>
          <text x="12" y="58" fill="#64748B" fontSize="8" fontFamily="sans-serif">HD PNG & SVG Vector</text>
        </g>

        {/* Sparkling particle stars */}
        <g fill="#FDE047" filter="url(#heroGlow)">
          <circle cx="210" cy="70" r="3" />
          <circle cx="430" cy="180" r="4" />
          <circle cx="150" cy="320" r="3" />
          <circle cx="390" cy="330" r="3.5" />
          <circle cx="280" cy="410" r="2.5" />
        </g>
      </svg>
    </div>
  );
};
