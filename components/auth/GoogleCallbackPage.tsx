import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../common/Spinner';

export const GoogleCallbackPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 text-center">
        {/* Logo Placeholder - You can replace with <img src="/logo.png" /> */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Rain OS</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-10 flex flex-col items-center border border-slate-100 dark:border-slate-700/50">
            <Spinner size="xl" className="border-t-blue-500 mb-6" />
            
            <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-2">
                Signing you in...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Please wait while we verify your credentials.
            </p>
        </div>
      </div>
    </div>
  );
};