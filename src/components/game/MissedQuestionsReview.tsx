import React from 'react';
import { X, BookOpen, CheckCircle2, XCircle, Mountain, AlertCircle } from 'lucide-react';
import { TeamProgress } from '@/types/game';

interface MissedQuestionsReviewProps {
  blueTeam: TeamProgress;
  orangeTeam: TeamProgress;
  onClose: () => void;
}

export const MissedQuestionsReview: React.FC<MissedQuestionsReviewProps> = ({
  blueTeam,
  orangeTeam,
  onClose
}) => {
  // Aggregate all missed questions from both teams
  const blueMissed = blueTeam.answeredQuestionsHistory.filter((item) => !item.isCorrect);
  const orangeMissed = orangeTeam.answeredQuestionsHistory.filter((item) => !item.isCorrect);

  const totalMissedCount = blueMissed.length + orangeMissed.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-4xl clay-card rounded-4xl p-6 md:p-8 relative shadow-2xl border-4 border-white/95 my-auto max-h-[90vh] flex flex-col animate-fadeIn">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-heading text-slate-800">
                REVIEW CLASSROOM LEARNING
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Analyze student misconceptions and reinforce key landform concepts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT LIST */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {totalMissedCount === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">
                Incredible Work! No Missed Questions!
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Both teams answered every geography question correctly throughout the expedition.
              </p>
            </div>
          ) : (
            <>
              {/* Blue Team Missed Questions */}
              {blueMissed.length > 0 && (
                <div>
                  <h3 className="font-extrabold text-sm text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-500" />
                    TEAM NORTH STAR MISSED QUESTIONS ({blueMissed.length})
                  </h3>
                  <div className="space-y-3">
                    {blueMissed.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600 uppercase text-[10px]">
                            {item.question.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.question.question}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                            <span className="font-extrabold block text-[10px] text-rose-600 uppercase mb-0.5">
                              Team Answered:
                            </span>
                            {item.question.options[item.selectedOption]}
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <span className="font-extrabold block text-[10px] text-emerald-600 uppercase mb-0.5">
                              Correct Answer:
                            </span>
                            {item.question.options[item.question.correctAnswer]}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                          <span className="font-extrabold text-slate-700 block text-[10px] uppercase mb-0.5">
                            Geography Concept Explanation:
                          </span>
                          {item.question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orange Team Missed Questions */}
              {orangeMissed.length > 0 && (
                <div>
                  <h3 className="font-extrabold text-sm text-orange-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    TEAM EARTH EXPLORERS MISSED QUESTIONS ({orangeMissed.length})
                  </h3>
                  <div className="space-y-3">
                    {orangeMissed.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600 uppercase text-[10px]">
                            {item.question.category.replace('-', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.question.question}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                            <span className="font-extrabold block text-[10px] text-rose-600 uppercase mb-0.5">
                              Team Answered:
                            </span>
                            {item.question.options[item.selectedOption]}
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <span className="font-extrabold block text-[10px] text-emerald-600 uppercase mb-0.5">
                              Correct Answer:
                            </span>
                            {item.question.options[item.question.correctAnswer]}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                          <span className="font-extrabold text-slate-700 block text-[10px] uppercase mb-0.5">
                            Geography Concept Explanation:
                          </span>
                          {item.question.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="pt-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase text-white clay-button-blue shadow-md"
          >
            DONE REVIEWING
          </button>
        </div>
      </div>
    </div>
  );
};
