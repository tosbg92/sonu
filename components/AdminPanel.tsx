
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
  onExit?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ subjects, onQuizCreated, onAddSubject, onDeleteSubject, onAddBlock, onDeleteBlock, onDeleteSet, onExit }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setError("Incomplete Mission Data: Title, Content, and Target Unit are mandatory.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const questions = await generateQuizFromText(sourceText, title, 25);
      
      const newQuiz: QuizSet = {
        id: `set-${Date.now()}`,
        title,
        description: `AI-Synthesized unit practice set.`,
        questions,
        createdAt: Date.now()
      };

      onQuizCreated(newQuiz, selectedBlockId);
      setNewSetTitle('');
      setRawText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess("Mission Successful: Practice set deployed to operational unit.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "Synthesis process interrupted by system error.");
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
          for (let i = 1; i <= Math.min(pdf.numPages, 100); i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
          }
          if (!fullText.trim()) reject(new Error("No readable text found in PDF."));
          resolve(fullText);
        } catch (e) { reject(new Error("PDF Parsing Engine Failure. File might be corrupted or protected.")); }
      };
      reader.onerror = () => reject(new Error("File Read Error."));
      reader.readAsArrayBuffer(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setError(null);
      try {
        const text = await extractTextFromPDF(file);
        handleGenerateQuiz(text, newSetTitle);
      } catch (e: any) { 
        setError(e.message);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-slide-up max-w-5xl mx-auto px-4 pb-32">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onExit}
          className="flex items-center space-x-3 px-5 py-3 bg-white/5 rounded-2xl hover:bg-robot-primary/10 text-slate-400 hover:text-robot-primary transition-all active:scale-90 border border-white/5 hover:border-robot-primary/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7 7-7"></path></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Admin</span>
        </button>
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Infrastructure Management</span>
      </div>

      <div className="flex bg-robot-card rounded-2xl p-1.5 border border-white/5 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'upload' ? 'bg-robot-primary text-robot-dark shadow-lg shadow-robot-primary/20' : 'text-slate-500 hover:text-white'}`}
        >
          Synthesize Content
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${activeTab === 'manage' ? 'bg-robot-primary text-robot-dark shadow-lg shadow-robot-primary/20' : 'text-slate-500 hover:text-white'}`}
        >
          Infrastructure
        </button>
      </div>

      {activeTab === 'upload' && (
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Quiz <span className="text-robot-primary">Synthesizer</span></h2>
              <p className="text-slate-400 text-sm mt-1">Deploy new MCQ sets via AI analysis.</p>
            </div>
            <div className="flex bg-robot-dark rounded-xl p-1 border border-white/5">
              <button onClick={() => setUploadMode('pdf')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'pdf' ? 'bg-robot-secondary text-white' : 'text-slate-600'}`}>PDF Data</button>
              <button onClick={() => setUploadMode('text')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'text' ? 'bg-robot-secondary text-white' : 'text-slate-600'}`}>Raw Text</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Subject Branch</label>
              <select 
                value={selectedSubjectId}
                onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedBlockId(''); }}
                className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-robot-primary appearance-none cursor-pointer"
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Operational Unit</label>
              <select 
                value={selectedBlockId}
                onChange={(e) => setSelectedBlockId(e.target.value)}
                className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-robot-primary appearance-none cursor-pointer"
              >
                <option value="">-- Select Unit --</option>
                {currentBlocks.map((b, i) => <option key={b.id} value={b.id}>{i+1}. {b.title}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Set Identification</label>
            <input 
              type="text" 
              value={newSetTitle}
              onChange={(e) => setNewSetTitle(e.target.value)}
              placeholder="e.g. Unit 1 Advanced Robotics Practice"
              className="w-full bg-robot-dark border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-robot-primary text-lg placeholder:text-slate-700"
            />
          </div>

          {uploadMode === 'text' ? (
            <div className="space-y-6">
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the source material here for AI synthesis..."
                rows={8}
                className="w-full bg-robot-dark border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-robot-primary resize-none custom-scrollbar"
              />
              <button 
                onClick={() => handleGenerateQuiz(rawText, newSetTitle)}
                disabled={isProcessing || !rawText || !newSetTitle || !selectedBlockId}
                className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all ${isProcessing ? 'bg-slate-800 text-slate-600 animate-pulse' : 'bg-gradient-to-r from-robot-primary to-robot-secondary text-white hover:brightness-110 shadow-lg shadow-robot-primary/20'}`}
              >
                {isProcessing ? 'INITIALIZING SYNTHESIS...' : 'BEGIN GENERATION'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileChange} className="hidden" id="pdf-upload" />
              <label 
                htmlFor="pdf-upload"
                className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-16 cursor-pointer transition-all ${isProcessing || !newSetTitle || !selectedBlockId ? 'border-slate-800 bg-slate-900/10 cursor-not-allowed opacity-30' : 'border-robot-primary/40 hover:border-robot-primary bg-robot-primary/5'}`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-robot-primary"></div>
                    <p className="text-robot-primary font-bold animate-pulse">EXTRACTING MISSION DATA...</p>
                  </div>
                ) : (
                  <>
                    <span className="text-6xl mb-4">📄</span>
                    <p className="text-white font-bold text-xl uppercase tracking-tight">Upload Source PDF</p>
                    <p className="text-slate-500 text-xs mt-2 font-medium">Bilingual AI Analysis Ready</p>
                  </>
                )}
              </label>
            </div>
          )}

          {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold text-center text-sm">{error}</div>}
          {success && <div className="p-4 bg-robot-success/10 border border-robot-success/30 rounded-xl text-robot-success font-bold text-center text-sm">{success}</div>}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Register <span className="text-robot-primary">Trade</span></h3>
              <div className="space-y-4">
                <input 
                  type="text" value={newTradeName} onChange={(e) => setNewTradeName(e.target.value)}
                  className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none"
                  placeholder="Trade Name (e.g. Fitter)"
                />
                <select 
                  value={newTradeIcon} onChange={(e) => setNewTradeIcon(e.target.value)}
                  className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white appearance-none"
                >
                  <option value="🤖">🤖 Robotics</option>
                  <option value="⚡">⚡ Electrical</option>
                  <option value="⚙️">⚙️ Mechanical</option>
                  <option value="🛠️">🛠️ Workshop</option>
                  <option value="💻">💻 IT / Computer</option>
                </select>
                <button 
                  onClick={() => { if(newTradeName) { onAddSubject(newTradeName, newTradeIcon); setNewTradeName(''); } }}
                  className="w-full bg-robot-primary text-robot-dark py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                >
                  Add Trade
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">New <span className="text-robot-primary">Unit</span></h3>
              <div className="space-y-4">
                <select 
                  value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white appearance-none"
                >
                  <option value="">-- Target Trade --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input 
                  type="text" value={newBlockTitle} onChange={(e) => setNewBlockTitle(e.target.value)}
                  className="w-full bg-robot-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none"
                  placeholder="Unit Title (e.g. Workshop Safety)"
                />
                <button 
                  onClick={() => { if(newBlockTitle && selectedSubjectId) { onAddBlock(selectedSubjectId, newBlockTitle); setNewBlockTitle(''); } }}
                  className="w-full bg-robot-secondary text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                >
                  Create Unit
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight pl-4 border-l-4 border-robot-primary">System Hierarchy</h3>
            <div className="grid grid-cols-1 gap-6">
              {subjects.map(subject => (
                <div key={subject.id} className="glass-panel rounded-[2rem] p-8 border border-white/5 group relative overflow-hidden">
                  <button 
                    onClick={() => { if(confirm(`Erase trade ${subject.name}?`)) onDeleteSubject(subject.id); }}
                    className="absolute top-4 right-4 text-slate-700 hover:text-red-500 p-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  
                  <div className="flex items-center space-x-6 mb-8">
                    <span className="text-5xl">{subject.icon}</span>
                    <div>
                      <h4 className="text-2xl font-black text-white uppercase">{subject.name}</h4>
                      <span className="text-[10px] font-bold text-robot-primary uppercase tracking-widest">{subject.modules[0].blocks.length} Units Online</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {subject.modules[0].blocks.map((block, idx) => (
                      <div key={block.id} className="bg-robot-dark/40 rounded-xl p-5 border border-white/5 flex justify-between items-center group/unit">
                        <div>
                          <p className="text-white font-bold text-sm">#{idx+1} {block.title}</p>
                          <p className="text-[10px] text-slate-500 uppercase mt-1">{block.sets.length} Practice Sets Active</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { if(confirm('Erase this unit?')) onDeleteBlock(subject.id, block.id); }}
                            className="text-slate-700 hover:text-red-500 p-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
