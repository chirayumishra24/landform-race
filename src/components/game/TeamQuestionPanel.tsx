import React from 'react';
import {
  Compass,
  Zap,
  Eye,
  CheckCircle2,
  XCircle,
  Flame,
  Mountain,
  Wind,
  Sparkles
} from 'lucide-react';
import { Question, TeamProgress } from '@/types/game';

interface TeamQuestionPanelProps {
  team: TeamProgress;
  question: Question | null;
  onSelectOption: (optionIndex: number) => void;
  onSubmitAnswer: () => void;
  onUseFiftyFifty: () => void;
  onUseLandscapeHint: () => void;
  disabled: boolean;
}

/* Zone emoji helper */
const zoneEmoji: Record<string, string> = {
  mountains: '🏔️',
  valley: '🏞️',
  plateau: '🏜️',
  plains: '🌾',
  river: '🌊',
  settlement: '🏘️',
};

export const TeamQuestionPanel: React.FC<TeamQuestionPanelProps> = ({
  team,
  question,
  onSelectOption,
  onSubmitAnswer,
  onUseFiftyFifty,
  onUseLandscapeHint,
  disabled
}) => {
  const isBlue = team.color === 'blue';
  const optionLetters = ['A', 'B', 'C', 'D'];

  const progressPercent = Math.min(100, Math.round((team.checkpoint / 15) * 100));

  if (!question) {
    return (
      <div className="w-full h-full clay-card rounded-3xl p-6 flex flex-col items-center justify-center text-center">
        <Sparkles className="w-12 h-12 text-slate-300 mb-3 animate-spin" style={{ animationDuration: '3s' }} />
        <h3 className="font-bold text-slate-600 text-lg">Loading Next Challenge...</h3>
      </div>
    );
  }

  const categoryLabel = question.category.replace('-', ' ').toUpperCase();
  const emoji = zoneEmoji[question.category] || '🗻';

  return (
    <div className="w-full h-full clay-card rounded-3xl p-4 flex flex-col shadow-clay-card border border-white/90 relative overflow-hidden select-none">
      {/* ─── TOP HEADER BANNER (Team Identity) ─── */}
      <div
        className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between text-white shadow-md mb-3 shrink-0 ${
          isBlue
            ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 shadow-sky-500/30'
            : 'bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 shadow-orange-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner shrink-0">
            <Compass className="w-5 h-5 text-white" style={{ animation: 'spin 8s linear infinite' }} />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-base tracking-wide uppercase font-heading leading-tight truncate">
              {team.teamName}
            </h2>
            <p className="text-[10px] font-medium text-white/85 tracking-wide truncate">
              {team.tagline}
            </p>
          </div>
        </div>

        {/* Lap Badge + Progress Bar */}
        <div className="flex flex-col items-end shrink-0 ml-2">
          <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md border border-white/40 shadow-sm whitespace-nowrap">
            {team.checkpoint} / 15 LAPS
          </span>
          <div className="w-24 h-2 bg-black/20 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── CATEGORY + REWARD PILL ─── */}
      <div className="flex items-center justify-between mb-2 px-1 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 shadow-sm text-xs font-bold text-slate-700 uppercase tracking-wide">
          <span className="text-sm">{emoji}</span>
          <span>{categoryLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Boost / Nitro Rush */}
          {team.streak >= 3 ? (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white border border-amber-300 text-[10px] font-black shadow-md animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>NITRO RUSH {team.streak}X</span>
            </div>
          ) : team.streak === 2 ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold shadow-sm animate-pulse">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>2X SPEED</span>
            </div>
          ) : null}
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black tracking-wide shadow-sm">
            <Wind className="w-3 h-3" />
            +¼ LAP / 90°
          </span>
        </div>
      </div>

      {/* ─── QUESTION TEXT ─── */}
      <div className="px-1 mb-2.5 flex-shrink-0">
        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
          {question.question}
        </h3>
      </div>

      {/* ─── 4 OPTIONS (A–D) ─── */}
      <div className="space-y-2 mb-2.5 flex-1 min-h-0 max-h-[36vh] overflow-y-auto pr-1">
        {question.options.map((optText, idx) => {
          const isSelected = team.selectedOption === idx;
          const isEliminated = team.eliminatedOptions.includes(idx);
          const hasSubmitted = team.hasSubmitted;
          const isCorrect = team.isCorrect;
          const isActualCorrect = question.correctAnswer === idx;

          let btnBg = 'bg-white hover:bg-slate-50';
          let btnBorder = 'border-slate-200 hover:border-slate-300';
          let btnText = 'text-slate-700';
          let badgeBg = 'bg-slate-100 text-slate-600';
          let extraClasses = '';

          if (isEliminated) {
            btnBg = 'bg-slate-50';
            btnBorder = 'border-slate-200';
            btnText = 'text-slate-300 line-through';
            badgeBg = 'bg-slate-100 text-slate-300';
            extraClasses = 'opacity-40 cursor-not-allowed';
          } else if (hasSubmitted) {
            if (isActualCorrect) {
              btnBg = 'bg-emerald-500';
              btnBorder = 'border-emerald-500';
              btnText = 'text-white';
              badgeBg = 'bg-white/25 text-white';
              extraClasses = 'shadow-md shadow-emerald-500/30 scale-[1.01]';
            } else if (isSelected && !isCorrect) {
              btnBg = 'bg-rose-500';
              btnBorder = 'border-rose-500';
              btnText = 'text-white';
              badgeBg = 'bg-white/25 text-white';
              extraClasses = 'shadow-md shadow-rose-500/30';
            } else {
              btnBg = 'bg-slate-50';
              btnBorder = 'border-slate-200';
              btnText = 'text-slate-400';
              extraClasses = 'opacity-50';
            }
          } else if (isSelected) {
            // Solid team-color fill (NOT gradient) per reference
            btnBg = isBlue ? 'bg-sky-500' : 'bg-orange-500';
            btnBorder = isBlue ? 'border-sky-500' : 'border-orange-500';
            btnText = 'text-white';
            badgeBg = 'bg-white/30 text-white';
            extraClasses = isBlue
              ? 'shadow-lg shadow-sky-500/40 ring-2 ring-sky-300 scale-[1.01]'
              : 'shadow-lg shadow-orange-500/40 ring-2 ring-orange-300 scale-[1.01]';
          }

          return (
            <button
              key={idx}
              disabled={disabled || hasSubmitted || isEliminated}
              onClick={() => onSelectOption(idx)}
              className={`w-full min-h-[48px] py-2.5 px-3.5 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 active:scale-[0.99] ${btnBg} ${btnBorder} ${btnText} ${extraClasses}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${badgeBg}`}
              >
                {hasSubmitted && isActualCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : hasSubmitted && isSelected && !isCorrect ? (
                  <XCircle className="w-4 h-4 text-white" />
                ) : (
                  optionLetters[idx]
                )}
              </div>
              <span className="text-sm font-semibold flex-1 leading-snug">
                {optText}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── FEEDBACK (after submit) ─── */}
      {team.hasSubmitted && (
        <div
          className={`p-3 rounded-xl mb-2 text-xs border shadow-sm shrink-0 ${
            team.isCorrect
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            {team.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>CORRECT! +1 CHECKPOINT</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>NOT QUITE!</span>
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-95">{question.explanation}</p>
        </div>
      )}

      {/* ─── POWER-UPS ROW (inline pills) ─── */}
      <div className="flex items-center gap-2 mb-2 shrink-0">
        {/* 50/50 Jet Stream */}
        <button
          disabled={disabled || team.hasSubmitted || team.fiftyFiftyRemaining <= 0}
          onClick={onUseFiftyFifty}
          className={`flex-1 min-h-[42px] px-3 py-2 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
            team.fiftyFiftyRemaining > 0 && !team.hasSubmitted
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 active:scale-95'
              : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>50/50 JET STREAM</span>
          <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80 text-[10px] font-black">
            {team.fiftyFiftyRemaining}X
          </span>
        </button>

        {/* Peek Map */}
        <button
          disabled={disabled || team.hasSubmitted || team.landscapeHintsRemaining <= 0}
          onClick={onUseLandscapeHint}
          className={`flex-1 min-h-[42px] px-3 py-2 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
            team.landscapeHintsRemaining > 0 && !team.hasSubmitted
              ? 'bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300 active:scale-95'
              : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          <span>PEEK MAP</span>
          <span className="px-1.5 py-0.5 rounded-md bg-sky-200/80 text-[10px] font-black">
            {team.landscapeHintsRemaining} LEFT
          </span>
        </button>
      </div>

      {/* ─── SUBMIT BUTTON ─── */}
      <button
        disabled={disabled || team.selectedOption === null || team.hasSubmitted}
        onClick={onSubmitAnswer}
        className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase text-white shadow-lg transition-all duration-200 active:scale-[0.98] shrink-0 ${
          team.selectedOption === null || team.hasSubmitted
            ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-70'
            : isBlue
            ? 'clay-button-blue hover:brightness-110 shadow-sky-500/40'
            : 'clay-button-orange hover:brightness-110 shadow-orange-500/40'
        }`}
      >
        {team.hasSubmitted ? 'ADVANCING...' : 'SUBMIT ANSWER'}
      </button>
    </div>
  );
};
