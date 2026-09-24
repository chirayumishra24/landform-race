import React, { useState } from 'react';
import {
  Compass,
  Play,
  HelpCircle,
  Settings,
  Mountain,
  MapPin,
  Trophy,
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface StartScreenProps {
  onStartGame: () => void;
  onOpenTeacher: () => void;
  onOpenExplorer: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenTeacher,
  onOpenExplorer
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-4xl clay-card rounded-4xl p-8 relative shadow-2xl border-4 border-white/95 my-auto animate-fadeIn">
        {/* TOP BRAND HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-800 text-xs font-black tracking-widest uppercase mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>CLASS 6 GEOGRAPHY EXPEDITION</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading text-slate-800 drop-shadow-sm flex items-center justify-center gap-3">
            <span className="text-sky-600">LANDFORM</span>
            <span className="text-orange-500">RACERS</span>
          </h1>

          <p className="text-slate-600 font-semibold text-base md:text-lg mt-1 tracking-wide">
            “Race Through the Landforms. Discover How Landscapes Shape Life.”
          </p>
        </div>

        {/* TEAM SHOWCASE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Team North Star */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white shadow-xl shadow-sky-600/25 border-2 border-sky-300 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-200">
                  TEAM 1
                </span>
                <h3 className="text-xl font-black font-heading leading-tight">
                  TEAM NORTH STAR
                </h3>
              </div>
            </div>
            <p className="text-xs font-medium text-sky-100 tracking-wide mb-3">
              Explore • Answer • Advance
            </p>
            <div className="bg-sky-900/30 rounded-xl p-2.5 border border-sky-400/40 text-[11px] font-semibold text-sky-50 flex items-center justify-between">
              <span>Expedition Vehicle:</span>
              <span className="font-extrabold text-white">Blue 4x4 Off-Roader</span>
            </div>
          </div>

          {/* Team Earth Explorers */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-xl shadow-orange-600/25 border-2 border-orange-300 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
                <Mountain className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">
                  TEAM 2
                </span>
                <h3 className="text-xl font-black font-heading leading-tight">
                  TEAM EARTH EXPLORERS
                </h3>
              </div>
            </div>
            <p className="text-xs font-medium text-orange-100 tracking-wide mb-3">
              Find • Analyse • Move Forward
            </p>
            <div className="bg-orange-950/30 rounded-xl p-2.5 border border-orange-400/40 text-[11px] font-semibold text-orange-50 flex items-center justify-between">
              <span>Expedition Vehicle:</span>
              <span className="font-extrabold text-white">Orange 4x4 Off-Roader</span>
            </div>
          </div>
        </div>

        {/* RACE SUMMARY HIGHLIGHTS */}
        <div className="bg-slate-100/90 rounded-2xl p-4 mb-8 border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">EXPEDITION</span>
            <span className="text-lg font-black text-slate-800 font-heading">15 CHECKPOINTS</span>
          </div>
          <div className="w-px h-8 bg-slate-300 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">MATCH TIME</span>
            <span className="text-lg font-black text-slate-800 font-heading">5 MINUTES</span>
          </div>
          <div className="w-px h-8 bg-slate-300 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">PARTICIPATION</span>
            <span className="text-lg font-black text-slate-800 font-heading">2 TEAMS SIMULTANEOUS</span>
          </div>
          <div className="w-px h-8 bg-slate-300 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">LANDFORMS</span>
            <span className="text-lg font-black text-emerald-600 font-heading">6 MAJOR ZONES</span>
          </div>
        </div>

        {/* HOW TO PLAY ACCORDION */}
        {showHowToPlay && (
          <div className="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-md animate-fadeIn">
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>HOW TO PLAY IN CLASSROOM</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                <span className="font-black text-sky-700 text-xs block mb-1">STEP 1: ANSWER</span>
                <p className="text-xs text-slate-600 font-medium">
                  Both teams receive independent geography questions simultaneously on their panels.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-black text-emerald-700 text-xs block mb-1">STEP 2: ADVANCE</span>
                <p className="text-xs text-slate-600 font-medium">
                  Each correct answer drives your team's vehicle forward by 1 checkpoint across the 3D terrain.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                <span className="font-black text-orange-700 text-xs block mb-1">STEP 3: WIN</span>
                <p className="text-xs text-slate-600 font-medium">
                  Travel from snowy mountains to the human settlement. First team to checkpoint 15 wins!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartGame}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg tracking-wider uppercase text-white clay-button-blue flex items-center justify-center gap-3 shadow-xl shadow-sky-500/35 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>START EXPEDITION</span>
          </button>

          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl font-extrabold text-sm tracking-wide text-slate-700 clay-button-light hover:bg-slate-100 flex items-center justify-center gap-2 border border-slate-200 transition-all active:scale-95"
          >
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <span>{showHowToPlay ? 'HIDE GUIDE' : 'HOW TO PLAY'}</span>
          </button>

          <button
            onClick={onOpenExplorer}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl font-extrabold text-sm tracking-wide text-slate-700 clay-button-light hover:bg-slate-100 flex items-center justify-center gap-2 border border-slate-200 transition-all active:scale-95"
          >
            <Mountain className="w-5 h-5 text-amber-600" />
            <span>EXPLORE GEOGRAPHY</span>
          </button>

          <button
            onClick={onOpenTeacher}
            className="w-full sm:w-auto px-5 py-4 rounded-2xl font-extrabold text-sm tracking-wide text-slate-700 clay-button-light hover:bg-slate-100 flex items-center justify-center gap-2 border border-slate-200 transition-all active:scale-95"
          >
            <Settings className="w-5 h-5 text-slate-600" />
            <span>TEACHER MODE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
