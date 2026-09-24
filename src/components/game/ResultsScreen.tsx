import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Flame,
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { TeamProgress } from '@/types/game';

interface ResultsScreenProps {
  winner: 'blue' | 'orange' | 'tie' | null;
  blueTeam: TeamProgress;
  orangeTeam: TeamProgress;
  onPlayAgain: () => void;
  onOpenReview: () => void;
  onOpenExplorer: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  winner,
  blueTeam,
  orangeTeam,
  onPlayAgain,
  onOpenReview,
  onOpenExplorer
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: winner === 'blue' ? ['#0284c7', '#38bdf8', '#ffffff'] : ['#f97316', '#fb923c', '#ffffff']
      });
    } catch {
      // safe fallback
    }
  }, [winner]);

  const blueAccuracy =
    blueTeam.totalAnswers > 0
      ? Math.round((blueTeam.correctAnswers / blueTeam.totalAnswers) * 100)
      : 0;

  const orangeAccuracy =
    orangeTeam.totalAnswers > 0
      ? Math.round((orangeTeam.correctAnswers / orangeTeam.totalAnswers) * 100)
      : 0;

  const isBlueWinner = winner === 'blue';
  const isOrangeWinner = winner === 'orange';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-4xl clay-card rounded-4xl p-8 relative shadow-2xl border-4 border-white/95 my-auto animate-fadeIn">
        {/* BANNER HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black tracking-widest uppercase mb-2 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>EXPEDITION COMPLETE</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-800">
            {winner === 'tie' ? (
              <span className="text-purple-600">IT&apos;S AN EXPEDITION TIE!</span>
            ) : isBlueWinner ? (
              <span className="text-sky-600">TEAM NORTH STAR WINS!</span>
            ) : (
              <span className="text-orange-500">TEAM EARTH EXPLORERS WINS!</span>
            )}
          </h2>

          <p className="text-slate-600 font-semibold text-sm mt-1">
            {winner === 'tie'
              ? 'Both teams demonstrated equal mastery across Earth’s diverse terrain!'
              : isBlueWinner
              ? 'Team North Star conquered mountains, valleys, plateaus, and plains first!'
              : 'Team Earth Explorers conquered mountains, valleys, plateaus, and plains first!'}
          </p>
        </div>

        {/* SIDE-BY-SIDE STATS COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Team North Star Stats */}
          <div
            className={`rounded-3xl p-5 border-2 transition-all ${
              isBlueWinner
                ? 'bg-gradient-to-br from-sky-50 to-sky-100/60 border-sky-400 ring-2 ring-sky-300/50 shadow-lg'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-200/60 mb-3">
              <div>
                <h3 className="font-black text-lg text-sky-700 font-heading">
                  TEAM NORTH STAR
                </h3>
                <span className="text-xs font-bold text-sky-600/80">BLUE EXPEDITION</span>
              </div>
              {isBlueWinner && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-extrabold shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>CHAMPIONS</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Final Checkpoint:</span>
                <span className="font-black text-slate-800">{blueTeam.checkpoint} / 15</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Correct Answers:</span>
                <span className="font-black text-slate-800">
                  {blueTeam.correctAnswers} / {blueTeam.totalAnswers}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Accuracy:</span>
                <span className="font-black text-slate-800">{blueAccuracy}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Max Streak:</span>
                <span className="font-black text-amber-600">{blueTeam.maxStreak} in a row</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-500">Total Score:</span>
                <span className="font-black text-sky-700 text-sm">{blueTeam.score} pts</span>
              </div>
            </div>
          </div>

          {/* Team Earth Explorers Stats */}
          <div
            className={`rounded-3xl p-5 border-2 transition-all ${
              isOrangeWinner
                ? 'bg-gradient-to-br from-orange-50 to-orange-100/60 border-orange-400 ring-2 ring-orange-300/50 shadow-lg'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-orange-200/60 mb-3">
              <div>
                <h3 className="font-black text-lg text-orange-700 font-heading">
                  TEAM EARTH EXPLORERS
                </h3>
                <span className="text-xs font-bold text-orange-600/80">ORANGE EXPEDITION</span>
              </div>
              {isOrangeWinner && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-extrabold shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>CHAMPIONS</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Final Checkpoint:</span>
                <span className="font-black text-slate-800">{orangeTeam.checkpoint} / 15</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Correct Answers:</span>
                <span className="font-black text-slate-800">
                  {orangeTeam.correctAnswers} / {orangeTeam.totalAnswers}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Accuracy:</span>
                <span className="font-black text-slate-800">{orangeAccuracy}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Max Streak:</span>
                <span className="font-black text-amber-600">{orangeTeam.maxStreak} in a row</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-500">Total Score:</span>
                <span className="font-black text-orange-700 text-sm">{orangeTeam.score} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3.5 rounded-2xl font-black text-sm tracking-wider uppercase text-white clay-button-blue flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onOpenReview}
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm tracking-wide text-slate-700 clay-button-light hover:bg-slate-100 flex items-center gap-2 border border-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>REVIEW LEARNING</span>
          </button>

          <button
            onClick={onOpenExplorer}
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm tracking-wide text-slate-700 clay-button-light hover:bg-slate-100 flex items-center gap-2 border border-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>EXPLORE THE LANDSCAPE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
