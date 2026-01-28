
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
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 30);
  
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
        <span className={`${isOption ? 'text-xl' : 'text-3xl md:text-4xl'} font-bold text-white leading-tight`}>{parts[0]}</span>
        {parts[1] && (
          <span className={`${isOption ? 'text-lg' : 'text-xl md:text-2xl'} font-medium text-slate-400 mt-2`}>{parts[1]}</span>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-20 px-4">
      <div className="flex justify-between items-center bg-robot-card p-8 rounded-[2rem] border border-robot-secondary/30 shadow-2xl">
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question Status</div>
          <div className="text-2xl font-black text-robot-primary">{currentIndex + 1} / {quiz.questions.length}</div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Remaining</div>
            <div className={`text-3xl font-black tabular-nums ${timeLeft < 20 ? 'text-robot-accent animate-pulse' : 'text-robot-primary'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <button onClick={onCancel} className="p-3 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-robot-primary transition-all duration-500" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}></div>
      </div>

      <div className="bg-robot-card p-10 md:p-16 rounded-[3rem] border border-robot-secondary/30 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-12">
          <div className="mb-8">{renderBilingual(currentQuestion.text)}</div>

          <div className="grid grid-cols-1 gap-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`group relative text-left p-8 rounded-3xl border transition-all ${
                    isSelected
                    ? 'bg-robot-primary/10 border-robot-primary shadow-xl ring-2 ring-robot-primary/20'
                    : 'bg-robot-dark/50 border-white/5 hover:border-robot-secondary/50'
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${
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

      <div className="flex justify-between items-center px-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-10 py-5 bg-white/5 text-slate-400 rounded-2xl font-bold text-lg uppercase tracking-widest disabled:opacity-0 transition-all hover:bg-white/10"
        >
          Previous
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={() => {
               if (currentIndex < quiz.questions.length - 1) setCurrentIndex(prev => prev + 1);
               else handleSubmit();
            }}
            className="px-10 py-5 bg-white/5 text-slate-500 rounded-2xl font-bold text-lg uppercase tracking-widest hover:text-white transition-all"
          >
            Skip
          </button>
          
          <button
            onClick={() => currentIndex < quiz.questions.length - 1 ? setCurrentIndex(prev => prev + 1) : handleSubmit()}
            disabled={selectedAnswers[currentQuestion.id] === undefined}
            className={`px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl ${
              selectedAnswers[currentQuestion.id] === undefined
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-robot-primary to-robot-secondary text-white hover:scale-105 shadow-robot-primary/40'
            }`}
          >
            {currentIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;