
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import QuizPlayer from './components/QuizPlayer';
import ResultDashboard from './components/ResultDashboard';
import { QuizSet, AppView, Question, Subject, Module, Block } from './types';

// @ts-ignore
window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// --- Pre-defined IRDMT Question Blocks ---
const SET_1_SAFETY: Question[] = [
  { id: "s1_q1", text: "What is the primary purpose of using Personal Protective Equipment (PPE) in the workplace? / कार्यस्थल पर व्यक्तिगत सुरक्षा उपकरण (PPE) का मुख्य उद्देश्य क्या है?", options: ["To increase work speed / कार्य गति बढ़ाने के लिए", "To ensure personal safety / व्यक्तिगत सुरक्षा सुनिश्चित करने के लिए", "To reduce costs / लागत कम करने के लिए", "To decorate the workplace / कार्यस्थल को सजाने के लिए"], correctAnswerIndex: 1 },
  { id: "s1_q2", text: "Which color is typically used for safety signs indicating \"Caution\"? / \"सावधानी\" दर्शाने वाले सुरक्षा संकेतों के लिए सामान्यतः कौन सा रंग उपयोग किया जाता है?", options: ["Red / लाल", "Yellow / पीला", "Green / हरा", "Blue / नीला"], correctAnswerIndex: 1 },
  { id: "s1_q3", text: "What is the first step to take when noticing a fire in the workshop? / कार्यशाला में आग लगने पर सबसे पहले क्या करना चाहिए?", options: ["Attempt to extinguish it immediately / तुरंत बुझाने का प्रयास करना", "Raise the alarm and inform others / अलार्म बजाना और दूसरों को सूचित करना", "Evacuate silently / चुपचाप निकल जाना", "Ignore it if small / छोटी होने पर अनदेखा करना"], correctAnswerIndex: 1 },
  { id: "s1_q4", text: "What is the primary goal of the 5S methodology? / 5S पद्धति का मुख्य उद्देश्य क्या है?", options: ["Cleaning only / केवल सफाई करना", "Organizing the workplace efficiently / कार्यस्थल को कुशलतापूर्वक व्यवस्थित करना", "Hiring more workers / अधिक कर्मचारियों की भर्ती करना", "Reducing workers' salaries / कर्मचारियों का वेतन कम करना"], correctAnswerIndex: 1 },
  { id: "s1_q5", text: "Which extinguisher should be used for a small electrical fire? / छोटी विद्युत आग के लिए कौन सा अग्निशामक उपयोग करना चाहिए?", options: ["Water / पानी", "Foam / फोम", "CO2 / सीओ2", "Sand / रेत"], correctAnswerIndex: 2 }
];

const SET_2_CUSTOMER: Question[] = [
  { id: "s2_q1", text: "What is the first step in product design? / उत्पाद डिज़ाइन में पहला चरण क्या है?", options: ["Manufacturing / निर्माण", "Identifying customer needs / ग्राहक आवश्यकताओं की पहचान करना", "Advertising / विज्ञापन करना", "Selling / बिक्री करना"], correctAnswerIndex: 1 },
  { id: "s2_q2", text: "What does CRM stand for? / CRM का पूर्ण रूप क्या है?", options: ["Customer Required Machine / ग्राहक आवश्यक मशीन", "Customer Relationship Management / ग्राहक संबंध प्रबंधन", "Certified Robotic Mechanism / प्रमाणित रोबोटिक तंत्र", "Creative Resource Management / रचनात्मक संसाधन प्रबंधन"], correctAnswerIndex: 1 },
  { id: "s2_q3", text: "Why is understanding customer needs important? / ग्राहक आवश्यकताओं को समझना क्यों महत्वपूर्ण है?", options: ["To reduce costs / लागत कम करने के लिए", "To develop suitable products / उपयुक्त उत्पाद विकसित करने के लिए", "To increase office staff / कार्यालय कर्मचारियों की संख्या बढ़ाने के लिए", "To decorate the office / कार्यालय सजाने के लिए"], correctAnswerIndex: 1 }
];

const SET_3_DRAWING: Question[] = [
  { id: "s3_q1", text: "What is the primary purpose of an engineering drawing? / इंजीनियरिंग ड्राइंग का मुख्य उद्देश्य क्या होता है?", options: ["Decoration / सजावट", "Communication of technical details / तकनीकी विवरणों का संप्रेषण", "Legal record / कानूनी रिकॉर्ड", "Marketing / विपणन"], correctAnswerIndex: 1 },
  { id: "s3_q2", text: "What do the letters \"GD&T\" stand for? / \"GD&T\" का पूरा रूप क्या है?", options: ["General Design & Tolerance / सामान्य डिजाइन और सहिष्णुता", "Geometrical Dimensioning & Tolerancing / ज्यामितीय आयामीकरण और सहिष्णुता", "Graph Drawing & Testing / ग्राफ ड्राइंग और परीक्षण", "Global Design & Technology / वैश्विक डिजाइन और प्रौद्योगिकी"], correctAnswerIndex: 1 },
  { id: "s3_q3", text: "In GD&T, which symbol represents circularity? / GD&T में वृत्ताकारता (Circularity) का प्रतीक क्या है?", options: ["Ⓜ", "⌀", "○", "∆"], correctAnswerIndex: 2 }
];

const App = () => {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [activeQuizSet, setActiveQuizSet] = useState<QuizSet | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (view === AppView.SPLASH) {
      const timer = setTimeout(() => setView(AppView.SUBJECT_SELECT), 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  useEffect(() => {
    const saved = localStorage.getItem('robotic_quiz_v7_db');
    if (saved) {
      setSubjects(JSON.parse(saved));
      return;
    }

    // --- Standard IRDMT Block Titles (23 Blocks) ---
    const irdmtBlockTitles = [
      "Safe working practices & Housekeeping",
      "Customer needs & Product specifications",
      "Industrial engineering drawing",
      "Industrial Robots & Configuration",
      "Robotic Cell Components",
      "Installation check of Robot",
      "Robot Power-on & Cell Health",
      "Teach Pendant functions",
      "Industrial Robot simulation software",
      "Robotic Coordinate systems",
      "Jogging using virtual programming",
      "Add-on assembly for applications",
      "Application-based robotic cells",
      "Welding robot system & PLC",
      "Interfacing Grippers in Robot",
      "Importing & Exporting robotic programs",
      "Program Reading & Execution",
      "Operation of Industrial Robot",
      "Safety procedure for Programmers",
      "Need of robotic programming Simulation",
      "Program creation via Simulation",
      "Remote monitoring & Connectivity",
      "Preventive Maintenance & Troubleshooting"
    ];

    const irdmtBlocks: Block[] = irdmtBlockTitles.map((title, i) => ({
      id: `irdmt-b-${i+1}`,
      title,
      sets: [
        {
          id: `irdmt-s-${i+1}-1`,
          title: "Set 1",
          description: `Diagnostic for ${title}`,
          questions: i === 0 ? SET_1_SAFETY : i === 1 ? SET_2_CUSTOMER : i === 2 ? SET_3_DRAWING : [],
          createdAt: Date.now(),
          isPlaceholder: i > 2
        }
      ]
    }));

    // --- Standard Employability Skill Block Titles (12 Blocks) ---
    const esBlockTitles = [
      "Introduction to Employability Skills",
      "Constitutional values - Citizenship",
      "Becoming a Professional in 21st Century",
      "Basic English Skills",
      "Career Development & Goal Setting",
      "Communication Skills",
      "Diversity & Inclusion",
      "Financial and Legal Literacy",
      "Essential Digital Skills",
      "Entrepreneurship",
      "Customer Service",
      "Getting Ready for Apprenticeship & Jobs"
    ];

    const esBlocks: Block[] = esBlockTitles.map((title, i) => ({
      id: `es-b-${i+1}`,
      title,
      sets: [
        {
          id: `es-s-${i+1}-1`,
          title: "Set 1",
          description: `Practice for ${title}`,
          questions: [],
          createdAt: Date.now(),
          isPlaceholder: true
        }
      ]
    }));

    const initialSubjects: Subject[] = [
      { id: 'irdmt', name: 'IRDMT', icon: '🤖', modules: [{ id: 'm1', name: 'Learning Outcome', blocks: irdmtBlocks }] },
      { id: 'es', name: 'Employability Skill', icon: '📚', modules: [{ id: 'm2', name: 'Learning Outcome', blocks: esBlocks }] }
    ];

    persistData(initialSubjects);
  }, []);

  const persistData = (data: Subject[]) => {
    setSubjects(data);
    localStorage.setItem('robotic_quiz_v7_db', JSON.stringify(data));
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
      id: `sub-${Date.now()}`,
      name,
      icon,
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
            <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">ITI CBT EXAM MCQ</h1>
            <div className="h-1.5 w-48 bg-slate-800 mx-auto rounded-full overflow-hidden">
              <div className="h-full bg-robot-primary animate-[loading_2s_ease-in-out_forwards]"></div>
            </div>
          </div>
        </div>
        <style>{`@keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <Layout currentView={view} onViewChange={setView} onResetApp={resetToHome}>
      <div className="font-sans">
        {view === AppView.SUBJECT_SELECT && (
          <div className="space-y-12 animate-fadeIn py-10">
            <div className="text-center space-y-4 px-4">
              <h2 className="text-4xl font-black text-white uppercase tracking-tight">Select <span className="text-robot-primary">Trade</span></h2>
              <p className="text-slate-400 text-lg">Choose your trade to begin CBT exam practice.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-6">
              {subjects.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setActiveSubject(s); setView(AppView.MODULE_SELECT); }}
                  className="group relative bg-robot-card border border-white/5 rounded-[2.5rem] p-12 text-center transition-all hover:scale-[1.03] hover:border-robot-primary/50 shadow-2xl active:scale-95"
                >
                  <div className="text-8xl mb-8 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                  <h3 className="text-3xl font-black text-white mb-3">{s.name}</h3>
                  <div className="bg-robot-primary/10 text-robot-primary py-1.5 px-4 rounded-full inline-block text-[10px] font-black uppercase tracking-widest">Ready for Practice</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.MODULE_SELECT && activeSubject && (
          <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto px-6">
            <div className="flex items-center space-x-6">
              <button onClick={() => setView(AppView.SUBJECT_SELECT)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h2 className="text-3xl font-bold text-white uppercase">{activeSubject.name} <span className="text-slate-600 font-light mx-2">/</span> Modules</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {activeSubject.modules.map(m => (
                <button 
                  key={m.id}
                  onClick={() => { setActiveModule(m); setView(AppView.SET_SELECT); }}
                  className="bg-robot-card border border-robot-secondary/20 p-8 rounded-[2rem] text-left hover:border-robot-primary transition-all group flex justify-between items-center shadow-xl active:scale-[0.98]"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{m.name}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Units: {m.blocks.length}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-robot-primary/10 flex items-center justify-center text-robot-primary group-hover:bg-robot-primary group-hover:text-robot-dark transition-all shadow-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.SET_SELECT && activeModule && (
          <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto px-6">
            <div className="flex items-center space-x-6">
              <button onClick={() => setView(AppView.MODULE_SELECT)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h2 className="text-3xl font-bold text-white uppercase">Syllabus Blocks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {activeModule.blocks.map((block, idx) => (
                <button 
                  key={block.id}
                  onClick={() => { setActiveBlock(block); setView(AppView.SUB_SET_SELECT); }}
                  className="relative p-8 rounded-[2rem] border bg-robot-card border-robot-secondary/30 hover:border-robot-primary transition-all text-left flex flex-col space-y-4 group shadow-xl hover:-translate-y-2 active:scale-95"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Block_{idx + 1}</span>
                    <div className="flex space-x-1.5">
                      {block.sets.map((s, si) => (
                        <div key={si} className={`w-2.5 h-2.5 rounded-full ${s.isPlaceholder ? 'bg-slate-800' : 'bg-robot-primary shadow-[0_0_8px_rgba(0,243,255,0.4)]'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-white line-clamp-3 leading-snug h-24">{block.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === AppView.SUB_SET_SELECT && activeBlock && (
          <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto px-6">
            <div className="flex items-center space-x-6">
              <button onClick={() => setView(AppView.SET_SELECT)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h2 className="text-2xl font-bold text-white uppercase">Practice Sets</h2>
            </div>
            <div className="bg-robot-card border border-robot-secondary/20 p-10 rounded-[3rem] shadow-2xl">
              <h3 className="text-xs font-black text-robot-primary mb-3 uppercase tracking-widest">Selected Unit:</h3>
              <p className="text-2xl font-bold text-white leading-relaxed">{activeBlock.title}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pb-20">
              {activeBlock.sets.map((set) => (
                <button 
                  key={set.id}
                  disabled={set.isPlaceholder}
                  onClick={() => { setActiveQuizSet(set); setView(AppView.QUIZ); }}
                  className={`relative p-12 rounded-[3rem] border transition-all text-center flex flex-col items-center justify-center space-y-6 group overflow-hidden ${
                    set.isPlaceholder 
                    ? 'bg-slate-900/40 border-white/5 opacity-50 cursor-not-allowed' 
                    : 'bg-robot-card border-robot-secondary/30 hover:border-robot-primary hover:scale-[1.05] shadow-2xl active:scale-95'
                  }`}
                >
                  <div className="text-7xl group-hover:scale-110 transition-transform">{set.isPlaceholder ? '🔒' : '📝'}</div>
                  <div className="text-3xl font-black text-white">{set.title}</div>
                  {!set.isPlaceholder && (
                    <div className="bg-robot-primary text-robot-dark px-6 py-2 rounded-2xl font-black uppercase text-sm shadow-lg group-hover:bg-white transition-colors">Start Exam</div>
                  )}
                </button>
              ))}
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
          />
        )}
      </div>
    </Layout>
  );
};

interface QuizResult {
  score: number;
  total: number;
  answers: Record<string, number>;
  quiz: QuizSet;
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
