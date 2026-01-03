import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const VerifyEmailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState<string>(location.state?.email || '');
    const [token, setToken] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup', // or 'email' or 'magiclink' depending on context. 'signup' is safest for new users.
            });

            if (verifyError) throw verifyError;

            // Success will trigger onAuthStateChange in AuthContext, causing redirect.
            // But we can double check or just navigate.
            navigate('/');
            
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Verify your email">
            <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Please enter the verification code sent to <strong>{email}</strong>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                    id="token"
                    label="Verification Code"
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456"
                />

                {!location.state?.email && (
                     <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="pt-2">
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-none" isLoading={isLoading} disabled={isLoading}>
                        Verify Email
                    </Button>
                </div>
            </form>

             <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                Didn't receive code?{' '}
                <button 
                  type="button"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  onClick={async () => {
                      if(!email) return;
                      await supabase.auth.resend({
                          type: 'signup',
                          email,
                      });
                      alert('Code resent!');
                  }}
                >
                  Resend
                </button>
              </p>
        </AuthLayout>
    );
};
