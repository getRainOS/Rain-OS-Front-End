
import React, { useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { api } from '../../services/api';

const UsageBar: React.FC<{ count: number; limit: number }> = ({ count, limit }) => {
    const percentage = limit > 0 ? Math.min((count / limit) * 100, 100) : 0;
    
    // Dynamic color based on usage
    let barColor = 'bg-blue-600 dark:bg-blue-500';
    if (percentage > 75) barColor = 'bg-yellow-500 dark:bg-yellow-400';
    if (percentage > 90) barColor = 'bg-red-500 dark:bg-red-500';

    return (
        <div className="mt-2">
            <div className="flex justify-between mb-3 items-end">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 transition-colors duration-300">Usage</p>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{count.toLocaleString()}</span>
                    <span className="text-sm text-slate-500 ml-1">/ {limit.toLocaleString()} Actions</span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                    {percentage.toFixed(1)}% Used
                </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden transition-colors duration-300">
                <div 
                    className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out`} 
                    style={{ width: `${percentage}%` }}
                >
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">1 Analysis = 1 Action</p>
        </div>
    );
}

const ApiKeyDisplay: React.FC<{ apiKey: string }> = ({ apiKey }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-4">
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-800 p-1.5 shadow-sm transition-colors duration-300">
                <div className="flex-grow px-4 py-2 font-mono text-sm text-slate-600 dark:text-slate-300 truncate selection:bg-blue-500/30 transition-colors duration-300">
                    {apiKey}
                </div>
                <Button onClick={copyToClipboard} variant="secondary" size="sm" className="!py-1.5 !px-3 !text-xs">
                    {copied ? (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                             <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                             Copied
                        </span>
                    ) : (
                        'Copy'
                    )}
                </Button>
            </div>
        </div>
    );
}

export const DashboardHomePage: React.FC = () => {
  const { user, refetchUser } = useAuth();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleRegenerateKey = useCallback(async () => {
    if (!window.confirm('Are you sure you want to regenerate your key? The old one will stop working immediately.')) {
        return;
    }
    setIsRegenerating(true);
    setError(null);
    try {
        await api.post('/users/me/regenerate-key', {});
        await refetchUser();
    } catch (err: any) {
        setError(err.message || 'Failed to regenerate key');
    } finally {
        setIsRegenerating(false);
    }
  }, [refetchUser]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors duration-300">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">User Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-300">Manage your Rain OS plugin connection and subscription.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xl border border-slate-300 dark:border-slate-700">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Rain OS User</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">{user.email}</p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                        <p className={`text-xl font-bold capitalize ${user.subscriptionStatus === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                            {user.subscriptionStatus.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 transition-colors duration-300">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 flex items-center transition-colors duration-300">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Monthly Actions Limit
                    </h3>
                    <UsageBar count={user.usage.count} limit={user.usage.limit} />
                </div>
            </Card>
          </div>

          {/* Right Column - API Key */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-300">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h1m2 4l1 1m4-4l1 1m0 0l2-2m-2 2l-2-2m0 0l2-2m-2 2l2 2" /></svg>
                    </div>
                    <Button onClick={handleRegenerateKey} variant="danger" size="sm" isLoading={isRegenerating} className="opacity-90 hover:opacity-100">
                        Regenerate Key
                    </Button>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-300">API Key Management</h3>
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        Copy this key and paste it into your WordPress Plugin settings to start.
                    </p>
                </div>
                
                <div className="mt-auto pt-6">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Your API Key</p>
                    <ApiKeyDisplay apiKey={user.apiKey} />
                    {error && <p className="text-red-500 text-xs mt-3 bg-red-50 p-2 rounded border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">{error}</p>}
                </div>
            </Card>
          </div>
      </div>
    </div>
  );
};
