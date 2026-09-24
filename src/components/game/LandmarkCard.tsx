import React, { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
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
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [zone, onDismiss]);

  if (!zone) return null;

  const isBlue = teamColor === 'blue';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto animate-scaleIn">
      <div
        className={`clay-card rounded-2xl p-4 shadow-2xl border-2 backdrop-blur-md relative overflow-hidden transition-all duration-300 ${
          isBlue ? 'border-sky-400 bg-sky-50/95 shadow-sky-500/20' : 'border-orange-400 bg-orange-50/95 shadow-orange-500/20'
        }`}
      >
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Close discovery notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-2 pr-6">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm ${
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

        <div className="bg-white/85 rounded-xl p-2 border border-slate-200/70 shadow-inner">
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

        {/* Auto-dismiss countdown bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50">
          <div
            className={`h-full transition-all duration-300 ${isBlue ? 'bg-sky-500' : 'bg-orange-500'}`}
            style={{
              animation: 'shrinkWidth 3.8s linear forwards'
            }}
          />
        </div>
      </div>
    </div>
  );
};
