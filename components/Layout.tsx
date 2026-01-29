
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
    const url = window.location.href;
    const shareData = {
      title: 'ROBOTIC QUIZ',
      text: 'Precision ITI CBT Practice Module for IRDMT & ES.',
      url: url
    };

    try {
      // Try using the Web Share API first
      if (navigator.share) {
        // Some browsers throw 'Invalid URL' if the protocol isn't http/https (e.g. data:, blob:, or localhost dev envs)
        await navigator.share(shareData);
      } else {
        // Force fallback if not supported
        throw new Error('Web Share not supported');
      }
    } catch (err: any) {
      // If the user cancelled, don't show the fallback alert
      if (err.name === 'AbortError') return;

      // Fallback to clipboard for 'Invalid URL' or unsupported environments
      try {
        await navigator.clipboard.writeText(url);
        alert('Module link transmitted to clipboard (Share API encountered an issue).');
      } catch (clipboardErr) {
        console.error('Transmission error:', err);
        console.error('Clipboard fallback failed:', clipboardErr);
      }
    }
  };

  const menuItems = [
    { label: 'Control Center', icon: '🏠', action: () => { onResetApp(); setIsMenuOpen(false); } },
    { label: 'Broadcast Link', icon: '📡', action: handleShare },
    { label: 'System Protocols', icon: '📜', action: () => { alert('Select subject -> Unit -> Practice Set. Achieve 100% accuracy for certification.'); setIsMenuOpen(false); } },
    { label: 'Dev Contact', icon: '🔌', action: () => { window.location.href = 'mailto:sbgprajapati@gmail.com'; setIsMenuOpen(false); } },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-robot-primary/30">
      {/* Dynamic Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-opacity duration-500"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Futuristic Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-robot-dark/95 border-r border-robot-primary/10 z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.87, 0, 0.13, 1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-robot-primary to-robot-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-robot-primary/20 animate-float">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Robotic <span className="text-robot-primary">OS</span></h2>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">v4.0.2 Stable Build</span>
        </div>
        
        <div className="p-4 space-y-2 mt-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full flex items-center space-x-4 p-4 rounded-xl hover:bg-robot-primary/5 transition-all group border border-transparent hover:border-robot-primary/10"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
              <span className="text-sm font-bold text-slate-400 group-hover:text-robot-primary uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-8 w-full text-center">
          <div className="h-px w-12 bg-robot-primary/20 mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Core Engine Active</p>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-robot-dark/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-robot-primary"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div onClick={onResetApp} className="cursor-pointer">
            <h1 className="font-black text-xl tracking-tighter uppercase">
              <span className="text-white">ROBOTIC</span>
              <span className="text-robot-primary ml-1">QUIZ</span>
            </h1>
          </div>
        </div>
        
        <nav className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5">
          <button 
            onClick={() => onViewChange(AppView.SUBJECT_SELECT)}
            className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${currentView !== AppView.ADMIN ? 'bg-robot-primary text-robot-dark' : 'text-slate-500 hover:text-white'}`}
          >
            Mission
          </button>
          <button 
            onClick={() => onViewChange(AppView.ADMIN)}
            className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${currentView === AppView.ADMIN ? 'bg-robot-secondary text-white' : 'text-slate-500 hover:text-white'}`}
          >
            Admin
          </button>
        </nav>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      
      <footer className="py-10 border-t border-white/5 text-center bg-robot-dark/50">
        <div className="flex justify-center space-x-6 mb-4">
           <div className="w-1.5 h-1.5 rounded-full bg-robot-primary animate-pulse"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-robot-secondary animate-pulse [animation-delay:0.2s]"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-robot-accent animate-pulse [animation-delay:0.4s]"></div>
        </div>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">System Architecture by SBG Prajapati</p>
      </footer>
    </div>
  );
};

export default Layout;
