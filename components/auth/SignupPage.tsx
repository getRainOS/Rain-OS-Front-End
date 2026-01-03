import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { GoogleButton } from '../common/GoogleButton';
import { supabase } from '../../lib/supabase';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('An account with this email already exists.');
        return;
      }

      // Check for email confirmation requirement
      if (!data.session) {
          navigate('/verify-email', { state: { email } });
          return;
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-none" isLoading={isLoading} disabled={isLoading}>
            Sign up
          </Button>
        </div>
      </form>

      <div className="mt-5">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
              Or
            </span>
          </div>
        </div>

        <div className="mt-5">
          <GoogleButton text="Sign up with Google" />
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};