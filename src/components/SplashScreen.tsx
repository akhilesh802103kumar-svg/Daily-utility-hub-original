import React, { useEffect, useState } from 'react';
import { DailyUtilityHubIcon } from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar increment over ~1.6 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 200);
          return 100;
        }
        // Accelerating curve
        const step = Math.max(2, Math.floor((100 - prev) * 0.18));
        return Math.min(100, prev + step);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-br from-[#1456D9] via-[#2545C6] to-[#6D35D5] text-white select-none">
      {/* Top ambient status */}
      <div className="w-full flex justify-end max-w-md pt-2">
        <button
          onClick={onFinish}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 transition"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Centered Logo & Branding */}
      <div className="flex flex-col items-center text-center animate-fade-in my-auto">
        {/* Animated Glowing Ring Around Toolbox Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#FF9D24]/20 blur-xl animate-pulse" />
          <DailyUtilityHubIcon size={112} className="relative z-10 animate-bounce duration-1000" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          Daily Utility <span className="text-[#FF9D24]">Hub</span>
        </h1>

        {/* Tagline */}
        <p className="mt-2 text-sm sm:text-base font-semibold tracking-widest uppercase text-blue-100/90">
          All in One Website
        </p>

        {/* Hindi Welcome Subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-blue-200/80 font-normal">
          आपके रोज़मर्रा के डिजिटल टूल्स, एक ही जगह।
        </p>

        {/* Progress Bar & Loader */}
        <div className="w-64 mt-8">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-[#FF9D24] to-[#FDE047] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-blue-200/70 mt-2 font-mono">
            <span>Loading Utilities...</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom privacy badge */}
      <div className="pb-4 text-center">
        <p className="text-[11px] text-white/60 tracking-wide">
          100% Client-Side • No Login Required • High Speed
        </p>
      </div>
    </div>
  );
};
