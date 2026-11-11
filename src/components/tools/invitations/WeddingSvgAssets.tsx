import React from 'react';

/**
 * High-Quality Vector SVG Assets for Premium Indian Wedding Invitations
 * Daily Utility Hub
 */

// 1. Lord Ganesha Golden Divine Emblem
export const GaneshaEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ganeshaGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2A3" />
        <stop offset="35%" stopColor="#E5A624" />
        <stop offset="70%" stopColor="#C47D08" />
        <stop offset="100%" stopColor="#FDE047" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#B45309" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#goldGlow)">
      {/* Crown (Mukut) */}
      <path
        d="M50 12 L56 22 L62 16 L58 28 L42 28 L38 16 L44 22 Z"
        fill="url(#ganeshaGold)"
        stroke="#92400E"
        strokeWidth="1.2"
      />
      <circle cx="50" cy="18" r="2.5" fill="#DC2626" />
      <circle cx="44" cy="24" r="1.5" fill="#DC2626" />
      <circle cx="56" cy="24" r="1.5" fill="#DC2626" />

      {/* Head & Ears */}
      {/* Left Ear */}
      <path
        d="M38 30 C22 28 18 42 26 56 C32 64 38 60 40 54"
        fill="none"
        stroke="url(#ganeshaGold)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Right Ear */}
      <path
        d="M62 30 C78 28 82 42 74 56 C68 64 62 60 60 54"
        fill="none"
        stroke="url(#ganeshaGold)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Forehead & Tilak */}
      <path
        d="M44 32 Q50 34 56 32"
        stroke="url(#ganeshaGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Red Tilak */}
      <path d="M50 26 L50 36" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="38" r="1.8" fill="#DC2626" />

      {/* Eyes */}
      <path d="M42 38 Q45 36 47 39" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M58 38 Q55 36 53 39" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />

      {/* Trunk (Sondh) graceful curve to left */}
      <path
        d="M49 38 C52 48 54 62 48 72 C44 78 36 78 34 72 C33 68 37 66 39 68 C40 69 39 72 37 72"
        fill="none"
        stroke="url(#ganeshaGold)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Modak (Sweet) held near trunk */}
      <ellipse cx="64" cy="62" rx="4.5" ry="5.5" fill="url(#ganeshaGold)" stroke="#B45309" strokeWidth="1" />
      <path d="M64 56.5 L64 60" stroke="#DC2626" strokeWidth="1.2" />

      {/* Sacred Tusk */}
      <path d="M44 50 L40 52" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 50 L58 51.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// 2. Hanging Golden Temple Bell with Chain
export const HangingBell: React.FC<{ length?: number; className?: string }> = ({
  length = 70,
  className = 'w-7'
}) => (
  <svg viewBox={`0 0 32 ${length + 38}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bellGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9C4" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="80%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    {/* Delicate hanging chain */}
    {Array.from({ length: Math.floor(length / 7) }).map((_, i) => (
      <ellipse
        key={i}
        cx="16"
        cy={6 + i * 7}
        rx="2"
        ry="3.5"
        stroke="url(#bellGoldGrad)"
        strokeWidth="1.2"
        fill="none"
      />
    ))}
    {/* Bell Attachment Ring */}
    <circle cx="16" cy={length + 5} r="2.8" stroke="url(#bellGoldGrad)" strokeWidth="1.4" fill="none" />
    {/* Bell Body */}
    <path
      d={`M16 ${length + 8} C12 ${length + 8} 8 ${length + 15} 6 ${length + 24} C5 ${length + 28} 5 ${length + 30} 16 ${length + 30} C27 ${length + 30} 27 ${length + 28} 26 ${length + 24} C24 ${length + 15} 20 ${length + 8} 16 ${length + 8} Z`}
      fill="url(#bellGoldGrad)"
      stroke="#78350F"
      strokeWidth="1"
    />
    {/* Bell Bottom Rim */}
    <ellipse cx="16" cy={length + 30} rx="11" ry="2.5" fill="url(#bellGoldGrad)" stroke="#78350F" strokeWidth="0.8" />
    {/* Clapper */}
    <circle cx="16" cy={length + 34} r="2.2" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
  </svg>
);

// 3. Ornate Red Rose & Golden Leaves Corner Bouquet (Traditional)
export const RedRoseFloralCorner: React.FC<{ flipX?: boolean; flipY?: boolean; className?: string }> = ({
  flipX = false,
  flipY = false,
  className = 'w-36 h-36'
}) => {
  const transform = `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`.trim() || undefined;
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform, transformOrigin: 'center' }}
      className={className}
    >
      <defs>
        <radialGradient id="deepRedRose" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="40%" stopColor="#C9184A" />
          <stop offset="75%" stopColor="#800F2F" />
          <stop offset="100%" stopColor="#590D22" />
        </radialGradient>
        <linearGradient id="roseGoldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Golden swirling vine flourishes */}
      <path
        d="M10 10 Q60 15 110 50 Q125 65 130 95"
        stroke="url(#roseGoldLeaf)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 10 Q15 60 50 110 Q65 125 95 130"
        stroke="url(#roseGoldLeaf)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Gold Leaves */}
      <path d="M40 18 Q55 12 60 25 Q50 35 40 18 Z" fill="url(#roseGoldLeaf)" stroke="#92400E" strokeWidth="0.8" />
      <path d="M18 40 Q12 55 25 60 Q35 50 18 40 Z" fill="url(#roseGoldLeaf)" stroke="#92400E" strokeWidth="0.8" />
      <path d="M78 35 Q95 32 98 48 Q82 52 78 35 Z" fill="url(#roseGoldLeaf)" stroke="#92400E" strokeWidth="0.8" />
      <path d="M35 78 Q32 95 48 98 Q52 82 35 78 Z" fill="url(#roseGoldLeaf)" stroke="#92400E" strokeWidth="0.8" />

      {/* Green Foliage */}
      <path d="M60 45 Q75 42 78 58 Q64 62 60 45 Z" fill="#15803D" stroke="#064E3B" strokeWidth="0.8" />
      <path d="M45 60 Q42 75 58 78 Q62 64 45 60 Z" fill="#15803D" stroke="#064E3B" strokeWidth="0.8" />

      {/* Corner Main Big Rose */}
      <g transform="translate(34, 34)">
        <circle cx="0" cy="0" r="28" fill="url(#deepRedRose)" stroke="#4A0413" strokeWidth="1.2" />
        {/* Layered Rose Petals */}
        <path d="M-20 -10 Q0 -26 20 -10 Q24 10 0 24 Q-24 10 -20 -10 Z" fill="#A4133C" opacity="0.9" />
        <path d="M-14 -6 Q0 -18 14 -6 Q18 8 0 16 Q-18 8 -14 -6 Z" fill="#C9184A" />
        <path d="M-8 -3 Q0 -11 8 -3 Q10 5 0 10 Q-10 5 -8 -3 Z" fill="#FF4D6D" />
        <ellipse cx="0" cy="1" rx="4" ry="3" fill="#FFE4E6" />
      </g>

      {/* Secondary Smaller Rose Top */}
      <g transform="translate(90, 24)">
        <circle cx="0" cy="0" r="17" fill="url(#deepRedRose)" stroke="#4A0413" strokeWidth="1" />
        <path d="M-11 -5 Q0 -14 11 -5 Q13 6 0 11 Q-13 6 -11 -5 Z" fill="#C9184A" />
        <circle cx="0" cy="0" r="4.5" fill="#FF758F" />
      </g>

      {/* Secondary Smaller Rose Bottom */}
      <g transform="translate(24, 90)">
        <circle cx="0" cy="0" r="17" fill="url(#deepRedRose)" stroke="#4A0413" strokeWidth="1" />
        <path d="M-11 -5 Q0 -14 11 -5 Q13 6 0 11 Q-13 6 -11 -5 Z" fill="#C9184A" />
        <circle cx="0" cy="0" r="4.5" fill="#FF758F" />
      </g>

      {/* Golden Berries & Dew Drops */}
      <circle cx="95" cy="58" r="3.2" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="106" cy="66" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="58" cy="95" r="3.2" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
      <circle cx="66" cy="106" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="0.8" />
    </svg>
  );
};

// 4. Traditional Indian Groom Illustration (Pagdi, Sherwani, Dupatta)
export const TraditionalGroomIllustration: React.FC<{ className?: string }> = ({
  className = 'w-32 h-56'
}) => (
  <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="groomRedTurban" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      <linearGradient id="groomSherwani" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="60%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <linearGradient id="groomGoldZari" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Royal Pagdi (Turban) with Gold Kalgi Feather */}
    <g id="pagdi">
      {/* Turban folds */}
      <path
        d="M45 28 C35 15 75 8 82 22 C88 32 78 45 65 46 C50 46 45 38 45 28 Z"
        fill="url(#groomRedTurban)"
        stroke="#7F1D1D"
        strokeWidth="1.2"
      />
      <path
        d="M42 35 C50 25 78 22 84 32 C88 40 76 46 60 46 C48 46 42 42 42 35 Z"
        fill="#B91C1C"
      />
      {/* Gold bands in turban */}
      <path d="M44 32 Q62 25 82 28" stroke="url(#groomGoldZari)" strokeWidth="2.5" fill="none" />
      <path d="M43 38 Q64 32 83 37" stroke="url(#groomGoldZari)" strokeWidth="2" fill="none" />

      {/* Royal Kalgi (Feather Brooch) */}
      <path d="M46 22 Q40 8 48 3 Q54 10 49 24" fill="url(#groomGoldZari)" stroke="#92400E" strokeWidth="0.8" />
      <circle cx="48" cy="24" r="3.2" fill="#DC2626" stroke="#FEF08A" strokeWidth="1" />
      {/* Hanging pearl droplet */}
      <ellipse cx="48" cy="29" rx="1.5" ry="2.2" fill="#FFF" />

      {/* Long trailing dupatta tail of turban */}
      <path
        d="M40 38 Q28 65 24 105 Q22 135 25 155"
        stroke="url(#groomRedTurban)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 38 Q28 65 24 105 Q22 135 25 155"
        stroke="url(#groomGoldZari)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2 3"
      />
    </g>

    {/* Groom Face Profile (Handsome Royal Demeanor facing right) */}
    <g id="face">
      {/* Neck */}
      <path d="M55 52 L55 68 L68 68 L68 54 Z" fill="#FAD2B0" />
      {/* Face profile facing right */}
      <path
        d="M50 36 C55 36 68 38 72 44 C76 48 80 50 82 52 C78 54 75 56 78 59 C74 61 71 63 68 64 C64 66 54 66 50 56 Z"
        fill="#FAD2B0"
        stroke="#E0A97E"
        strokeWidth="0.8"
      />
      {/* Ear */}
      <ellipse cx="53" cy="50" rx="3.5" ry="5.5" fill="#FAD2B0" stroke="#E0A97E" strokeWidth="0.6" />
      {/* Eye & Brow */}
      <path d="M68 45 Q73 43 76 46" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="73" cy="48" r="1.5" fill="#1E1B4B" />
      {/* Sharp regal mustache */}
      <path d="M72 58 Q77 56 81 57 Q76 60 71 59 Z" fill="#1E1B4B" />
    </g>

    {/* Groom Sherwani Body */}
    <g id="sherwani">
      {/* Main Jacket */}
      <path
        d="M40 68 C45 64 68 64 78 68 L92 105 L88 185 L36 185 L32 105 Z"
        fill="url(#groomSherwani)"
        stroke="#CA8A04"
        strokeWidth="1.2"
      />
      {/* Mandarin Collar */}
      <path d="M54 65 Q62 62 70 65 L70 70 Q62 67 54 70 Z" fill="url(#groomGoldZari)" stroke="#854D0E" strokeWidth="0.8" />

      {/* Golden Button Placket & Buttons */}
      <line x1="64" y1="70" x2="64" y2="160" stroke="url(#groomGoldZari)" strokeWidth="3" />
      {[76, 88, 100, 112, 124, 136, 148].map((y) => (
        <circle key={y} cx="64" cy={y} r="2" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />
      ))}

      {/* Embroidered floral zari motifs on chest */}
      <path d="M52 82 Q58 88 52 94" stroke="url(#groomGoldZari)" strokeWidth="1.2" fill="none" />
      <path d="M76 82 Q70 88 76 94" stroke="url(#groomGoldZari)" strokeWidth="1.2" fill="none" />

      {/* Red & Gold Dupatta / Stole draped across shoulder */}
      <path
        d="M36 78 C42 85 48 115 48 185 L38 185 C34 125 30 88 36 78 Z"
        fill="url(#groomRedTurban)"
        stroke="url(#groomGoldZari)"
        strokeWidth="1.5"
      />
      <path d="M38 180 L48 180" stroke="#FDE047" strokeWidth="2.5" />

      {/* Royal Pearl Kantha Necklace */}
      <path d="M54 73 Q64 86 74 73" stroke="#FFF" strokeWidth="2.5" fill="none" strokeDasharray="2 3" />
      <path d="M52 77 Q64 94 76 77" stroke="#FFF" strokeWidth="2.5" fill="none" strokeDasharray="2 3" />
      <circle cx="64" cy="95" r="3" fill="#DC2626" stroke="#FDE047" strokeWidth="1" />
    </g>
  </svg>
);

// 5. Traditional Indian Bride Illustration (Lehenga, Chunni, Bridal Jewels)
export const TraditionalBrideIllustration: React.FC<{ className?: string }> = ({
  className = 'w-32 h-56'
}) => (
  <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="brideRedLehenga" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#6B0C1E" />
      </linearGradient>
      <linearGradient id="brideGoldJewels" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Translucent Red Bridal Dupatta / Chunni draped gracefully over head */}
    <g id="chunni">
      <path
        d="M45 22 C35 22 30 38 28 65 C25 105 28 155 35 185 L42 185 C36 150 36 100 42 65 C45 45 48 30 45 22 Z"
        fill="url(#brideRedLehenga)"
        opacity="0.9"
      />
      {/* Golden Zari Border on Chunni */}
      <path
        d="M45 22 C35 22 30 38 28 65 C25 105 28 155 35 185"
        stroke="url(#brideGoldJewels)"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Sheer floral gold buttis on dupatta */}
      <circle cx="34" cy="85" r="1.5" fill="#FEF08A" />
      <circle cx="32" cy="115" r="1.5" fill="#FEF08A" />
      <circle cx="35" cy="145" r="1.5" fill="#FEF08A" />
    </g>

    {/* Bride Face Profile (Facing Left) */}
    <g id="brideFace">
      {/* Hair Bun with Gold Flowers */}
      <circle cx="68" cy="42" r="14" fill="#1E1B4B" />
      <circle cx="76" cy="40" r="3.5" fill="url(#brideGoldJewels)" />
      <circle cx="74" cy="46" r="3" fill="#DC2626" />

      {/* Head / Forehead */}
      <path
        d="M65 32 C58 32 48 38 45 45 C42 48 38 52 40 55 C43 56 46 58 44 61 C47 63 50 64 54 65 C60 66 66 64 68 54 Z"
        fill="#FAD2B0"
        stroke="#E0A97E"
        strokeWidth="0.8"
      />
      {/* Neck */}
      <path d="M54 65 L54 78 L66 78 L66 64 Z" fill="#FAD2B0" />

      {/* Maang Tikka (Golden Forehead Jewel) */}
      <line x1="62" y1="33" x2="49" y2="44" stroke="url(#brideGoldJewels)" strokeWidth="1.2" />
      <circle cx="48" cy="45" r="2.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />

      {/* Graceful Eye with Kohl & Bindi */}
      <path d="M48 48 Q52 46 56 48" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="51" cy="50" r="1.5" fill="#1E1B4B" />
      {/* Red bridal bindi */}
      <circle cx="46" cy="46" r="1.2" fill="#DC2626" />

      {/* Jhumka (Earring) */}
      <circle cx="62" cy="52" r="2" fill="url(#brideGoldJewels)" />
      <path d="M59 55 L65 55 L62 60 Z" fill="url(#brideGoldJewels)" />
    </g>

    {/* Heavy Bridal Choker Necklace */}
    <g id="necklace">
      <path d="M48 70 Q58 82 68 70" stroke="url(#brideGoldJewels)" strokeWidth="4" fill="none" />
      <path d="M46 75 Q58 89 70 75" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeDasharray="2 2" />
    </g>

    {/* Bridal Blouse & Lehenga Attire */}
    <g id="lehenga">
      {/* Blouse */}
      <path
        d="M44 76 C52 74 65 74 72 76 L82 110 L40 110 Z"
        fill="url(#brideRedLehenga)"
        stroke="#991B1B"
        strokeWidth="1"
      />
      {/* Gold embroidery on blouse */}
      <path d="M50 82 Q58 92 66 82" stroke="url(#brideGoldJewels)" strokeWidth="1.5" fill="none" />

      {/* Bridal Bangles / Chuda on Arms */}
      <path d="M40 102 L40 116" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <path d="M40 102 L40 116" stroke="url(#brideGoldJewels)" strokeWidth="1.5" strokeDasharray="2 3" />

      {/* Flowing Lehenga Skirt with Heavy Gold Zari Work */}
      <path
        d="M38 110 L84 110 L94 185 L28 185 Z"
        fill="url(#brideRedLehenga)"
        stroke="#7F1D1D"
        strokeWidth="1.2"
      />
      {/* Intricate Gold Borders at Bottom of Lehenga */}
      <path d="M28 175 L94 175" stroke="url(#brideGoldJewels)" strokeWidth="3" />
      <path d="M28 181 L94 181" stroke="url(#brideGoldJewels)" strokeWidth="4" />
      {/* Chevron patterns */}
      <path
        d="M34 165 L39 172 L44 165 L49 172 L54 165 L59 172 L64 165 L69 172 L74 165 L79 172 L84 165 L89 172"
        stroke="url(#brideGoldJewels)"
        strokeWidth="1.2"
        fill="none"
      />
    </g>
  </svg>
);

// 6. Purple Floral Corner Bouquet (Modern Lavender & Rose)
export const PurpleRoseFloralCorner: React.FC<{ flipX?: boolean; flipY?: boolean; className?: string }> = ({
  flipX = false,
  flipY = false,
  className = 'w-36 h-36'
}) => {
  const transform = `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`.trim() || undefined;
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform, transformOrigin: 'center' }}
      className={className}
    >
      <defs>
        <radialGradient id="purpleRoseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="35%" stopColor="#C084FC" />
          <stop offset="70%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
        <radialGradient id="pinkRoseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCE7F3" />
          <stop offset="40%" stopColor="#F472B6" />
          <stop offset="75%" stopColor="#DB2777" />
          <stop offset="100%" stopColor="#831843" />
        </radialGradient>
        <linearGradient id="purpleGoldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Delicate Gold Vines */}
      <path d="M10 10 Q65 18 115 55 Q125 70 128 95" stroke="url(#purpleGoldLeaf)" strokeWidth="2" fill="none" />
      <path d="M10 10 Q18 65 55 115 Q70 125 95 128" stroke="url(#purpleGoldLeaf)" strokeWidth="2" fill="none" />

      {/* Gold & Olive Leaves */}
      <path d="M42 20 Q56 15 62 28 Q52 38 42 20 Z" fill="url(#purpleGoldLeaf)" />
      <path d="M20 42 Q15 56 28 62 Q38 52 20 42 Z" fill="url(#purpleGoldLeaf)" />
      <path d="M65 42 Q80 38 84 52 Q70 58 65 42 Z" fill="#15803D" />
      <path d="M42 65 Q38 80 52 84 Q58 70 42 65 Z" fill="#15803D" />

      {/* Main Purple Rose */}
      <g transform="translate(36, 36)">
        <circle cx="0" cy="0" r="28" fill="url(#purpleRoseGrad)" stroke="#3B0764" strokeWidth="1.2" />
        <path d="M-20 -10 Q0 -26 20 -10 Q24 10 0 24 Q-24 10 -20 -10 Z" fill="#6B21A8" opacity="0.9" />
        <path d="M-14 -6 Q0 -18 14 -6 Q18 8 0 16 Q-18 8 -14 -6 Z" fill="#A855F7" />
        <path d="M-8 -3 Q0 -11 8 -3 Q10 5 0 10 Q-10 5 -8 -3 Z" fill="#D8B4FE" />
        <ellipse cx="0" cy="1" rx="4" ry="3" fill="#FAF5FF" />
      </g>

      {/* Pink Rose Top */}
      <g transform="translate(92, 26)">
        <circle cx="0" cy="0" r="18" fill="url(#pinkRoseGrad)" stroke="#831843" strokeWidth="1" />
        <path d="M-12 -6 Q0 -15 12 -6 Q14 7 0 12 Q-14 7 -12 -6 Z" fill="#EC4899" />
        <circle cx="0" cy="0" r="4.5" fill="#FDF2F8" />
      </g>

      {/* Blue / Violet Flower Bottom */}
      <g transform="translate(26, 92)">
        <circle cx="0" cy="0" r="18" fill="#4338CA" stroke="#312E81" strokeWidth="1" />
        {/* Five petals */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-9"
            rx="5.5"
            ry="7.5"
            fill="#6366F1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="4.5" fill="#FDE047" />
      </g>

      {/* Lavender Buds & Gold Berries */}
      <circle cx="98" cy="62" r="3" fill="#C084FC" />
      <circle cx="108" cy="70" r="2.5" fill="#E9D5FF" />
      <circle cx="62" cy="98" r="3" fill="#C084FC" />
      <circle cx="70" cy="108" r="2.5" fill="#E9D5FF" />
    </svg>
  );
};

// 7. Hanging Moroccan / Mughal Golden Lantern
export const HangingLantern: React.FC<{ length?: number; className?: string }> = ({
  length = 60,
  className = 'w-8'
}) => (
  <svg viewBox={`0 0 36 ${length + 48}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="lanternGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="80%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0.3" />
      </radialGradient>
    </defs>

    {/* Hanging Chain */}
    <line x1="18" y1="0" x2="18" y2={length} stroke="url(#lanternGoldGrad)" strokeWidth="1.5" strokeDasharray="3 2" />
    <circle cx="18" cy={length + 2} r="2.5" stroke="url(#lanternGoldGrad)" strokeWidth="1.2" fill="none" />

    {/* Lantern Dome / Top Cap */}
    <path
      d={`M18 ${length + 5} L25 ${length + 14} L11 ${length + 14} Z`}
      fill="url(#lanternGoldGrad)"
      stroke="#78350F"
      strokeWidth="0.8"
    />

    {/* Glass Chamber with Warm Glowing Light */}
    <rect
      x="10"
      y={length + 14}
      width="16"
      height="22"
      rx="2"
      fill="url(#lanternGlow)"
      stroke="url(#lanternGoldGrad)"
      strokeWidth="1.5"
    />
    {/* Inner candle glow */}
    <ellipse cx="18" cy={length + 25} rx="4" ry="7" fill="#FFFFFF" opacity="0.8" />

    {/* Filigree ribs across glass */}
    <line x1="18" y1={length + 14} x2="18" y2={length + 36} stroke="url(#lanternGoldGrad)" strokeWidth="1" />
    <line x1="10" y1={length + 25} x2="26" y2={length + 25} stroke="url(#lanternGoldGrad)" strokeWidth="1" />

    {/* Bottom Base */}
    <path
      d={`M11 ${length + 36} L25 ${length + 36} L21 ${length + 42} L15 ${length + 42} Z`}
      fill="url(#lanternGoldGrad)"
      stroke="#78350F"
      strokeWidth="0.8"
    />
    {/* Bottom finial drop */}
    <circle cx="18" cy={length + 45} r="2" fill="url(#lanternGoldGrad)" />
  </svg>
);

// 8. Elegant Romantic Couple Silhouette (Modern Wedding)
export const RomanticCoupleSilhouette: React.FC<{ className?: string }> = ({
  className = 'w-36 h-56'
}) => (
  <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="purpleGownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7E22CE" />
        <stop offset="40%" stopColor="#6B21A8" />
        <stop offset="80%" stopColor="#581C87" />
        <stop offset="100%" stopColor="#3B0764" />
      </linearGradient>
      <linearGradient id="tuxedoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="veilGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.75" />
        <stop offset="60%" stopColor="#D8B4FE" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#FAF5FF" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Groom Silhouette (Left) */}
    <g id="groomSilhouette">
      {/* Head */}
      <circle cx="38" cy="28" r="9" fill="url(#tuxedoGrad)" />
      {/* Tuxedo Jacket & Shoulders */}
      <path
        d="M26 40 C32 37 44 37 48 40 L50 85 L32 85 L24 60 Z"
        fill="url(#tuxedoGrad)"
      />
      {/* Arm holding bride gently */}
      <path
        d="M44 48 C48 55 56 60 62 62 L60 68 C52 66 44 58 40 52 Z"
        fill="url(#tuxedoGrad)"
      />
      {/* Tuxedo Trousers */}
      <path d="M28 85 L36 160 L42 160 L48 85 Z" fill="url(#tuxedoGrad)" />
    </g>

    {/* Bride Silhouette (Right) */}
    <g id="brideSilhouette">
      {/* Delicate floating veil */}
      <path
        d="M58 28 C68 28 84 45 92 75 C96 95 90 120 80 135 C74 110 70 65 64 35 Z"
        fill="url(#veilGlow)"
      />

      {/* Bride Head & Elegant Bun */}
      <circle cx="56" cy="32" r="7.5" fill="#3B0764" />
      <circle cx="62" cy="30" r="4.5" fill="#3B0764" />

      {/* Slender Back & Bodice */}
      <path
        d="M50 42 C54 41 62 43 64 47 C65 55 60 70 56 75 L46 72 C48 65 48 50 50 42 Z"
        fill="url(#purpleGownGrad)"
      />

      {/* Bride's Graceful Arm reaching to Groom */}
      <path
        d="M52 48 C46 54 44 58 42 62 L45 65 C48 60 52 56 56 52 Z"
        fill="#3B0764"
      />

      {/* Flowing Ballgown / Mermaid Train */}
      <path
        d="M48 72 C56 75 62 82 66 98 C72 120 88 150 102 165 L36 165 C38 145 42 105 48 72 Z"
        fill="url(#purpleGownGrad)"
      />
      {/* Highlights & drapery folds on gown */}
      <path
        d="M56 85 C62 105 70 135 78 165"
        stroke="#A855F7"
        strokeWidth="1.5"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M62 95 C72 120 84 148 94 165"
        stroke="#C084FC"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
      />
    </g>
  </svg>
);

// 9. Ornamental Gold Filigree Divider with Heart
export const OrnamentalDivider: React.FC<{ color?: string; className?: string }> = ({
  color = '#D97706',
  className = 'w-48 h-5'
}) => (
  <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 10 L80 10 M120 10 L190 10"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="83" cy="10" r="2" fill={color} />
    <circle cx="117" cy="10" r="2" fill={color} />
    {/* Center Heart */}
    <path
      d="M100 15 C96 11 92 8 95 4 C98 0 100 3 100 4 C100 3 102 0 105 4 C108 8 104 11 100 15 Z"
      fill={color}
    />
  </svg>
);
