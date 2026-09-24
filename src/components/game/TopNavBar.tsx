import React from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Compass,
  Map,
  Box,
  Clock,
  ChevronDown
} from 'lucide-react';

interface TopNavBarProps {
  round: number;
  totalRounds: number;
  matchTimeSeconds: number;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  viewMode: '3d' | 'map';
  onToggleViewMode: () => void;
  onResetMatch: () => void;
  onOpenExplorer: () => void;
  onOpenTeacher: () => void;
  blueCheckpoint: number;
  orangeCheckpoint: number;
}

/* SVG Mountain Logo matching the reference */
const MountainLogo = () => (
  <svg viewBox="0 0 80 80" className="w-14 h-14 shrink-0" aria-label="Landform Racers Logo">
    {/* Snow-capped mountain */}
    <defs>
      <linearGradient id="mtnGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e0f2fe" />
      </linearGradient>
    </defs>
    {/* Globe circle */}
    <circle cx="40" cy="42" r="34" fill="url(#mtnGrad)" opacity="0.15" />
    {/* Back mountain */}
    <polygon points="18,65 38,22 58,65" fill="#94a3b8" />
    <polygon points="38,22 32,35 38,38 44,35" fill="url(#snowGrad)" />
    {/* Front mountain */}
    <polygon points="35,65 55,18 75,65" fill="#64748b" />
    <polygon points="55,18 48,33 55,37 62,33" fill="url(#snowGrad)" />
    {/* Small mountain */}
    <polygon points="5,65 20,38 35,65" fill="#cbd5e1" />
    <polygon points="20,38 16,46 20,48 24,46" fill="url(#snowGrad)" />
    {/* Ground */}
    <ellipse cx="40" cy="66" rx="38" ry="6" fill="#86efac" opacity="0.5" />
  </svg>
);

export const TopNavBar: React.FC<TopNavBarProps> = ({
  round,
  totalRounds,
  matchTimeSeconds,
  isAudioMuted,
  onToggleAudio,
  isFullscreen,
  onToggleFullscreen,
  viewMode,
  onToggleViewMode,
  onResetMatch,
  onOpenExplorer,
  onOpenTeacher,
  blueCheckpoint,
  orangeCheckpoint
}) => {
  // Format MM:SS
  const mins = Math.floor(matchTimeSeconds / 60);
  const secs = matchTimeSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isFinalMinute = matchTimeSeconds <= 60 && matchTimeSeconds > 0;

  return (
    <header className="w-full h-16 px-5 flex items-center justify-between clay-card rounded-2xl z-30 select-none">
      {/* LEFT: Branding — Logo + Title */}
      <div className="flex items-center gap-2 shrink-0">
        <MountainLogo />
        <div>
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="font-black text-2xl tracking-tight text-slate-800 font-heading">
              LANDFORM
            </span>
            <span className="font-black text-2xl tracking-tight text-orange-500 font-heading">
              RACERS
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
            Race Through the Landforms. Learn About Life.
          </p>
        </div>
      </div>

      {/* CENTER: Round Indicator (separate capsule) */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center bg-slate-50/80 px-5 py-1.5 rounded-full border border-slate-200/80 shadow-inner">
          <span className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">
            ROUND {Math.max(blueCheckpoint, orangeCheckpoint, 1)} / {totalRounds}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 9 }).map((_, i) => {
              const isBlueLead = blueCheckpoint > orangeCheckpoint && i < blueCheckpoint;
              const isOrangeLead = orangeCheckpoint > blueCheckpoint && i < orangeCheckpoint;
              const isFilled = i < Math.max(blueCheckpoint, orangeCheckpoint);

              return (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isFilled
                      ? isBlueLead
                        ? 'bg-sky-500 shadow-sm shadow-sky-400'
                        : isOrangeLead
                        ? 'bg-orange-500 shadow-sm shadow-orange-400'
                        : 'bg-purple-500'
                      : 'bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Timer (separate from round) */}
        <div className="flex items-center gap-2.5">
          <Clock className={`w-7 h-7 ${isFinalMinute ? 'text-red-500 animate-pulse' : 'text-sky-600'}`} />
          <div className="flex flex-col items-start">
            <span
              className={`text-3xl tracking-wider font-mono font-black leading-none ${
                isFinalMinute ? 'text-red-600 animate-pulse' : 'text-slate-800'
              }`}
            >
              {timeFormatted}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              {isFinalMinute ? 'FINAL MINUTE' : 'TIME REMAINING'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 3D / Map View Toggle */}
        <button
          onClick={onToggleViewMode}
          title={viewMode === '3d' ? 'Switch to Map View' : 'Switch to 3D View'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold clay-button-light hover:bg-slate-100 transition-all text-slate-700 border border-slate-200 shadow-sm active:scale-95"
        >
          {viewMode === '3d' ? (
            <>
              <Box className="w-4 h-4 text-sky-600" />
              <span>3D VIEW</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </>
          ) : (
            <>
              <Map className="w-4 h-4 text-emerald-600" />
              <span>MAP</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </>
          )}
        </button>

        {/* Map / Explorer Icon */}
        <button
          onClick={onOpenExplorer}
          title="Explore Landforms"
          className="w-10 h-10 rounded-xl flex items-center justify-center clay-button-light hover:bg-slate-100 transition-all text-slate-700 border border-slate-200 shadow-sm active:scale-95"
        >
          <Map className="w-5 h-5 text-sky-600" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleAudio}
          title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="w-10 h-10 rounded-xl flex items-center justify-center clay-button-light hover:bg-slate-100 transition-all text-slate-700 border border-slate-200 shadow-sm active:scale-95"
        >
          {isAudioMuted ? (
            <VolumeX className="w-5 h-5 text-slate-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-sky-600" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen"
          className="w-10 h-10 rounded-xl flex items-center justify-center clay-button-light hover:bg-slate-100 transition-all text-slate-700 border border-slate-200 shadow-sm active:scale-95"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-slate-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
