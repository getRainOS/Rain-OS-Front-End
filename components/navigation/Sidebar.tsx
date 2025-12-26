import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { createPortalSession } from '../../services/stripe';

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action?: () => Promise<void>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Sidebar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handlePortalRedirect = async () => {
    try {
      setLoadingAction('Manage Subscription');
      const url = await createPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to redirect to billing portal:', error);
      setLoadingAction(null);
    }
  };

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Upgrade', href: '/billing', icon: CreditCardIcon },
    { name: 'Manage Subscription', icon: CreditCardIcon, action: handlePortalRedirect },
  ];

  return (
    <div className="flex-shrink-0 w-72 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-slate-200 flex flex-col relative transition-colors duration-300">
        {/* Subtle gradient top line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>

        <div className="flex items-center justify-center h-24 flex-shrink-0 px-4">
            <div className="scale-90">
              <Logo />
            </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2 transition-colors duration-300">Menu</div>
            <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
                const isActive = item.href ? location.pathname === item.href : false;
                const isActionLoading = loadingAction === item.name;
                
                if (item.action) {
                    return (
                        <button
                            key={item.name}
                            onClick={item.action}
                            disabled={isActionLoading}
                            className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-r-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 border-l-2 border-transparent ${isActionLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                             <item.icon
                                className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors duration-200"
                                aria-hidden="true"
                            />
                            {isActionLoading ? 'Loading...' : item.name}
                        </button>
                    )
                }

                return (
                <Link
                    key={item.name}
                    to={item.href!}
                    className={classNames(
                        isActive 
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 border-l-2 border-transparent',
                        'group flex items-center px-4 py-3 text-sm font-medium rounded-r-lg transition-all duration-200'
                    )}
                >
                    <item.icon
                        className={classNames(
                        isActive ? 'text-blue-500 dark:text-blue-400 drop-shadow-md' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300',
                        'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                        )}
                        aria-hidden="true"
                    />
                    {item.name}
                </Link>
            )})}
            </nav>
        </div>
        
        {/* Bottom User Mini-section could go here */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 transition-colors duration-300">
            <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
                &copy; 2024 rain SaaS Inc.
            </div>
        </div>
    </div>
  );
};

// SVG Icons
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}