import React, { forwardRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { IndianWeddingCardData } from './types';
import {
  PurpleRoseFloralCorner,
  HangingLantern,
  RomanticCoupleSilhouette,
  OrnamentalDivider
} from './WeddingSvgAssets';

interface ElegantPurpleFloralWeddingProps {
  data: IndianWeddingCardData;
  className?: string;
  isThumbnail?: boolean;
}

export const ElegantPurpleFloralWedding = forwardRef<HTMLDivElement, ElegantPurpleFloralWeddingProps>(
  ({ data, className = '', isThumbnail = false }, ref) => {
    return (
      <div
        ref={ref}
        id="elegant-purple-floral-wedding-card"
        style={{
          background: 'linear-gradient(145deg, #FAF5FF 0%, #F5EAFF 35%, #F0E5FF 70%, #E9D5FF 100%)',
          color: '#2E1065',
          aspectRatio: '1 / 1.414', // Standard A5 / card portrait ratio
        }}
        className={`w-full relative overflow-hidden border-[6px] border-[#D4AF37] rounded-3xl shadow-2xl flex flex-col justify-between select-none ${className}`}
      >
        {/* Gold Frame and Inner Hairline Border */}
        <div className="absolute inset-2 border-2 border-[#D4AF37] rounded-2xl pointer-events-none opacity-80" />
        <div className="absolute inset-3.5 border border-[#C084FC] rounded-xl pointer-events-none opacity-40" />

        {/* Floral Corners: Top-Left, Bottom-Left, Bottom-Right */}
        <div className="absolute top-0 left-0 pointer-events-none z-20">
          <PurpleRoseFloralCorner className="w-28 h-28 sm:w-32 sm:h-32" />
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none z-20">
          <PurpleRoseFloralCorner flipY className="w-24 h-24 sm:w-28 sm:h-28" />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-20">
          <PurpleRoseFloralCorner flipX flipY className="w-26 h-26 sm:w-30 sm:h-30" />
        </div>

        {/* Top-Right Hanging Golden Lanterns (2 lanterns on chains) */}
        <div className="absolute top-0 right-7 sm:right-10 pointer-events-none z-20 flex gap-2">
          <HangingLantern length={isThumbnail ? 30 : 50} className="w-6 sm:w-8 drop-shadow-md" />
          <HangingLantern length={isThumbnail ? 45 : 85} className="w-6 sm:w-8 drop-shadow-md -mt-2" />
        </div>

        {/* ================= CARD HEADER ================= */}
        <div className="relative z-10 text-center pt-5 sm:pt-6 px-12 sm:px-14">
          {/* Subtle Romantic Header */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-serif font-semibold text-[#6B21A8] tracking-widest uppercase">
            <span>Together Forever</span>
            <span className="text-[#9333EA]">💜</span>
          </div>

          <p className="text-[10px] sm:text-xs text-[#581C87] font-medium tracking-wide mt-1">
            You are cordially invited to the
          </p>

          {/* Script Title: Wedding Ceremony */}
          <h2 className="text-3xl sm:text-4.5xl text-[#581C87] font-script tracking-wide leading-tight -mt-1 sm:-mt-1.5 drop-shadow-xs">
            {data.subTitle || 'Wedding Ceremony'}
          </h2>

          {/* Gold Ornamental Divider with Heart */}
          <div className="flex justify-center -my-0.5">
            <OrnamentalDivider color="#D4AF37" className="w-36 h-3" />
          </div>

          <p className="text-[10px] sm:text-xs font-serif italic text-[#7E22CE] -mt-1">
            of
          </p>
        </div>

        {/* ================= CARD BODY: COUPLE SILHOUETTE & EDITABLE NAMES ================= */}
        <div className="relative z-10 grid grid-cols-12 items-center px-4 sm:px-8 my-auto">
          {/* LEFT: Romantic Couple Silhouette (Tuxedo & Purple Gown) */}
          <div className="col-span-5 sm:col-span-5 flex justify-center items-center -ml-2 sm:ml-0">
            <RomanticCoupleSilhouette className="w-24 sm:w-32 h-auto drop-shadow-lg" />
          </div>

          {/* RIGHT: Groom, Ampersand, Bride & Parents Details */}
          <div className="col-span-7 sm:col-span-7 text-left space-y-1 sm:space-y-2 pl-1 sm:pl-3">
            {/* Groom Name */}
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-[#3B0764] font-playfair tracking-tight leading-none">
                {data.groomName}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-[#6B21A8] font-medium italic mt-0.5">
                (Son of {data.groomParents})
              </p>
            </div>

            {/* Elegant Ampersand with Horizontal Flourish */}
            <div className="flex items-center gap-2 py-0.5">
              <span className="w-6 sm:w-10 h-[1px] bg-[#D4AF37]" />
              <span className="text-lg sm:text-2xl text-[#7E22CE] font-playfair italic font-bold">
                &amp;
              </span>
              <span className="w-6 sm:w-10 h-[1px] bg-[#D4AF37]" />
            </div>

            {/* Bride Name */}
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-[#3B0764] font-playfair tracking-tight leading-none">
                {data.brideName}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-[#6B21A8] font-medium italic mt-0.5">
                (Daughter of {data.brideParents})
              </p>
            </div>
          </div>
        </div>

        {/* ================= CARD FOOTER: EVENT BAR, VENUE & BLESSINGS ================= */}
        <div className="relative z-10 px-5 sm:px-8 pb-5 sm:pb-6 space-y-2 sm:space-y-2.5">
          {/* Elegant Cream & Gold Event Bar with 3 Sections */}
          <div className="bg-[#FFFDF7] border-2 border-[#D4AF37] text-[#3B0764] rounded-2xl py-2 px-3 shadow-md">
            <div className="grid grid-cols-3 divide-x divide-[#D4AF37]/50 text-center">
              {/* Date */}
              <div className="px-1 flex flex-col items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-[#7E22CE] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold text-[#7E22CE]">
                  Date
                </span>
                <span className="text-[9px] sm:text-xs font-bold leading-tight line-clamp-1">
                  {data.eventDate}
                </span>
              </div>

              {/* Time */}
              <div className="px-1 flex flex-col items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#7E22CE] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold text-[#7E22CE]">
                  Time
                </span>
                <span className="text-[9px] sm:text-xs font-bold leading-tight line-clamp-1">
                  {data.eventTime}
                </span>
              </div>

              {/* Venue */}
              <div className="px-1 flex flex-col items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#7E22CE] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-extrabold text-[#7E22CE]">
                  Venue
                </span>
                <span className="text-[9px] sm:text-xs font-bold leading-tight line-clamp-1">
                  {data.venueName}
                </span>
              </div>
            </div>
          </div>

          {/* Full Venue Address */}
          <div className="text-center text-[9px] sm:text-xs text-[#4C1D95] font-medium leading-tight px-4 line-clamp-2">
            {data.venueAddress}
          </div>

          {/* Invitation Message */}
          <p className="text-center text-[9px] sm:text-[11px] text-[#3B0764] leading-tight px-4 font-serif italic">
            "{data.invitationMessage}"
          </p>

          {/* Royal Purple Badge: "Please Join Us" with Ornamental Side Wings */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-[#D4AF37]">❖</span>
            <span className="inline-block bg-[#581C87] text-[#FAF5FF] text-[9px] sm:text-xs font-extrabold px-4 sm:px-5 py-1 rounded-full border border-[#D4AF37] shadow-sm tracking-wide">
              {data.badgeText || 'Please Join Us'}
            </span>
            <span className="text-xs text-[#D4AF37]">❖</span>
          </div>

          {/* Family Name Signature */}
          <div className="text-center pt-0.5">
            <span className="text-[9px] sm:text-[10px] text-[#7E22CE] uppercase tracking-wider block font-semibold">
              With Best Wishes,
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#3B0764] font-playfair">
              {data.familyName}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ElegantPurpleFloralWedding.displayName = 'ElegantPurpleFloralWedding';
