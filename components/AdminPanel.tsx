
import React, { useState, useRef } from 'react';
import { generateQuizFromText } from '../geminiService';
import { QuizSet, Subject, Block } from '../types';

interface AdminPanelProps {
  subjects: Subject[];
  onQuizCreated: (quiz: QuizSet, blockId: string) => void;
  onAddSubject: (name: string, icon: string) => void;
  onDeleteSubject: (id: string) => void;
  onAddBlock: (subjectId: string, title: string) => void;
  onDeleteBlock: (subjectId: string, blockId: string) => void;
  onDeleteSet: (blockId: string, setId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ subjects, onQuizCreated, onAddSubject, onDeleteSubject, onAddBlock, onDeleteBlock, onDeleteSet }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newTradeName, setNewTradeName] = useState('');
  const [newTradeIcon, setNewTradeIcon] = useState('🤖');
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [uploadMode, setUploadMode] = useState<'pdf' | 'text'>('pdf');
  
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedBlockId, setSelectedBlockId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentBlocks = selectedSubject?.modules[0]?.blocks || [];

  const handleGenerateQuiz = async (sourceText: string, title: string) => {
    if (!sourceText || !title || !selectedBlockId) {
      setError("Please provide a title, content, and select a block.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const questions = await generateQuizFromText(sourceText, title, 25);
      
      const newQuiz: QuizSet = {
        id: `set-${Date.now()}`,
        title,
        description: `Synthesized unit practice set.`,
        questions,
        createdAt: Date.now()
      };

      onQuizCreated(newQuiz, selectedBlockId);
      setNewSetTitle('');
      setRawText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert("Practice set successfully deployed to unit.");
    } catch (err: any) {
      setError(err.message || "Synthesis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        try {
          // @ts-ignore
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let fullText = "";
          for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
          }
          resolve(fullText);
        } catch (e) { reject(e); }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await extractTextFromPDF(file);
        handleGenerateQuiz(text, newSetTitle);
      } catch (e) { setError("Failed to parse PDF document."); }
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto px-6 font-sans pb-40">
      <div className="flex justify-center space-x-3 bg-robot-card/40 p-2.5 rounded-[2rem] border border-robot-secondary/30 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 ${activeTab === 'upload' ? 'bg-robot-primary text-robot-dark shadow-2xl shadow-robot-primary/30' : 'text-slate-500 hover:text-white'}`}
        >
          Create Content
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 ${activeTab === 'manage' ? 'bg-robot-primary text-robot-dark shadow-2xl shadow-robot-primary/30' : 'text-slate-500 hover:text-white'}`}
        >
          Manage Syllabus
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="bg-robot-card p-12 rounded-[3.5rem] border border-robot-secondary/30 shadow-[0_0_80px_rgba(0,0,0,0.4)] space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none">New <span className="text-robot-primary">MCQ Set</span></h2>
            <div className="flex bg-robot-dark/80 rounded-2xl p-1.5 border border-white/10 shadow-inner">
              <button onClick={() => setUploadMode('pdf')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'pdf' ? 'bg-robot-secondary text-white shadow-xl' : 'text-slate-600'}`}>PDF Document</button>
              <button onClick={() => setUploadMode('text')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'text' ? 'bg-robot-secondary text-white shadow-xl' : 'text-slate-600'}`}>Text Snippet</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pl-3">Parent Trade</label>
              <select 
                value={selectedSubjectId}
                onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedBlockId(''); }}
                className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-robot-primary font-black shadow-inner appearance-none cursor-pointer"
              >
                <option value="">-- Choose Trade --</option>
                {subjects.map(s => <option key={s.id} value={s.id} className="bg-robot-dark">{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pl-3">Target Unit</label>
              <select 
                value={selectedBlockId}
                onChange={(e) => setSelectedBlockId(e.target.value)}
                className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-robot-primary font-bold shadow-inner appearance-none cursor-pointer"
              >
                <option value="">-- Choose Unit --</option>
                {currentBlocks.map((b, i) => <option key={b.id} value={b.id} className="bg-robot-dark">{i+1}. {b.title}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pl-3">Set Title</label>
            <input 
              type="text" 
              value={newSetTitle}
              onChange={(e) => setNewSetTitle(e.target.value)}
              placeholder="e.g. Unit 1: Technical Safety MCQs"
              className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-8 py-5 text-white focus:outline-none focus:border-robot-primary font-black text-xl shadow-inner placeholder:text-slate-700"
            />
          </div>

          {uploadMode === 'text' ? (
            <div className="space-y-6">
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] pl-3">Raw Content Paste</label>
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the questions and answers from your document..."
                rows={10}
                className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:border-robot-primary font-medium text-lg shadow-inner resize-none custom-scrollbar"
              />
              <button 
                onClick={() => handleGenerateQuiz(rawText, newSetTitle)}
                disabled={isProcessing || !rawText || !newSetTitle || !selectedBlockId}
                className={`w-full py-7 rounded-[2rem] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl ${isProcessing ? 'bg-slate-800 text-slate-600 animate-pulse cursor-wait' : 'bg-gradient-to-r from-robot-primary to-robot-secondary text-white hover:scale-[1.03] active:scale-95 shadow-robot-primary/30'}`}
              >
                {isProcessing ? 'SYNTHESIZING...' : 'DEPLOY SET'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileChange} className="hidden" id="pdf-upload" />
              <label 
                htmlFor="pdf-upload"
                className={`w-full flex flex-col items-center justify-center border-4 border-dashed rounded-[3.5rem] p-24 cursor-pointer transition-all duration-500 ${isProcessing || !newSetTitle || !selectedBlockId ? 'border-slate-800 bg-slate-900/10 cursor-not-allowed opacity-30' : 'border-robot-secondary/40 hover:border-robot-primary bg-robot-secondary/5 hover:bg-robot-primary/10 shadow-2xl active:scale-95'}`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-robot-primary shadow-[0_0_20px_rgba(0,243,255,0.5)]"></div>
                    <p className="text-robot-primary font-black text-xl animate-pulse tracking-widest">EXTRACTING DATA...</p>
                  </div>
                ) : (
                  <>
                    <span className="text-8xl mb-8 filter drop-shadow-[0_0_15px_rgba(112,0,255,0.4)]">📄</span>
                    <p className="text-white font-black text-3xl uppercase tracking-tight">Upload PDF Source</p>
                    <p className="text-slate-500 font-bold text-sm mt-4 uppercase tracking-[0.3em]">Bilingual extraction via AI</p>
                  </>
                )}
              </label>
            </div>
          )}
          {error && <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-3xl text-red-400 font-black text-center shadow-lg animate-bounce">{error}</div>}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-16">
          {/* Create New Trade */}
          <div className="bg-robot-card p-12 rounded-[3.5rem] border border-robot-secondary/30 shadow-2xl space-y-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Register New <span className="text-robot-primary">Trade</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3">Display Name</label>
                <input 
                  type="text" value={newTradeName} onChange={(e) => setNewTradeName(e.target.value)}
                  className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white font-black shadow-inner focus:outline-none focus:border-robot-primary"
                  placeholder="e.g. Fitter"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3">Identifier Icon</label>
                <select 
                  value={newTradeIcon} onChange={(e) => setNewTradeIcon(e.target.value)}
                  className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white font-black shadow-inner focus:outline-none focus:border-robot-primary appearance-none cursor-pointer"
                >
                  <option value="🤖">🤖 Robotics</option>
                  <option value="📚">📚 Education</option>
                  <option value="⚡">⚡ Electrical</option>
                  <option value="⚙️">⚙️ Mechanical</option>
                  <option value="🛠️">🛠️ Workshop</option>
                  <option value="💻">💻 IT / Computer</option>
                </select>
              </div>
              <button 
                onClick={() => { if(newTradeName) { onAddSubject(newTradeName, newTradeIcon); setNewTradeName(''); } }}
                className="w-full bg-robot-primary text-robot-dark py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-robot-primary/20 hover:scale-[1.05] active:scale-95 transition-all"
              >
                Add Trade
              </button>
            </div>
          </div>

          {/* Create New Block (Topic Unit) */}
          <div className="bg-robot-card p-12 rounded-[3.5rem] border border-robot-secondary/30 shadow-2xl space-y-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Create Syllabus <span className="text-robot-primary">Unit</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3">Parent Trade</label>
                <select 
                  value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white font-black shadow-inner focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">-- Choose Trade --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex space-x-4">
                <input 
                  type="text" value={newBlockTitle} onChange={(e) => setNewBlockTitle(e.target.value)}
                  className="flex-1 bg-robot-dark/50 border border-robot-secondary/20 rounded-2xl px-6 py-5 text-white font-bold shadow-inner focus:outline-none focus:border-robot-primary"
                  placeholder="Unit Title..."
                />
                <button 
                  onClick={() => { if(newBlockTitle && selectedSubjectId) { onAddBlock(selectedSubjectId, newBlockTitle); setNewBlockTitle(''); } }}
                  className="bg-robot-primary text-robot-dark px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.05] transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* List/Hierarchy Display */}
          <div className="space-y-10 pb-32">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight pl-6 border-l-8 border-robot-primary py-2">System Infrastructure</h3>
            <div className="grid grid-cols-1 gap-12">
              {subjects.length === 0 ? (
                <div className="p-20 text-center bg-white/5 rounded-[3.5rem] border border-dashed border-white/10">
                  <p className="text-slate-600 font-black uppercase tracking-[0.4em]">Infrastructure Empty</p>
                </div>
              ) : (
                subjects.map(subject => (
                  <div key={subject.id} className="bg-robot-card border border-white/5 rounded-[4rem] p-12 space-y-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={() => { if(confirm(`Delete trade ${subject.name}?`)) onDeleteSubject(subject.id); }}
                        className="text-red-500 p-4 hover:bg-red-500/10 rounded-3xl transition-all active:scale-90"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <div className="flex items-center space-x-8">
                      <span className="text-8xl group-hover:rotate-12 transition-transform duration-500 filter drop-shadow-2xl">{subject.icon}</span>
                      <div>
                        <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{subject.name}</h4>
                        <div className="mt-4 flex space-x-3">
                          <span className="bg-robot-primary/10 text-robot-primary py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest">{subject.modules[0].blocks.length} Syllabus Units</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6 pl-10 border-l-4 border-robot-secondary/30">
                      {subject.modules[0].blocks.map((block, idx) => (
                        <div key={block.id} className="bg-robot-dark/60 rounded-[2.5rem] p-8 border border-white/5 space-y-6 shadow-inner group/block">
                          <div className="flex justify-between items-center">
                            <h5 className="text-xl font-black text-slate-200">
                              <span className="text-slate-600 mr-3 text-sm">#{idx+1}</span>
                              {block.title}
                            </h5>
                            <button 
                              onClick={() => { if(confirm('Delete this syllabus unit?')) onDeleteBlock(subject.id, block.id); }} 
                              className="text-slate-700 hover:text-red-400 p-3 transition-colors active:scale-90"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {block.sets.map(set => (
                              <div key={set.id} className="bg-robot-card/80 border border-robot-secondary/20 rounded-2xl px-5 py-4 flex justify-between items-center group/set shadow-2xl transition-all hover:border-robot-primary/50">
                                <span className={`text-sm font-black ${set.isPlaceholder ? 'text-slate-700' : 'text-robot-primary'}`}>{set.title}</span>
                                <button 
                                  onClick={() => onDeleteSet(block.id, set.id)} 
                                  className="opacity-0 group-hover/set:opacity-100 text-slate-600 hover:text-red-400 transition-all p-1"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            ))}
                            {block.sets.length === 0 && <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] p-4 text-center border border-dashed border-white/5 rounded-2xl">Unit Inactive</p>}
                          </div>
                        </div>
                      ))}
                      {subject.modules[0].blocks.length === 0 && <p className="text-slate-700 font-black uppercase tracking-widest text-xs py-10 text-center border border-dashed border-white/10 rounded-[2.5rem]">No units configured</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
