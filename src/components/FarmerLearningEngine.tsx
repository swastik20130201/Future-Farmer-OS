import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Award,
  ChevronRight,
  Calculator,
  Play,
  RotateCcw,
  Sparkles,
  Sprout,
  Flame,
  Wheat,
} from 'lucide-react';
import { LearningCourse, LessonModule } from '../types';

interface FarmerLearningEngineProps {
  courses: LearningCourse[];
}

export const FarmerLearningEngine: React.FC<FarmerLearningEngineProps> = ({
  courses,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<LearningCourse>(
    courses[0]
  );
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});

  // Interactive Profit Calculator State for Mushroom Lesson
  const [bagCount, setBagCount] = useState<number>(100);
  const [salePricePerKg, setSalePricePerKg] = useState<number>(180);

  // Quiz State
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<
    Record<string, number>
  >({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [earnedBadge, setEarnedBadge] = useState<boolean>(false);

  const activeModule: LessonModule =
    selectedCourse.modules[activeModuleIndex] || selectedCourse.modules[0];

  const handleMarkModuleComplete = (modId: string) => {
    setCompletedModules((prev) => ({ ...prev, [modId]: true }));
    if (activeModuleIndex < selectedCourse.modules.length - 1) {
      setActiveModuleIndex((prev) => prev + 1);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuizSubmitted(true);

    // Check if all correct
    let allCorrect = true;
    selectedCourse.quiz.forEach((q) => {
      if (selectedQuizAnswers[q.id] !== q.correctOptionIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setEarnedBadge(true);
    }
  };

  // Calculations for interactive widget inside lesson
  const estMushroomYieldKg = bagCount * 1.8; // 1.8kg per bag across 3 flushes
  const estTotalIncome = estMushroomYieldKg * salePricePerKg;
  const estInputCost = bagCount * 35; // ₹35 per bag straw + spawn
  const estNetProfit = estTotalIncome - estInputCost;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              Core Feature 4 — Personalized Farmer Pathways
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Actionable Farmer Learning Engine
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Step-by-step practical micro-lessons created dynamically when a farmer chooses a high-margin crop. Includes interactive profit calculators, step guides, and verified mastery badges.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Available Courses List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Pathways for {selectedCourse.cropOrTopic}
          </h3>

          {courses.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setActiveModuleIndex(0);
                  setQuizSubmitted(false);
                  setEarnedBadge(false);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800 font-mono">
                    {course.level} • {course.estimatedHours} Hours
                  </span>
                  {completedModules[course.modules[0]?.id] && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Started
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-300 font-medium">
                  <span>{course.modules.length} Micro-Lessons</span>
                  <span className="flex items-center gap-1">
                    Start Course <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Course Reader & Interactive Widget */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            {/* Module Tabs Header */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4 border-b border-slate-800">
              {selectedCourse.modules.map((mod, i) => {
                const isActive = activeModuleIndex === i;
                const isComp = completedModules[mod.id];
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleIndex(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : isComp
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isComp ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="font-mono">{i + 1}.</span>
                    )}
                    {mod.title.split(':')[0]}
                  </button>
                );
              })}
            </div>

            {/* Active Module Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {activeModule.title}
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 prose prose-invert text-xs max-w-none space-y-2 text-slate-300 leading-relaxed">
                {activeModule.contentMarkdown
                  .split('\n')
                  .map((paragraph, idx) => {
                    if (paragraph.startsWith('###')) {
                      return (
                        <h4 key={idx} className="text-sm font-bold text-emerald-300 mt-2 mb-1">
                          {paragraph.replace('###', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <li key={idx} className="ml-4 list-disc text-slate-300">
                          {paragraph.replace('-', '')}
                        </li>
                      );
                    }
                    return <p key={idx}>{paragraph}</p>;
                  })}
              </div>

              {/* Embedded Interactive Widget for Lesson 2 (Profit Calculator) */}
              {activeModule.interactiveWidgetType === 'profit_calc' && (
                <div className="bg-slate-950 border border-emerald-800/60 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    Interactive In-Lesson Yield & Profit Calculator
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Number of Straw Bags (200 sq ft shed)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="500"
                        step="10"
                        value={bagCount}
                        onChange={(e) => setBagCount(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono font-bold text-emerald-400">
                        {bagCount} Spawn Bags
                      </span>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">
                        Local Direct Market Sale Price (₹ / kg)
                      </label>
                      <input
                        type="number"
                        value={salePricePerKg}
                        onChange={(e) => setSalePricePerKg(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 font-mono text-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Yield</span>
                      <span className="text-xs font-bold text-slate-200">{estMushroomYieldKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Input Cost</span>
                      <span className="text-xs font-bold text-slate-300">₹{estInputCost}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Net Profit</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        ₹{estNetProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Takeaways Box */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-emerald-300 uppercase text-[10px] tracking-wider block">
                  Lesson Key Takeaways
                </span>
                {activeModule.keyTakeaways.map((kt, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{kt}</span>
                  </div>
                ))}
              </div>

              {/* Module Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleMarkModuleComplete(activeModule.id)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Complete & Next Lesson
                </button>
              </div>
            </div>
          </div>

          {/* Quiz & Mastery Badge Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Mastery Assessment & Certificate — {selectedCourse.badgeName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pass the knowledge check below to earn your digital agricultural badge for {selectedCourse.cropOrTopic}.
            </p>

            {earnedBadge ? (
              <div className="p-5 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border border-emerald-500/80 rounded-2xl text-center space-y-3 animate-fadeIn shadow-2xl">
                <div className="w-16 h-16 mx-auto bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    Congratulations! Badge Earned 🎉
                  </h4>
                  <div className="text-sm font-semibold text-emerald-300 mt-0.5">
                    {selectedCourse.badgeName}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Verified mastery in {selectedCourse.title}. This credential is added to your Digital Twin Farm profile!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuizSubmit} className="space-y-4 text-xs">
                {selectedCourse.quiz.map((q, qIdx) => (
                  <div key={q.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <div className="font-bold text-slate-200">
                      Q{qIdx + 1}: {q.question}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                            selectedQuizAnswers[q.id] === optIdx
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={selectedQuizAnswers[q.id] === optIdx}
                            onChange={() =>
                              setSelectedQuizAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className="accent-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div
                        className={`p-2 rounded text-[11px] font-semibold mt-2 ${
                          selectedQuizAnswers[q.id] === q.correctOptionIndex
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {selectedQuizAnswers[q.id] === q.correctOptionIndex
                          ? '✅ Correct! ' + q.explanation
                          : '❌ Incorrect. ' + q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" /> Submit Answers & Claim Badge
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
