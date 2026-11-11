import React, { forwardRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { IndianWeddingCardData } from './types';
import {
  GaneshaEmblem,
  HangingBell,
  RedRoseFloralCorner,
  TraditionalGroomIllustration,
  TraditionalBrideIllustration,
  OrnamentalDivider
} from './WeddingSvgAssets';

interface RoyalTraditionalWeddingProps {
  data: IndianWeddingCardData;
  className?: string;
  isThumbnail?: boolean;
}

export const RoyalTraditionalWedding = forwardRef<HTMLDivElement, RoyalTraditionalWeddingProps>(
  ({ data, className = '', isThumbnail = false }, ref) => {
    return (
      <div
        ref={ref}
        id="royal-traditional-wedding-card"
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF8EA 40%, #FDF1D6 100%)',
          color: '#3B0A11',
          aspectRatio: '1 / 1.414', // Standard A5 / card portrait ratio
        }}
        className={`w-full relative overflow-hidden border-[6px] border-[#D4AF37] rounded-3xl shadow-2xl flex flex-col justify-between select-none ${className}`}
      >
        {/* Outer and Inner Double Gold Border */}
        <div className="absolute inset-2 border-2 border-[#D4AF37] rounded-2xl pointer-events-none opacity-80" />
        <div className="absolute inset-3 border border-[#E5A624] rounded-xl pointer-events-none opacity-60" />

        {/* 4 Corner Ornate Red Rose Bouquets */}
        <div className="absolute top-0 left-0 pointer-events-none z-20">
          <RedRoseFloralCorner className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none z-20">
          <RedRoseFloralCorner flipX className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none z-20">
          <RedRoseFloralCorner flipY className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-20">
          <RedRoseFloralCorner flipX flipY className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>

        {/* Hanging Golden Bells (Top Left & Top Right) */}
        <div className="absolute top-16 left-6 sm:left-8 pointer-events-none z-20 hidden xs:block">
          <HangingBell length={isThumbnail ? 30 : 60} className="w-5 sm:w-7 drop-shadow-sm" />
        </div>
        <div className="absolute top-16 right-6 sm:right-8 pointer-events-none z-20 hidden xs:block">
          <HangingBell length={isThumbnail ? 30 : 60} className="w-5 sm:w-7 drop-shadow-sm" />
        </div>

        {/* ================= CARD HEADER ================= */}
        <div className="relative z-10 text-center pt-5 sm:pt-6 px-8">
          {/* Sacred Devanagari Inscription */}
          <div className="text-xs sm:text-sm font-bold tracking-widest text-[#800020] font-sans">
            ॥ श्री गणेशाय नमः ॥
          </div>

          {/* Golden Lord Ganesha Divine Emblem */}
          <div className="flex justify-center my-0.5 sm:my-1">
            <GaneshaEmblem className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>

          {/* Formal Greeting */}
          <p className="text-[11px] sm:text-xs font-semibold text-[#66101F] tracking-wide mt-0.5">
            You are cordially invited to the
          </p>

          {/* Main Title: Wedding Ceremony */}
          <h2 className="text-2xl sm:text-4xl text-[#800020] font-script tracking-wide -mt-1 sm:-mt-2 leading-tight drop-shadow-xs">
            {data.subTitle || 'Wedding Ceremony'}
          </h2>

          <p className="text-[10px] sm:text-xs font-serif italic text-[#78350F] -mt-0.5">
            of
          </p>
        </div>

        {/* ================= CARD BODY: GROOM, BRIDE & COUPLE DETAILS ================= */}
        <div className="relative z-10 grid grid-cols-12 items-center px-4 sm:px-6 my-auto">
          {/* LEFT: Royal Indian Groom Illustration */}
          <div className="col-span-3 sm:col-span-3 flex justify-center -mr-2 sm:mr-0">
            <TraditionalGroomIllustration className="w-20 sm:w-28 h-auto drop-shadow-md" />
          </div>

          {/* CENTER: Names & Parents */}
          <div className="col-span-6 sm:col-span-6 text-center space-y-1 sm:space-y-1.5 px-1 sm:px-2">
            {/* Groom Name */}
            <div>
              <h3 className="text-base sm:text-2xl font-black text-[#800020] font-playfair tracking-tight leading-none">
                {data.groomName}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-[#6B1826] font-medium italic mt-0.5">
                (Son of {data.groomParents})
              </p>
            </div>

            {/* Ornamental Heart & "with" */}
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D97706]" />
              <span className="text-xs text-[#DC2626]">❤️</span>
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#92400E]">
                with
              </span>
              <span className="text-xs text-[#DC2626]">❤️</span>
              <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D97706]" />
            </div>

            {/* Bride Name */}
            <div>
              <h3 className="text-base sm:text-2xl font-black text-[#800020] font-playfair tracking-tight leading-none">
                {data.brideName}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-[#6B1826] font-medium italic mt-0.5">
                (Daughter of {data.brideParents})
              </p>
            </div>
          </div>

          {/* RIGHT: Royal Indian Bride Illustration */}
          <div className="col-span-3 sm:col-span-3 flex justify-center -ml-2 sm:ml-0">
            <TraditionalBrideIllustration className="w-20 sm:w-28 h-auto drop-shadow-md" />
          </div>
        </div>

        {/* ================= CARD FOOTER: EVENT BAR, VENUE & BLESSINGS ================= */}
        <div className="relative z-10 px-5 sm:px-8 pb-5 sm:pb-6 space-y-2 sm:space-y-2.5">
          {/* Deep Maroon Pill Bar with 3 Sections */}
          <div className="bg-[#6B0C1E] border-2 border-[#E5A624] text-white rounded-2xl py-2 px-3 shadow-md">
            <div className="grid grid-cols-3 divide-x divide-[#E5A624]/60 text-center">
              {/* Date */}
              <div className="px-1 flex flex-col items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-[#FDE047] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-[#FDE047]">
                  Date
                </span>
                <span className="text-[9px] sm:text-xs font-semibold leading-tight line-clamp-1">
                  {data.eventDate}
                </span>
              </div>

              {/* Time */}
              <div className="px-1 flex flex-col items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#FDE047] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-[#FDE047]">
                  Time
                </span>
                <span className="text-[9px] sm:text-xs font-semibold leading-tight line-clamp-1">
                  {data.eventTime}
                </span>
              </div>

              {/* Venue */}
              <div className="px-1 flex flex-col items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#FDE047] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-[#FDE047]">
                  Venue
                </span>
                <span className="text-[9px] sm:text-xs font-semibold leading-tight line-clamp-1">
                  {data.venueName}
                </span>
              </div>
            </div>
          </div>

          {/* Full Venue Address */}
          <div className="text-center text-[9px] sm:text-xs text-[#5C1D24] font-medium leading-tight px-4 line-clamp-2">
            {data.venueAddress}
          </div>

          {/* Divider */}
          <div className="flex justify-center -my-1">
            <OrnamentalDivider color="#B45309" className="w-36 h-3" />
          </div>

          {/* Blessings Message */}
          <p className="text-center text-[9px] sm:text-[11px] text-[#4A0A12] leading-tight px-4 font-serif italic">
            "{data.invitationMessage}"
          </p>

          {/* Maroon Badge: "Your Presence will make our day special!" */}
          <div className="flex justify-center">
            <span className="inline-block bg-[#800020] text-[#FEF08A] text-[9px] sm:text-xs font-extrabold px-3 sm:px-4 py-1 rounded-full border border-[#D4AF37] shadow-sm">
              {data.badgeText || 'Your Presence will make our day special!'}
            </span>
          </div>

          {/* Family Name Signature */}
          <div className="text-center pt-0.5">
            <span className="text-[9px] sm:text-[10px] text-[#78350F] uppercase tracking-wider block font-semibold">
              With Love,
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#800020] font-playfair">
              {data.familyName}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

RoyalTraditionalWedding.displayName = 'RoyalTraditionalWedding';
