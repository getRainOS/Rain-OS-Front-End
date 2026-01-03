import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;

      setMessage('If an account with that email exists, we have sent a password reset link.');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password">
      {message ? (
        <div className="text-center">
          <p className="text-green-400">{message}</p>
          <p className="mt-6">
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Back to Sign in
            </Link>
          </p>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-slate-400 mb-6">
            Enter your email address and we will send you a link to reset your password.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                Send Reset Link
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};