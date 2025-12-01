import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { GoogleButton } from '../common/GoogleButton';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<{ apiKey: string }>('/auth/login', { email, password }, false);
      await login(response?.apiKey);
      console.log("login response",response);
      localStorage.setItem('apiKey', response?.apiKey);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError(null);
    try {
      await login('dummy-api-key-for-testing');
      navigate('/');
    } catch (err: any) {
      setError('Could not start demo session.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelRight={
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium">
                    Forgot your password?
                </Link>
            }
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="pt-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-none" isLoading={isLoading} disabled={isLoading || isDemoLoading}>
            Sign in
          </Button>
        </div>
      </form>
      
      <div className="mt-4">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={handleDemoLogin} 
            isLoading={isDemoLoading} 
            disabled={isLoading || isDemoLoading}
          >
            Continue as Demo User
          </Button>
      </div>

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
          <GoogleButton text="Sign in with Google" />
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};