import React, { useState } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isLockedOut = attempts >= 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (password.trim().toLowerCase() === 'mama') {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      // Remove error state after animation
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 selection:bg-slate-200">
      <div 
        className={`w-full max-w-md p-8 md:p-10 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl transition-all duration-300 ${error ? 'animate-shake' : ''}`}
        style={{ animationDuration: '0.4s' }}
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-inner mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-slate-800 font-medium tracking-tight">Security Check</h2>
            <p className="text-sm text-slate-500 font-medium">Please answer the security question to open the pages 🔐.</p>
          </div>
          
          {isLockedOut ? (
            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm animate-fade-in">
              Access locked. Please refresh the page and contact me to proceed.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="block text-sm font-medium text-slate-600 ml-1">
                  What is the first nickname I started calling you? 🤔
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50/50 border rounded-2xl outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 ${error ? 'border-red-300 bg-red-50/30 text-red-600 focus:ring-red-500/10 focus:border-red-400' : 'border-slate-200'}`}
                  placeholder="Enter the nickname..."
                  autoFocus
                />
                <div className={`h-4 text-xs font-medium ml-1 transition-opacity ${error ? 'text-red-500 opacity-100' : 'opacity-0'}`}>
                  Incorrect nickname. {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining.
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-medium tracking-wide hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!password.trim()}
              >
                Unlock Chapter 24
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
