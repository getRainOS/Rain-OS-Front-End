import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, noPadding = false }) => {
  return (
    <div className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 ring-1 ring-slate-900/5 dark:ring-white/5 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 dark:hover:shadow-blue-900/10 hover:border-blue-300/30 dark:hover:border-slate-600/50 ${className}`}>
      <div className={noPadding ? '' : 'p-8'}>
        {children}
      </div>
    </div>
  );
};