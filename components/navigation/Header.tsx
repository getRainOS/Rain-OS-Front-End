
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  // Helper to determine status color
  const getStatusColor = (status?: string) => {
    switch(status) {
        case 'active': return 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]';
        case 'past_due': return 'bg-yellow-500 dark:bg-yellow-400';
        case 'cancelled': return 'bg-red-500 dark:bg-red-400';
        default: return 'bg-slate-400';
    }
  };

  return (
    <header className="w-full bg-white/60 dark:bg-slate-900/30 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/30 sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side of header */}
          <div className="flex items-center">
             <span className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">Rain OS</span>
             <span className="mx-2 text-slate-400 dark:text-slate-600">/</span>
             <span className="text-slate-800 dark:text-slate-200 text-sm font-semibold tracking-wide transition-colors duration-300">Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-none transition-colors duration-300">{user?.email}</p>
              <div className="flex items-center justify-end mt-1.5 gap-2">
                 <div className={`h-2 w-2 rounded-full ${getStatusColor(user?.subscriptionStatus)}`}></div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold transition-colors duration-300">
                    {user?.subscriptionStatus?.replace('_', ' ') || 'Unknown'}
                 </p>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-slate-300/50 dark:bg-slate-700/50 mx-2 transition-colors duration-300"></div>
            <Button onClick={logout} variant="secondary" size="sm" className="!bg-slate-100/50 dark:!bg-slate-800/50 border-slate-300 dark:border-slate-600/50 hover:!bg-slate-200/80 dark:hover:!bg-slate-700/80">
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
