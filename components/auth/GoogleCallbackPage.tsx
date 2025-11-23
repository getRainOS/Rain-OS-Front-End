import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../common/Spinner';

export const GoogleCallbackPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('Finalizing authentication...');

  useEffect(() => {
    // With HashRouter, React Router correctly puts the query string in `location.search`
    const params = new URLSearchParams(location.search);
    const apiKey = params.get('apiKey');
    const authError = params.get('error');

    const handleAuth = async () => {
      if (authError) {
        setError(`Authentication failed: ${authError}. Redirecting to login...`);
        setTimeout(() => navigate('/login'), 3000);
      } else if (apiKey) {
        try {
          await login(apiKey);
          navigate('/');
        } catch (err) {
          setError('Failed to process authentication. Please try again. Redirecting...');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        setError('Invalid authentication callback state. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuth();
  }, [location, login, navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200">
      {error ? (
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500">Authentication Failed</h2>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <>
          <Spinner />
          <p className="mt-4">{message}</p>
        </>
      )}
    </div>
  );
};