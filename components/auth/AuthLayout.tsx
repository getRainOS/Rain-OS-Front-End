import React from 'react';
import { Logo } from '../common/Logo';
import Rainfall from '../common/Rainfall';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-300">
      {/* Logo always in top left */}
      <div className="absolute top-6 left-6 z-30">
        <Logo />
      </div>
      
      {/* Theme Toggle top right */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen w-full">
        
        {/* Left Rain Panel */}
        <div className="relative flex-1 h-screen">
          <Rainfall />
        </div>

        {/* Center Content Area */}
        <div className="relative z-20 flex-shrink-0 w-[420px] flex flex-col justify-center items-center px-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-[2px]">
            
            <div className="relative w-full max-w-[360px]">
                {/* Glass Card - Ultra refined borders and shadows */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-lg p-6 transition-all duration-300">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        {title}
                        </h2>
                    </div>
                    {children}
                </div>
            </div>
        </div>

        {/* Right Rain Panel */}
        <div className="relative flex-1 h-screen">
          <Rainfall />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative">
        <div className="absolute inset-0 z-0">
          <Rainfall />
        </div>
        
        <div className="relative z-10 w-full max-w-[360px]">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-xl p-6 transition-all duration-300">
                 <div className="mb-5">
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                    {title}
                    </h2>
                </div>
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};