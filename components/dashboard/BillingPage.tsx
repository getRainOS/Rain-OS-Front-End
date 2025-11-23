
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { STRIPE_PRICE_IDS } from '../../constants';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface PlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  priceId: string;
  onUpgrade: (priceId: string) => void;
  isLoading: boolean;
  recommended?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, price, description, features, priceId, onUpgrade, isLoading, recommended }) => (
    <div className={`relative flex flex-col h-full ${recommended ? 'md:-mt-4 md:mb-4' : ''}`}>
        {recommended && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30 uppercase tracking-wide">
                    Best Value
                </span>
            </div>
        )}
        
        <Card className={`flex flex-col h-full relative transition-transform duration-300 ${recommended ? 'border-blue-500/50 shadow-blue-500/10 dark:shadow-blue-900/20 bg-blue-50/50 dark:bg-slate-900/60' : 'bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60'}`}>
            {/* Glow effect for recommended */}
            {recommended && <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none"></div>}
            
            <div className="flex-grow relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">{title}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{price}</span>
                    </div>
                </div>
                
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-b border-slate-200/50 dark:border-slate-800/50 pb-6 transition-colors duration-300">{description}</p>
                
                <div className="mt-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">What's included</p>
                    <ul className="space-y-3">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                                <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${recommended ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} transition-colors duration-300`}>
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="ml-3 text-slate-700 dark:text-slate-300 text-sm transition-colors duration-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-8 relative z-10">
                <Button 
                  className="w-full"
                  onClick={() => onUpgrade(priceId)}
                  disabled={isLoading}
                  isLoading={isLoading}
                  variant={recommended ? 'primary' : 'secondary'}
                  size="lg"
                >
                    Choose {title}
                </Button>
            </div>
        </Card>
    </div>
);

export const BillingPage: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Free plan logic: limit <= 5
    const isFreePlan = user && user.usage.limit <= 5;

    const handleUpgrade = async (priceId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { url } = await api.post<{ url: string }>('/stripe/create-checkout-session', { priceId });
            window.location.href = url;
        } catch (err: any) {
            setError(err.message || 'Failed to start upgrade process.');
            setIsLoading(false);
        }
    };

    const handleManageBilling = async () => {
        setManageLoading(true);
        setError(null);
        try {
            const { url } = await api.post<{ url: string }>('/stripe/create-portal-session', {});
            window.location.href = url;
        } catch (err: any) {
            setError(err.message || 'Failed to open billing portal.');
            setManageLoading(false);
        }
    };
    
    return (
        <div className="space-y-10 max-w-5xl mx-auto pb-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl transition-colors duration-300">Upgrade your capacity</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    Get more AI actions for your Rain OS WordPress plugin.
                </p>
            </div>
            
            {!isFreePlan && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-500/30">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg transition-colors duration-300">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Subscription Active</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">You are on a paid plan with <span className="font-bold text-blue-600 dark:text-blue-400">{user?.usage.limit}</span> monthly actions.</p>
                            </div>
                        </div>
                        <Button onClick={handleManageBilling} isLoading={manageLoading} variant="secondary">
                            Manage Subscription
                        </Button>
                    </div>
                </Card>
            )}

            {isFreePlan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
                    <PlanCard 
                        title="Business"
                        price="$29.99"
                        description="Great for blogs and small business sites."
                        features={[
                            '100 Actions / Month',
                            'Email Support',
                            'Access to Rain OS Plugin'
                        ]}
                        priceId={STRIPE_PRICE_IDS.business}
                        onUpgrade={handleUpgrade}
                        isLoading={isLoading}
                    />
                    <PlanCard 
                        title="Pro"
                        price="$99.99"
                        description="For high volume sites and agencies."
                        features={[
                            '500 Actions / Month',
                            'Priority Support', 
                            'Advanced Analytics',
                            'Access to Rain OS Plugin'
                        ]}
                        priceId={STRIPE_PRICE_IDS.pro}
                        onUpgrade={handleUpgrade}
                        isLoading={isLoading}
                        recommended={true}
                    />
                </div>
            )}
            
            {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mx-auto max-w-md dark:text-red-400 dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}
        </div>
    );
};
