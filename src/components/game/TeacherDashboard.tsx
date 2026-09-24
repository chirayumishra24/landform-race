import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Power,
  Search,
  Filter,
  Layers,
  Settings,
  BookOpen
} from 'lucide-react';
import { Question, LandformCategory } from '@/types/game';

interface TeacherDashboardProps {
  questions: Question[];
  onAddQuestion: (q: Omit<Question, 'id'>) => void;
  onUpdateQuestion: (id: string, q: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onToggleQuestionEnabled: (id: string) => void;
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onToggleQuestionEnabled,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [category, setCategory] = useState<LandformCategory>('mountains');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [explanation, setExplanation] = useState('');

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newOptionA || !newOptionB || !explanation) return;

    onAddQuestion({
      question: newQuestionText,
      options: [newOptionA, newOptionB, newOptionC || 'Option C', newOptionD || 'Option D'],
      correctAnswer,
      category,
      difficulty,
      explanation,
      enabled: true,
      visualType: 'terrain',
      terrainFocus: category === 'land-life' || category === 'human-activities' ? 'mountains' : (category as unknown as Question['terrainFocus'])
    });

    // Reset form
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setExplanation('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-5xl clay-card rounded-4xl p-6 md:p-8 relative shadow-2xl border-4 border-white/95 my-auto max-h-[92vh] flex flex-col animate-fadeIn">
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-inner">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black font-heading text-slate-800">
                TEACHER DASHBOARD
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Manage Landforms & Life Question Bank, Curate Difficulties & View Distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase text-white clay-button-blue flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAdding ? 'CANCEL' : 'ADD QUESTION'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ADD QUESTION DRAWER / FORM */}
        {isAdding && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-5 rounded-2xl bg-white border border-sky-200 shadow-md mb-4 shrink-0 space-y-3 animate-fadeIn text-xs"
          >
            <h3 className="font-extrabold text-sm text-sky-800 uppercase tracking-wider">
              NEW GEOGRAPHY QUESTION
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Question Prompt</label>
              <input
                type="text"
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="e.g. Why are mountains colder than surrounding plains?"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={newOptionA}
                  onChange={(e) => setNewOptionA(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={newOptionB}
                  onChange={(e) => setNewOptionB(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option C</label>
                <input
                  type="text"
                  value={newOptionC}
                  onChange={(e) => setNewOptionC(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Option D</label>
                <input
                  type="text"
                  value={newOptionD}
                  onChange={(e) => setNewOptionD(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Correct Answer</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Landform Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LandformCategory)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                >
                  <option value="mountains">Mountains</option>
                  <option value="valleys">Valleys</option>
                  <option value="plateaus">Plateaus</option>
                  <option value="plains">Plains</option>
                  <option value="rivers">Rivers</option>
                  <option value="land-life">Land & Life Connection</option>
                  <option value="human-activities">Human Activities</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Explanation (Learning Feedback)</label>
              <input
                type="text"
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="e.g. As elevation increases, the atmosphere becomes thinner and temperatures drop."
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 text-white font-extrabold uppercase shadow"
              >
                Save Question
              </button>
            </div>
          </form>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search geography questions or concepts..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Landforms ({questions.length})</option>
              <option value="mountains">Mountains</option>
              <option value="valleys">Valleys</option>
              <option value="plateaus">Plateaus</option>
              <option value="plains">Plains</option>
              <option value="rivers">Rivers</option>
              <option value="land-life">Land & Life</option>
              <option value="human-activities">Human Activities</option>
            </select>
          </div>
        </div>

        {/* QUESTIONS LIST TABLE */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {filteredQuestions.map((q) => {
            const isEnabled = q.enabled !== false;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl bg-white border transition-all text-xs flex items-start justify-between gap-4 shadow-sm ${
                  isEnabled ? 'border-slate-200' : 'border-slate-200 opacity-50 bg-slate-50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-extrabold uppercase text-[10px]">
                      {q.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                        q.difficulty === 'easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.difficulty === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    {!isEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold text-[10px]">
                        Disabled
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-sm">{q.question}</h4>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 pt-1">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`p-1.5 rounded-lg border ${
                          i === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic pt-1">
                    Explanation: {q.explanation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggleQuestionEnabled(q.id)}
                    title={isEnabled ? 'Disable Question' : 'Enable Question'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteQuestion(q.id)}
                    title="Delete Question"
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
