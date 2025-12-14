
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createCheckoutSession, createPortalSession, handleCheckoutRedirect, getCurrentPlanDetails } from '../../services/stripe';
import { STRIPE_PRICE_IDS, PLAN_DETAILS } from '../../constants';
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
    <div className={`relative flex flex-col h-full ${recommended ? 'md:-mt-6 md:mb-6 transform md:scale-105' : ''}`}>
        {recommended && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl shadow-blue-500/40 uppercase tracking-wide">
                    Best Value
                </span>
            </div>
        )}

        <Card className={`flex flex-col h-full relative transition-all duration-300 hover:shadow-2xl ${recommended ? 'border-blue-500/50 shadow-xl shadow-blue-500/20 dark:shadow-blue-900/30 bg-blue-50/50 dark:bg-slate-900/60' : 'bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 shadow-lg'}`}>
            {/* Glow effect for recommended */}
            {recommended && <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none"></div>}

            <div className="flex-grow relative z-10 p-2">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">{title}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{price}</span>
                    </div>
                </div>

                <p className="mt-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed border-b border-slate-200/50 dark:border-slate-800/50 pb-6 transition-colors duration-300 min-h-[80px]">{description}</p>

                <div className="mt-6">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">What's included</p>
                    <ul className="space-y-3.5">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${recommended ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} transition-colors duration-300`}>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="ml-3 text-slate-700 dark:text-slate-300 text-base transition-colors duration-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-8 relative z-10 p-2">
                {title === 'Free' ? (
                    <Button
                        className="w-full"
                        disabled={true}
                        variant="secondary"
                        size="lg"
                    >
                        Current Plan
                    </Button>
                ) : (
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
                )}</div>
        </Card>
    </div>
);

export const BillingPage: React.FC = () => {
    const { user, refetchUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Check for redirect status from Stripe
    useEffect(() => {
        const redirectStatus = handleCheckoutRedirect();
        if (redirectStatus.status === 'success') {
            setSuccessMessage(redirectStatus.message || 'Payment successful!');
            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            // Refresh user data to get updated subscription
            refetchUser();
        } else if (redirectStatus.status === 'cancelled') {
            setError(redirectStatus.message || 'Payment cancelled');
            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [refetchUser]);

    // Get current plan details
    const currentPlan = user ? getCurrentPlanDetails(user) : PLAN_DETAILS.free;
    const isFreePlan = currentPlan.name === 'Free';

    const handleUpgrade = async (priceId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = await createCheckoutSession(priceId);
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
            const url = await createPortalSession();
            window.location.href = url;
        } catch (err: any) {
            setError(err.message || 'Failed to open billing portal.');
            setManageLoading(false);
        }
    };

    return (
        <div className="space-y-10 max-w-[1800px] mx-auto pb-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tigh sm:text-5xl transition-colors duration-300">Choose Your Plan</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300 pb-4">
                    Get more Answer Engine Optimizations for your Rain OS WordPress plugin.
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
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{currentPlan.name} Plan Active</h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    You have <span className="font-bold text-blue-600 dark:text-blue-400">
                                        {currentPlan.limit}
                                    </span> monthly Answer Engine Optimizations • <span className="font-bold">{user?.usage.count}/{currentPlan.limit}</span> used
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleManageBilling} isLoading={manageLoading} variant="secondary">
                            Manage Subscription
                        </Button>
                    </div>
                </Card>
            )}

            {successMessage && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-700 dark:text-green-300">{successMessage}</p>
                    </div>
                </Card>
            )}
            <br />

            {/* {!isFreePlan && currentPlan.name !== 'Pro' && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Upgrade to Pro</h2>
                    <div className="max-w-md">
                        <PlanCard
                            title="Pro"
                            price="$99.99 / Month"
                            description="Ideal for enterprises, scaling SaaS brands, product teams and other power users optimizing for Gemini, Perplexity, Claude and the emerging ChatGPT shopping experience."
                            features={[
                                '500 Answer Engine Optimizations',
                                'Everything in Business +',
                                'Priority E-mail Support',
                            ]}
                            priceId={STRIPE_PRICE_IDS.pro}
                            onUpgrade={handleUpgrade}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )} */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 items-stretch pt-4">
                <PlanCard
                    title="Free"
                    price="$0"
                    description="Great for hobbyists looking to experiment. Get full access to our 3 Pillar Framework."
                    features={[
                        '5 Answer Engine Optimizations / month',
                        'Semantic Clarity: Precision & ambiguity check',
                        'Readability Score: AI & human processing ease',
                        'Metadata Audit: Schema & HTML verification',
                        'Logical Structure: Heading hierarchy analysis',
                        'Entity Recognition: Knowledge graph linking',
                        'Citation Readiness: Quotable snippet detection',
                        'AEO Alignment: Direct answer scoring',
                        'Schema Extraction: Structured data opportunities',
                        'QA-Format Detection: Question/Answer optimization',
                    ]}
                    priceId=""
                    onUpgrade={() => {}}
                    isLoading={false}
                />
                <PlanCard
                    title="Business"
                    price="$29.99 / Month"
                    description="Perfect for local businesses, early-stage startups, product teams and solo-creators optimizing for Gemini, Perplexity, Claude and the emerging ChatGPT shopping experience."
                    features={[
                        '100 Answer Engine Optimizations',
                        'Semantic Clarity: Precision & ambiguity check',
                        'Readability Score: AI & human processing ease',
                        'Metadata Audit: Schema & HTML verification',
                        'Logical Structure: Heading hierarchy analysis',
                        'Entity Recognition: Knowledge graph linking',
                        'Citation Readiness: Quotable snippet detection',
                        'AEO Alignment: Direct answer scoring',
                        'Schema Extraction: Structured data opportunities',
                        'QA-Format Detection: Question/Answer optimization',
                    ]}
                    priceId={STRIPE_PRICE_IDS.business}
                    onUpgrade={handleUpgrade}
                    isLoading={isLoading}
                    recommended={true}
                />
                <PlanCard
                    title="Pro"
                    price="$99.99 / Month"
                    description="Ideal for enterprises, scaling SaaS brands, product teams and other power users optimizing for Gemini, Perplexity, Claude and the emerging ChatGPT shopping experience."
                    features={[
                        '500 Answer Engine Optimizations',
                        'Everything in Business +',
                        'Priority E-mail Support',
                    ]}
                    priceId={STRIPE_PRICE_IDS.pro}
                    onUpgrade={handleUpgrade}
                    isLoading={isLoading}
                />
            </div>

            {error && <p className="text-center text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mx-auto max-w-md dark:text-red-400 dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}

            {/* Support Section */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Need Help?</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        Have questions about our plans or need assistance? We're here to help!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a
                            href="mailto:support@getrainos.com"
                            className="text-lg font-medium hover:underline"
                        >
                            support@getrainos.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
