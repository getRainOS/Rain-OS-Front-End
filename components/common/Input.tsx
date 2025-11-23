import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelRight?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, labelRight, id, ...props }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </label>
        {labelRight && (
            <div className="text-xs">
                {labelRight}
            </div>
        )}
      </div>
      <div className="relative group">
        <input
          id={id}
          className="appearance-none block w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm bg-slate-50/50 dark:bg-slate-900/50 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 sm:text-sm hover:border-slate-300 dark:hover:border-slate-700"
          {...props}
        />
      </div>
    </div>
  );
};