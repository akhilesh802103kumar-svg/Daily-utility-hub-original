import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked';
  className?: string;
  onClick?: () => void;
}

const sizeConfig = {
  xs: { iconSize: 28, titleSize: 'text-sm', subSize: 'text-[9px]' },
  sm: { iconSize: 36, titleSize: 'text-base', subSize: 'text-[10px]' },
  md: { iconSize: 44, titleSize: 'text-lg', subSize: 'text-xs' },
  lg: { iconSize: 56, titleSize: 'text-2xl', subSize: 'text-sm' },
  xl: { iconSize: 76, titleSize: 'text-3xl', subSize: 'text-base' },
};

/**
 * Premium standalone Vector SVG Toolbox Icon
 * Includes:
 * - Blue & purple toolbox
 * - Inside symbols: PDF, Image, QR, Calculator
 * - Orange/yellow lightning bolt & orbit
 */
export const DailyUtilityHubIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="Daily Utility Hub Icon"
    >
      <defs>
        <linearGradient id="hubBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1456D9" />
          <stop offset="100%" stopColor="#6D35D5" />
        </linearGradient>

        <linearGradient id="hubBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="60%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        <linearGradient id="hubBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#FF9D24" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="hubMetalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <filter id="hubShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.28" />
        </filter>

        <filter id="hubGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer rounded squircle container */}
      <rect width="512" height="512" rx="120" fill="url(#hubBgGrad)" />

      {/* Orbit ring with light trail */}
      <path
        d="M 85 310 C 70 200, 180 85, 345 95 C 445 102, 465 200, 420 270 C 385 325, 300 405, 160 395"
        fill="none"
        stroke="url(#hubBoltGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.9"
        filter="url(#hubGlow)"
      />
      <circle cx="415" cy="140" r="7" fill="#FDE047" filter="url(#hubGlow)" />
      <circle cx="115" cy="340" r="5" fill="#FF9D24" />

      {/* The Toolbox Group */}
      <g filter="url(#hubShadow)">
        {/* Handle */}
        <path
          d="M 196 150 C 196 125, 316 125, 316 150 L 316 175 L 290 175 L 290 155 C 290 145, 222 145, 222 155 L 222 175 L 196 175 Z"
          fill="url(#hubMetalGrad)"
          stroke="#475569"
          strokeWidth="2"
        />

        {/* Upper Lid with chamfer */}
        <rect x="136" y="172" width="240" height="42" rx="12" fill="url(#hubBoxGrad)" stroke="#60A5FA" strokeWidth="2" />
        <line x1="148" y1="184" x2="364" y2="184" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

        {/* Latches */}
        <rect x="172" y="186" width="24" height="24" rx="4" fill="url(#hubMetalGrad)" stroke="#334155" strokeWidth="1.5" />
        <rect x="316" y="186" width="24" height="24" rx="4" fill="url(#hubMetalGrad)" stroke="#334155" strokeWidth="1.5" />

        {/* Main Lower Box Body */}
        <rect x="146" y="206" width="220" height="175" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
        <rect x="154" y="214" width="204" height="159" rx="12" fill="#1E293B" />

        {/* 1. PDF Symbol (Top-Left) */}
        <g transform="translate(168, 226)">
          <rect width="80" height="66" rx="8" fill="#EF4444" fillOpacity="0.18" stroke="#EF4444" strokeWidth="1.5" />
          <path d="M 26 14 L 46 14 L 54 22 L 54 50 C 54 52, 52 54, 50 54 L 26 54 C 24 54, 22 52, 22 50 L 22 18 C 22 16, 24 14, 26 14 Z" fill="#F87171" />
          <path d="M 46 14 L 46 22 L 54 22 Z" fill="#FCA5A5" />
          <line x1="28" y1="28" x2="42" y2="28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="36" x2="48" y2="36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <rect x="25" y="42" width="26" height="8" rx="2" fill="#B91C1C" />
          <text x="38" y="48" fontFamily="system-ui, sans-serif" fontSize="6" fontWeight="900" fill="#FFFFFF" textAnchor="middle">PDF</text>
        </g>

        {/* 2. Image Symbol (Top-Right) */}
        <g transform="translate(264, 226)">
          <rect width="80" height="66" rx="8" fill="#10B981" fillOpacity="0.18" stroke="#10B981" strokeWidth="1.5" />
          <rect x="20" y="15" width="40" height="34" rx="5" fill="#047857" stroke="#34D399" strokeWidth="1.5" />
          <circle cx="32" cy="24" r="3.5" fill="#FDE047" />
          <path d="M 23 45 L 34 32 L 42 41 L 48 35 L 57 45 Z" fill="#A7F3D0" />
        </g>

        {/* 3. QR Symbol (Bottom-Left) */}
        <g transform="translate(168, 300)">
          <rect width="80" height="66" rx="8" fill="#6366F1" fillOpacity="0.18" stroke="#6366F1" strokeWidth="1.5" />
          <g transform="translate(23, 14)">
            <rect x="0" y="0" width="14" height="14" rx="2" fill="none" stroke="#818CF8" strokeWidth="2" />
            <rect x="3.5" y="3.5" width="7" height="7" rx="1" fill="#C7D2FE" />
            <rect x="20" y="0" width="14" height="14" rx="2" fill="none" stroke="#818CF8" strokeWidth="2" />
            <rect x="23.5" y="3.5" width="7" height="7" rx="1" fill="#C7D2FE" />
            <rect x="0" y="20" width="14" height="14" rx="2" fill="none" stroke="#818CF8" strokeWidth="2" />
            <rect x="3.5" y="23.5" width="7" height="7" rx="1" fill="#C7D2FE" />
            <rect x="20" y="20" width="4" height="4" fill="#A5B4FC" />
            <rect x="28" y="20" width="5" height="5" fill="#C7D2FE" />
            <rect x="20" y="28" width="5" height="5" fill="#C7D2FE" />
            <rect x="29" y="28" width="4" height="4" fill="#818CF8" />
          </g>
        </g>

        {/* 4. Calculator Symbol (Bottom-Right) */}
        <g transform="translate(264, 300)">
          <rect width="80" height="66" rx="8" fill="#F59E0B" fillOpacity="0.18" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="24" y="14" width="32" height="38" rx="4" fill="#B45309" stroke="#FBBF24" strokeWidth="1.5" />
          <rect x="28" y="18" width="24" height="8" rx="2" fill="#1E293B" />
          <text x="49" y="24.5" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#34D399" textAnchor="end">88.5</text>
          <circle cx="31" cy="30" r="1.5" fill="#FDE68A" />
          <circle cx="37" cy="30" r="1.5" fill="#FDE68A" />
          <circle cx="43" cy="30" r="1.5" fill="#FDE68A" />
          <circle cx="49" cy="30" r="1.5" fill="#F59E0B" />
          <circle cx="31" cy="36" r="1.5" fill="#FDE68A" />
          <circle cx="37" cy="36" r="1.5" fill="#FDE68A" />
          <circle cx="43" cy="36" r="1.5" fill="#FDE68A" />
          <circle cx="49" cy="36" r="1.5" fill="#F59E0B" />
          <circle cx="31" cy="42" r="1.5" fill="#FDE68A" />
          <circle cx="37" cy="42" r="1.5" fill="#FDE68A" />
          <circle cx="43" cy="42" r="1.5" fill="#F59E0B" />
          <circle cx="49" cy="42" r="1.5" fill="#10B981" />
        </g>
      </g>

      {/* Orange/Yellow Dynamic Lightning Bolt */}
      <g filter="url(#hubGlow)" transform="translate(325, 275) rotate(-15) scale(0.95)">
        <polygon
          points="40,-45 -10,10 20,12 -25,75 50,15 15,10"
          fill="url(#hubBoltGrad)"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
};

/**
 * Full Brand Logo (Icon + Daily Utility Hub + All in One Website)
 */
export const DailyUtilityHubLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  onClick,
}) => {
  const cfg = sizeConfig[size];

  if (variant === 'icon') {
    return (
      <div onClick={onClick} className={`inline-flex items-center cursor-pointer ${className}`}>
        <DailyUtilityHubIcon size={cfg.iconSize} />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center cursor-pointer select-none group ${className}`}
      >
        <DailyUtilityHubIcon size={cfg.iconSize * 1.5} />
        <span className={`mt-3 font-extrabold tracking-tight text-[#172554] ${cfg.titleSize}`}>
          Daily Utility <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1456D9] to-[#6D35D5]">Hub</span>
        </span>
        <span className={`font-semibold tracking-wider uppercase text-[#FF9D24] ${cfg.subSize}`}>
          All in One Website
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group shrink-0 ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <DailyUtilityHubIcon size={cfg.iconSize} />
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight text-[#172554] transition-colors group-hover:text-[#1456D9] ${cfg.titleSize}`}>
          Daily Utility <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1456D9] to-[#6D35D5]">Hub</span>
        </span>
        <span className={`font-semibold tracking-wider text-[#FF9D24] mt-1 uppercase ${cfg.subSize}`}>
          All in One Website
        </span>
      </div>
    </div>
  );
};
