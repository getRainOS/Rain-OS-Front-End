import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AuthLayout } from './AuthLayout';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing password reset token.');
    }
    setToken(tokenFromUrl);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('No reset token found.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await api.post('/auth/reset-password', { token, password }, false);
      setMessage('Your password has been reset successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password">
      {message ? (
        <div className="text-center">
          <p className="text-green-400">{message}</p>
          <p className="mt-4">
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Proceed to Sign in
            </Link>
          </p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="password"
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={!token || isLoading}>
              Reset Password
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};