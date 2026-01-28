
import React from 'react';
import { QuizSet } from '../types';

interface ResultDashboardProps {
  result: {
    score: number;
    total: number;
    answers: Record<string, number>;
    quiz: QuizSet;
  };
  onHome: () => void;
  onRetry: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result, onHome, onRetry }) => {
  const percentage = Math.round((result.score / result.total) * 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const renderBilingual = (text: string, isOption: boolean = false) => {
    const parts = text.split(' / ');
    return (
      <div className="flex flex-col text-left">
        <span className={`${isOption ? 'text-lg' : 'text-xl md:text-2xl'} font-bold text-white`}>{parts[0]}</span>
        {parts[1] && (
          <span className={`${isOption ? 'text-sm' : 'text-base md:text-lg'} font-medium text-slate-400 mt-1`}>{parts[1]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-24 px-4">
      <div className="bg-robot-card p-12 rounded-[3rem] border border-robot-secondary/30 relative overflow-hidden text-center flex flex-col items-center shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-robot-primary to-robot-secondary"></div>
        
        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-10">Evaluation Summary</h2>
        
        <div className="relative mb-10 scale-125">
          <svg className="w-48 h-48 -rotate-90">
            <circle cx="96" cy="96" r={radius} fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
            <circle cx="96" cy="96" r={radius} fill="transparent" stroke="currentColor" strokeWidth="12" 
              className="text-robot-primary transition-all duration-1000"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white neon-text">{percentage}%</span>
            <span className="text-xs font-bold text-robot-primary uppercase tracking-widest mt-1">Accuracy</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-md mb-12">
          <div className="bg-robot-dark/50 p-8 rounded-3xl border border-white/5 shadow-inner">
            <div className="text-slate-500 text-xs font-bold uppercase mb-1">Correct</div>
            <div className="text-4xl font-black text-green-400">{result.score}</div>
          </div>
          <div className="bg-robot-dark/50 p-8 rounded-3xl border border-white/5 shadow-inner">
            <div className="text-slate-500 text-xs font-bold uppercase mb-1">Incorrect</div>
            <div className="text-4xl font-black text-red-400">{result.total - result.score}</div>
          </div>
        </div>

        <div className="flex space-x-6">
          <button onClick={onRetry} className="px-10 py-5 bg-robot-primary text-robot-dark font-black rounded-2xl uppercase tracking-widest text-lg hover:scale-105 transition-all shadow-xl shadow-robot-primary/20">Re-Attempt</button>
          <button onClick={onHome} className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-widest text-lg hover:bg-white/10 transition-all border border-white/10">Main Menu</button>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight border-l-8 border-robot-primary pl-6 py-2">Question Audit</h3>
        <div className="grid grid-cols-1 gap-6">
          {result.quiz.questions.map((q, index) => {
            const userChoice = result.answers[q.id];
            const isCorrect = userChoice === q.correctAnswerIndex;
            return (
              <div key={q.id} className={`bg-robot-card rounded-[2.5rem] border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'} p-10 transition-all shadow-xl`}>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Question {index + 1}</span>
                  {isCorrect ? (
                    <span className="bg-green-500/10 text-green-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest flex items-center shadow-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Correct
                    </span>
                  ) : (
                    <span className="bg-red-500/10 text-red-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest flex items-center shadow-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg> Wrong
                    </span>
                  )}
                </div>
                <div className="mb-8">{renderBilingual(q.text)}</div>
                <div className="grid grid-cols-1 gap-4">
                  {q.options.map((option, optIdx) => {
                    const isUserSelected = userChoice === optIdx;
                    const isCorrectAnswer = q.correctAnswerIndex === optIdx;
                    let style = "bg-robot-dark/40 border-white/5 opacity-40";
                    if (isCorrectAnswer) style = "bg-green-500/10 border-green-500/50 text-white opacity-100 ring-2 ring-green-500/20 shadow-lg shadow-green-500/10";
                    else if (isUserSelected && !isCorrect) style = "bg-red-500/10 border-red-500/50 text-white opacity-100 ring-2 ring-red-500/20";

                    return (
                      <div key={optIdx} className={`p-6 rounded-2xl border flex items-center space-x-6 transition-all ${style}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${isCorrectAnswer ? 'bg-green-500 text-robot-dark' : isUserSelected ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-600'}`}>{String.fromCharCode(65 + optIdx)}</div>
                        <div className="flex-1">{renderBilingual(option, true)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;