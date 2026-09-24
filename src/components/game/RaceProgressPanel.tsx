import React from 'react';
import { Rocket, Zap, Eye, Mountain } from 'lucide-react';
import { ZONE_CONFIGS } from '@/data/questions';
import { TeamProgress } from '@/types/game';

interface RaceProgressPanelProps {
  blueTeam: TeamProgress;
  orangeTeam: TeamProgress;
  onSelectZoneToView?: (zoneId: string) => void;
}

export const RaceProgressPanel: React.FC<RaceProgressPanelProps> = ({
  blueTeam,
  orangeTeam,
  onSelectZoneToView
}) => {
  // SVG Landform mini thumbnail illustrations
  const renderZoneIcon = (id: string) => {
    switch (id) {
      case 'mountains':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <polygon points="50,15 15,85 85,85" fill="#94a3b8" />
            <polygon points="50,15 38,40 50,48 62,40" fill="#ffffff" />
            <polygon points="68,35 45,85 92,85" fill="#64748b" opacity="0.6" />
          </svg>
        );
      case 'valley':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <path d="M10,20 Q35,80 50,85 Q65,80 90,20 L90,90 L10,90 Z" fill="#86efac" />
            <path d="M42,20 Q48,50 46,90 L54,90 Q52,50 58,20 Z" fill="#0284c7" />
          </svg>
        );
      case 'plateau':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <polygon points="20,40 80,40 90,85 10,85" fill="#fb923c" />
            <rect x="20" y="36" width="60" height="8" rx="2" fill="#ea580c" />
          </svg>
        );
      case 'plains':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <rect x="10" y="30" width="80" height="55" rx="6" fill="#bef264" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#65a30d" strokeWidth="3" />
            <line x1="10" y1="70" x2="90" y2="70" stroke="#ca8a04" strokeWidth="3" />
            <circle cx="50" cy="24" r="10" fill="#facc15" />
          </svg>
        );
      case 'river':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <rect x="10" y="20" width="80" height="65" rx="6" fill="#a7f3d0" />
            <path d="M15,50 Q35,25 50,50 T85,50" fill="none" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" />
          </svg>
        );
      case 'settlement':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2">
            <rect x="18" y="45" width="22" height="38" rx="2" fill="#fed7aa" />
            <rect x="44" y="35" width="26" height="48" rx="2" fill="#fdba74" />
            <rect x="74" y="52" width="16" height="31" rx="2" fill="#fed7aa" />
            <polygon points="57,18 75,28 75,34 57,24" fill="#ea580c" />
          </svg>
        );
      default:
        return <Mountain className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <footer className="w-full h-28 px-5 clay-card rounded-2xl flex items-center justify-between z-20 select-none shrink-0">
      {/* LEFT: Race Progress Header */}
      <div className="flex items-center gap-3 pr-4 border-r border-slate-200 shrink-0">
        <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner shrink-0">
          <Rocket className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 font-heading">
            RACE PROGRESS
          </h4>
          <p className="text-[10px] font-medium text-slate-500 max-w-[140px] leading-tight">
            Complete all landform zones to win the race!
          </p>
        </div>
      </div>

      {/* CENTER: Horizontal Route with Circular Landform Nodes */}
      <div className="flex-1 flex items-center justify-evenly px-4 overflow-x-auto">
        {ZONE_CONFIGS.map((zone, idx) => {
          const isBlueHere =
            blueTeam.checkpoint >= zone.startCheckpoint &&
            (blueTeam.checkpoint <= zone.endCheckpoint || (idx === ZONE_CONFIGS.length - 1 && blueTeam.checkpoint >= 15));

          const isOrangeHere =
            orangeTeam.checkpoint >= zone.startCheckpoint &&
            (orangeTeam.checkpoint <= zone.endCheckpoint || (idx === ZONE_CONFIGS.length - 1 && orangeTeam.checkpoint >= 15));

          const isBluePast = blueTeam.checkpoint > zone.endCheckpoint;
          const isOrangePast = orangeTeam.checkpoint > zone.endCheckpoint;

          return (
            <React.Fragment key={zone.id}>
              {/* Node Item */}
              <div
                onClick={() => onSelectZoneToView?.(zone.id)}
                className="flex flex-col items-center cursor-pointer group relative transition-transform hover:scale-105"
              >
                {/* Team Position Dots above circle */}
                <div className="h-4 flex items-center gap-1.5 mb-1">
                  {isBlueHere && (
                    <div
                      title="Team North Star is here"
                      className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-2 ring-white shadow-md shadow-sky-500/50 animate-bounce"
                    />
                  )}
                  {isOrangeHere && (
                    <div
                      title="Team Earth Explorers is here"
                      className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-2 ring-white shadow-md shadow-orange-500/50 animate-bounce"
                    />
                  )}
                </div>

                {/* Circular Landform Thumbnail */}
                <div
                  className={`w-14 h-14 rounded-full p-1 border-2 transition-all shadow-md relative overflow-hidden bg-white ${
                    isBluePast && isOrangePast
                      ? 'border-purple-400 ring-2 ring-purple-100'
                      : isBluePast || isBlueHere
                      ? 'border-sky-400 ring-2 ring-sky-100'
                      : isOrangePast || isOrangeHere
                      ? 'border-orange-400 ring-2 ring-orange-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-slate-50 overflow-hidden flex items-center justify-center">
                    {renderZoneIcon(zone.id)}
                  </div>
                </div>

                {/* Title & Checkpoint Range */}
                <div className="text-center mt-1">
                  <p className="text-[11px] font-extrabold text-slate-800 tracking-tight leading-tight group-hover:text-sky-600 transition-colors">
                    {zone.title}
                  </p>
                  <span className="text-[10px] font-bold text-slate-500">
                    {zone.rangeText}
                  </span>
                </div>
              </div>

              {/* Connecting Dotted Line */}
              {idx < ZONE_CONFIGS.length - 1 && (
                <div className="flex items-center gap-1 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* RIGHT: Power-ups Status Guide */}
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200 shrink-0">
        <div>
          <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800 font-heading">
            POWER-UPS
          </h4>
          <p className="text-[9px] font-medium text-slate-400">Use them wisely!</p>
        </div>

        <div className="flex items-center gap-2">
          {/* 50/50 Jet Stream box */}
          <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center p-1 text-center shadow-sm">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-[8px] font-extrabold text-amber-900 leading-tight">
              50/50
            </span>
            <span className="text-[7px] font-bold text-amber-700 leading-tight">
              Jet Stream
            </span>
          </div>

          {/* Peek Map box */}
          <div className="w-14 h-14 rounded-xl bg-sky-50 border border-sky-200 flex flex-col items-center justify-center p-1 text-center shadow-sm">
            <Eye className="w-5 h-5 text-sky-600" />
            <span className="text-[8px] font-extrabold text-sky-900 leading-tight">
              Peek Map
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
