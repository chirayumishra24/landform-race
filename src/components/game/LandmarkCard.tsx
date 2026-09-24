import React, { useEffect, useState } from 'react';
import { Sparkles, Mountain, Compass } from 'lucide-react';
import { ZoneConfig } from '@/types/game';

interface LandmarkCardProps {
  zone: ZoneConfig | null;
  teamColor: 'blue' | 'orange';
  onDismiss: () => void;
}

export const LandmarkCard: React.FC<LandmarkCardProps> = ({
  zone,
  teamColor,
  onDismiss
}) => {
  useEffect(() => {
    if (zone) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [zone, onDismiss]);

  if (!zone) return null;

  const isBlue = teamColor === 'blue';

  return (
    <div
      className={`fixed top-20 ${
        isBlue ? 'left-6' : 'right-6'
      } z-50 max-w-sm clay-card rounded-2xl p-4 shadow-2xl border-2 transition-all duration-300 animate-bounce-subtle ${
        isBlue ? 'border-sky-400 bg-sky-50/95' : 'border-orange-400 bg-orange-50/95'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
            isBlue ? 'bg-sky-600' : 'bg-orange-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            DISCOVERY UNLOCKED
          </span>
          <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide">
            ENTERING THE {zone.title}
          </h4>
        </div>
      </div>

      <p className="text-xs text-slate-700 font-medium mb-2.5 leading-relaxed">
        {zone.description}
      </p>

      <div className="bg-white/80 rounded-xl p-2 border border-slate-200/70">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
          LOOK FOR:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {zone.lookFor.map((item, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
            >
              • {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
