import React from 'react';
import { Home, Layers, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { DailyUtilityHubIcon } from './Logo';

interface MobileBottomBarProps {
  activeView: string;
  onNavigateHome: () => void;
  onNavigateTools: () => void;
  onOpenAbout: () => void;
  onOpenLogoKit: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeView,
  onNavigateHome,
  onNavigateTools,
  onOpenAbout,
  onOpenLogoKit,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        <button
          onClick={onNavigateHome}
          className={`min-h-[44px] flex flex-col items-center justify-center transition ${
            activeView === 'home' ? 'text-[#1456D9]' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        <button
          onClick={onNavigateTools}
          className={`min-h-[44px] flex flex-col items-center justify-center transition ${
            activeView === 'tools' ? 'text-[#1456D9]' : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">6 Tools</span>
        </button>

        <button
          onClick={onOpenLogoKit}
          className="min-h-[44px] flex flex-col items-center justify-center text-slate-500 hover:text-[#6D35D5] transition"
        >
          <Sparkles className="w-5 h-5 text-[#FF9D24]" />
          <span className="text-[10px] font-bold mt-1">Brand Kit</span>
        </button>

        <button
          onClick={onOpenAbout}
          className="min-h-[44px] flex flex-col items-center justify-center text-slate-500 hover:text-[#1456D9] transition"
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">About</span>
        </button>
      </div>
    </div>
  );
};
