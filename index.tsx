
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import QuizPlayer from './components/QuizPlayer';
import ResultDashboard from './components/ResultDashboard';
import { QuizSet, AppView, Question, Subject, Module, Block } from './types';
import { EMPLOYABILITY_SKILLS_DATA } from './mcqData';
import { IRDMT_FULL_DATA } from './irdmtData';

// @ts-ignore
window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const App = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [activeQuizSet, setActiveQuizSet] = useState<QuizSet | null>(null);
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    if (view === AppView.SPLASH) {
      const timer = setTimeout(() => setView(AppView.SUBJECT_SELECT), 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  useEffect(() => {
    // Version bumped to v20 for LO9 update
    const saved = localStorage.getItem('robotic_quiz_v20_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setSubjects(parsed);
        return;
      }
    }

    const irdmtBlocks: Block[] = IRDMT_FULL_DATA.map((loData, i) => {
      const q1 = loData.questions.slice(0, 25);
      const q2 = loData.questions.slice(25, 50);
      
      return {
        id: `irdmt-b-${i+1}`,
        title: loData.title,
        sets: [
          {
            id: `irdmt-s-${i+1}-1`,
            title: "Practice Set 1",
            description: `Core concepts for ${loData.title}`,
            questions: q1,
            createdAt: Date.now()
          },
          ...(q2.length > 0 ? [{
            id: `irdmt-s-${i+1}-2`,
            title: "Practice Set 2",
            description: `Advanced applications for ${loData.title}`,
            questions: q2,
            createdAt: Date.now()
          }] : [])
        ]
      };
    });

    const esBlocks: Block[] = EMPLOYABILITY_SKILLS_DATA.map((blockData, i) => {
      const sets = (blockData.sets || [{ title: 'Practice Set 1', questions: blockData.questions || [] }]).map((setData, j) => ({
        id: `es-s-${i+1}-${j+1}`,
        title: setData.title,
        description: `Practice for ${blockData.title}`,
        questions: setData.questions,
        createdAt: Date.now(),
        isPlaceholder: setData.questions.length === 0
      }));

      return {
        id: `es-b-${i+1}`,
        title: blockData.title,
        sets: sets
      };
    });

    const initialSubjects: Subject[] = [
      { id: 'irdmt', name: 'Industrial Robotic (IRDMT)', icon: '🤖', modules: [{ id: 'm1', name: 'Learning Outcomes', blocks: irdmtBlocks }] },
      { id: 'es', name: 'Employability Skills', icon: '📚', modules: [{ id: 'm2', name: 'Syllabus Units', blocks: esBlocks }] }
    ];

    persistData(initialSubjects);
  }, []);

  const persistData = (data: Subject[]) => {
    setSubjects(data);
    localStorage.setItem('robotic_quiz_v20_db', JSON.stringify(data));
  };

  const resetToHome = () => {
    setActiveSubject(null);
    setActiveModule(null);
    setActiveBlock(null);
    setActiveQuizSet(null);
    setResult(null);
    setView(AppView.SUBJECT_SELECT);
  };

  const handleAddSubject = (name: string, icon: string) => {
    const newSubject: Subject = {
      id: `sub-${Date.now()}`, name, icon,
      modules: [{ id: `mod-${Date.now()}`, name: 'Learning Outcome', blocks: [] }]
    };
    persistData([...subjects, newSubject]);
  };

  const handleAdminUpdate = (newSet: QuizSet, blockId: string) => {
    const newSubjects = subjects.map(s => {
      const newBlocks = s.modules[0].blocks.map(b => {
        if (b.id === blockId) {
          const newSets = [...b.sets, { ...newSet, isPlaceholder: false }];
          return { ...b, sets: newSets };
        }
        return b;
      });
      return { ...s, modules: s.modules.map(m => ({ ...m, blocks: newBlocks })) };
    });
    persistData(newSubjects);
  };

  const handleAddBlock = (subjectId: string, title: string) => {
    const newSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        const newBlock: Block = { id: `block-${Date.now()}`, title, sets: [] };
        return { ...s, modules: s.modules.map(m => ({ ...m, blocks: [...m.blocks, newBlock] })) };
      }
      return s;
    });
    persistData(newSubjects);
  };

  const handleDeleteBlock = (subjectId: string, blockId: string) => {
    const newSubjects = subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, modules: s.modules.map(m => ({ ...m, blocks: m.blocks.filter(b => b.id !== blockId) })) };
      }
      return s;
    });
    persistData(newSubjects);
  };

  const handleDeleteSet = (blockId: string, setId: string) => {
    const newSubjects = subjects.map(s => {
      const newBlocks = s.modules[0].blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, sets: b.sets.filter(set => set.id !== setId) };
        }
        return b;
      });
      return { ...s, modules: s.modules.map(m => ({ ...m, blocks: newBlocks })) };
    });
    persistData(newSubjects);
  };

  const finishQuiz = (score: number, total: number, answers: Record<string, number>) => {
    if (!activeQuizSet) return;
    setResult({ score, total, answers, quiz: activeQuizSet });
    setView(AppView.RESULT);
    setActiveQuizSet(null);
  };

  if (view === AppView.SPLASH) {
    return (
      <div className="min-h-screen bg-robot-dark flex items-center justify-center overflow-hidden font-sans">
        <div className="text-center space-y-8 animate-fadeIn">
          <div className="w-24 h-24 bg-gradient-to-br from-robot-primary to-robot-secondary rounded-2xl animate-bounce shadow-[0_0_30px_rgba(0,243,255,0.4)] flex items-center justify-center mx-auto">
            <span className="text-5xl">🤖</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase neon-text">ROBOTIC QUIZ</h1>
            <p className="text-robot-primary font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">System Initializing...</p>
            <div className="h-1.5 w-64 bg-slate-800 mx-auto rounded-full overflow-hidden mt-6">
              <div className="h-full bg-robot-primary animate-[loading_2s_ease-in-out_forwards]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} onViewChange={setView} onResetApp={resetToHome}>
      <div className="font-sans">
        {view === AppView.SUBJECT_SELECT && (
          <div className="space-y-12 animate-fadeIn py-10">
            <div className="text-center space-y-4 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Mission <span className="text-robot-primary">Control</span></h2>
              <p className="text-slate-400 text-base md:text-lg font-medium">Initialize trade protocols for precision evaluation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">
              {subjects.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setActiveSubject(s); setView(AppView.MODULE_SELECT); }}
                  className="group relative bg-robot-card border border-white/5 rounded-[3rem] p-10 md:p-12 text-center transition-all hover:scale-[1.03] hover:border-robot-primary/50 shadow-2xl active:scale-95 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl md:text-9xl">{s.icon}</span>
                  </div>
                  <div className="relative z-10">
                    <div className="text-6xl md:text-8xl mb-8 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">{s.icon}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight">{s.name}</h3>
                    <div className="bg-robot-primary/10 text-robot-primary py-1.5 px-6 rounded-full inline-block text-[10px] font-black uppercase tracking-widest border border-robot-primary/20">Operational</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.MODULE_SELECT && activeSubject && (
          <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto px-6">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setView(AppView.SUBJECT_SELECT)} 
                className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-robot-primary/10 text-slate-400 hover:text-robot-primary transition-all active:scale-90 border border-white/5 hover:border-robot-primary/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Return</span>
              </button>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{activeSubject.name} <span className="text-slate-700 font-light mx-2">/</span> Modules</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {activeSubject.modules.map(m => (
                <button 
                  key={m.id}
                  onClick={() => { setActiveModule(m); setView(AppView.SET_SELECT); }}
                  className="bg-robot-card border border-robot-secondary/20 p-8 md:p-10 rounded-[2rem] text-left hover:border-robot-primary transition-all group flex justify-between items-center shadow-2xl active:scale-[0.98]"
                >
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tight">{m.name}</h3>
                    <p className="text-robot-primary font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Accessing {m.blocks.length} Practice Units</p>
                  </div>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-robot-primary/10 flex items-center justify-center text-robot-primary group-hover:bg-robot-primary group-hover:text-robot-dark transition-all shadow-xl border border-robot-primary/10">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.SET_SELECT && activeModule && (
          <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto px-6 pb-20">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-robot-primary/20 text-robot-primary px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-robot-primary/10">{activeSubject?.name}</span>
                  <span className="text-slate-700 text-xs">/</span>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{activeModule.name}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setView(AppView.MODULE_SELECT)} 
                    className="flex items-center space-x-2 px-3 py-2 bg-white/5 rounded-xl hover:bg-robot-primary/10 text-slate-400 hover:text-robot-primary transition-all active:scale-90 border border-white/5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return</span>
                  </button>
                  <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Syllabus <span className="text-robot-primary">Units</span></h2>
                </div>
              </div>
              <button onClick={resetToHome} className="p-3 bg-white/5 rounded-xl hover:text-robot-primary transition-colors">
                <span className="text-[11px] font-bold uppercase tracking-widest">Home</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeModule.blocks.map((block, idx) => (
                <button 
                  key={block.id}
                  onClick={() => { setActiveBlock(block); setView(AppView.SUB_SET_SELECT); }}
                  className="relative p-5 md:p-6 rounded-[1.5rem] border bg-robot-card border-robot-secondary/20 hover:border-robot-primary transition-all text-left flex flex-col space-y-3 group shadow-xl hover:-translate-y-1 active:scale-[0.97]"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">LO_{idx + 1 < 10 ? `0${idx+1}` : idx+1}</span>
                    <div className="flex space-x-1">
                      {block.sets.map((s, si) => (
                        <div key={si} className={`w-2 h-2 rounded-full ${s.questions.length === 0 ? 'bg-slate-800' : 'bg-robot-primary'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm font-bold text-slate-200 line-clamp-3 leading-snug uppercase tracking-tight h-14 group-hover:text-robot-primary transition-colors">
                    {block.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.SUB_SET_SELECT && activeBlock && (
          <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto px-6 pb-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setView(AppView.SET_SELECT)} 
                  className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-2xl hover:bg-robot-primary/10 text-slate-400 hover:text-robot-primary transition-all active:scale-90 border border-white/5 hover:border-robot-primary/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Return</span>
                </button>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">Select <span className="text-robot-primary">Set</span></h2>
              </div>
              <button onClick={resetToHome} className="p-3 bg-white/5 rounded-xl hover:text-robot-primary transition-colors">
                <span className="text-[11px] font-bold uppercase tracking-widest">Home</span>
              </button>
            </div>
            <div className="bg-robot-card border border-robot-secondary/20 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-robot-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
              <h3 className="text-[10px] font-black text-robot-primary mb-3 uppercase tracking-[0.4em]">Syllabus Context:</h3>
              <p className="text-lg md:text-xl font-bold text-white leading-tight uppercase tracking-tight">{activeBlock.title}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
              {activeBlock.sets.map((set) => {
                const isEmpty = set.questions.length === 0;
                return (
                  <button 
                    key={set.id}
                    disabled={isEmpty}
                    onClick={() => { setActiveQuizSet(set); setView(AppView.QUIZ); }}
                    className={`relative p-10 md:p-12 rounded-[2.5rem] border transition-all text-center flex flex-col items-center justify-center space-y-6 group overflow-hidden shadow-2xl active:scale-95 ${
                      isEmpty 
                      ? 'bg-slate-900/40 border-white/5 opacity-40 cursor-not-allowed' 
                      : 'bg-robot-card border-robot-secondary/30 hover:border-robot-primary hover:bg-robot-primary/5'
                    }`}
                  >
                    <div className="text-6xl md:text-7xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">{isEmpty ? '🔒' : '🎯'}</div>
                    <div className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{set.title}</div>
                    {!isEmpty && (
                      <div className="space-y-4">
                        <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">{set.questions.length} Precision Tasks</p>
                        <div className="bg-robot-primary text-robot-dark px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-xl group-hover:bg-white transition-all tracking-widest">Begin Test</div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {view === AppView.QUIZ && activeQuizSet && (
          <QuizPlayer quiz={activeQuizSet} onFinish={finishQuiz} onCancel={() => setView(AppView.SUB_SET_SELECT)} />
        )}

        {view === AppView.RESULT && result && (
          <ResultDashboard 
            result={result} 
            onHome={resetToHome}
            onRetry={() => { setActiveQuizSet(result.quiz); setView(AppView.QUIZ); }}
          />
        )}

        {view === AppView.ADMIN && (
          <AdminPanel 
            subjects={subjects}
            onQuizCreated={handleAdminUpdate} 
            onAddSubject={handleAddSubject}
            onDeleteSubject={(id) => persistData(subjects.filter(s => s.id !== id))}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            onDeleteSet={handleDeleteSet}
            onExit={resetToHome}
          />
        )}
      </div>
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
