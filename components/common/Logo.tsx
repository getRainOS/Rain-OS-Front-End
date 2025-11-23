
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
    return (
        <Link to="/" className="group flex items-center gap-2 no-underline select-none focus:outline-none">
            {/* Minimalist Text Logo */}
            <div className="flex items-baseline" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white transition-colors duration-300">
                    r<span className="text-blue-600 dark:text-blue-500">ai</span>n
                </span>
            </div>
            
            {/* Refined Beta Badge */}
            <div className="flex items-center justify-center px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Beta
                </span>
            </div>
        </Link>
    );
};
