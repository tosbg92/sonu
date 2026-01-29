
import React, { useState, useEffect } from 'react';
import { QuizSet } from '../types';

interface QuizPlayerProps {
  quiz: QuizSet;
  onFinish: (score: number, total: number, answers: Record<string, number>) => void;
  onCancel: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 45); 
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [quiz.questions[currentIndex].id]: idx }));
  };

  const handleSubmit = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) score++;
    });
    onFinish(score, quiz.questions.length, selectedAnswers);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz.questions[currentIndex];

  const renderBilingual = (text: string, isOption: boolean = false) => {
    const parts = text.split(' / ');
    return (
      <div className="flex flex-col text-left">
        <span className={`${isOption ? 'text-base md:text-lg' : 'text-xl md:text-2xl lg:text-3xl'} font-bold text-white leading-snug`}>{parts[0]}</span>
        {parts[1] && (
          <span className={`${isOption ? 'text-sm md:text-base' : 'text-lg md:text-xl lg:text-2xl'} font-medium text-slate-400 mt-2`}>{parts[1]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up space-y-6 pb-20 px-4">
      <div className="flex justify-between items-center glass-panel p-5 md:p-6 rounded-2xl border-white/5">
        <div className="flex items-center space-x-4">
          <div className="bg-robot-primary/10 px-4 py-2 rounded-xl border border-robot-primary/20">
            <span className="text-[10px] font-black text-robot-primary uppercase tracking-widest">Progress</span>
            <div className="text-lg md:text-xl font-black text-white">{currentIndex + 1} / {quiz.questions.length}</div>
          </div>
          <div className="bg-robot-secondary/10 px-4 py-2 rounded-xl border border-robot-secondary/20">
             <span className="text-[10px] font-black text-robot-secondary uppercase tracking-widest">Time</span>
             <div className={`text-lg md:text-xl font-black tabular-nums ${timeLeft < 30 ? 'text-robot-error animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onCancel}
          type="button"
          className="flex items-center space-x-2 md:space-x-3 px-5 md:px-7 py-3 bg-red-500/15 rounded-xl hover:bg-red-500/25 text-red-400 transition-all active:scale-90 border border-red-500/30 shadow-lg shadow-red-500/10 cursor-pointer z-[60]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          <span className="text-[12px] font-black uppercase tracking-[0.2em]">Exit</span>
        </button>
      </div>

      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-robot-primary shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-500 ease-out" 
          style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-robot-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
        <div className="relative z-10 space-y-8 md:space-y-10">
          <div className="min-h-[100px] md:min-h-[120px]">{renderBilingual(currentQuestion.text)}</div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`group relative text-left p-5 md:p-6 rounded-2xl border transition-all ${
                    isSelected
                    ? 'bg-robot-primary/10 border-robot-primary shadow-[0_0_15px_rgba(0,243,255,0.15)] ring-1 ring-robot-primary/20'
                    : 'bg-black/20 border-white/5 hover:border-robot-secondary/40'
                  }`}
                >
                  <div className="flex items-center space-x-5 md:space-x-6">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl transition-all flex-shrink-0 ${
                      isSelected ? 'bg-robot-primary text-robot-dark shadow-lg' : 'bg-white/5 text-slate-500 group-hover:text-white'
                    }`}>{String.fromCharCode(65 + idx)}</div>
                    <div className="flex-1">{renderBilingual(option, true)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] disabled:opacity-0 transition-all hover:bg-white/10"
        >
          Previous
        </button>
        
        <button
          onClick={() => currentIndex < quiz.questions.length - 1 ? setCurrentIndex(prev => prev + 1) : handleSubmit()}
          disabled={selectedAnswers[currentQuestion.id] === undefined}
          className={`flex-[2] py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all ${
            selectedAnswers[currentQuestion.id] === undefined
            ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'
            : 'bg-gradient-to-r from-robot-primary to-robot-secondary text-white hover:brightness-110 shadow-lg shadow-robot-primary/20'
          }`}
        >
          {currentIndex === quiz.questions.length - 1 ? 'End Mission' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
