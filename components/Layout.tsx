
import React, { useState } from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onResetApp: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, onResetApp }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'ITI CBT Exam MCQ',
      text: 'Practice NCVT MCQ sets for IRDMT & Employability Skills!',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('App link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const menuItems = [
    { label: 'Home', icon: '🏠', action: () => { onResetApp(); setIsMenuOpen(false); } },
    { label: 'Share App', icon: '🔗', action: handleShare },
    { label: 'Help', icon: '❓', action: () => { alert('Help: Choose a trade, then a syllabus unit, and start practicing your MCQs. Good luck!'); setIsMenuOpen(false); } },
    { label: 'Contact Us', icon: '📧', action: () => { window.location.href = 'mailto:sbgprajapati@gmail.com'; setIsMenuOpen(false); } },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-robot-primary/30">
      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-robot-card border-r border-robot-secondary/30 z-[101] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5 bg-gradient-to-br from-robot-card to-robot-dark">
          <div className="w-16 h-16 bg-gradient-to-br from-robot-primary to-robot-secondary rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-robot-primary/20">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Main Navigation</h2>
        </div>
        <div className="p-6 space-y-3">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center space-x-5 p-5 rounded-2xl hover:bg-white/5 transition-all group active:scale-95"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <span className="text-xl font-bold text-slate-300 group-hover:text-white">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="absolute bottom-10 left-10 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
          Robotic Quiz Engine v2.1
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-robot-dark/90 backdrop-blur-xl border-b border-robot-secondary/30 px-6 py-5 flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-robot-primary active:scale-90"
            title="Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button 
            onClick={onResetApp}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-robot-primary active:scale-90 hidden sm:block"
            title="Go Home"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <h1 className="hidden md:block font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-robot-primary to-robot-secondary uppercase tracking-tighter cursor-pointer" onClick={onResetApp}>
            ITI CBT EXAM MCQ
          </h1>
        </div>
        
        <nav className="flex space-x-1.5 bg-robot-card p-1.5 rounded-2xl border border-robot-secondary/20 shadow-inner">
          <button 
            onClick={() => onViewChange(AppView.SUBJECT_SELECT)}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all duration-300 ${currentView !== AppView.ADMIN ? 'bg-robot-primary text-robot-dark shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Practice
          </button>
          <button 
            onClick={() => onViewChange(AppView.ADMIN)}
            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all duration-300 ${currentView === AppView.ADMIN ? 'bg-robot-secondary text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Admin Panel
          </button>
        </nav>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {children}
      </main>
      
      <footer className="py-12 border-t border-robot-secondary/20 text-center space-y-3 bg-robot-dark/30">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">© {new Date().getFullYear()} ITI CBT Exam Engine</p>
        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em]">Developed by SBG Prajapati</p>
      </footer>
    </div>
  );
};

export default Layout;
