import React from 'react';
import { API_BASE_URL } from '../../constants';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8S109.8 11.6 244 11.6c70.3 0 129.8 27.8 174.5 73.2l-66.2 64.1C325.2 122.1 289.1 98.4 244 98.4c-69.7 0-126.5 56.8-126.5 126.5s56.8 126.5 126.5 126.5c76.3 0 98.2-51.4 102-77.9H244v-79.6h236.1c2.4 12.8 3.9 26.3 3.9 40.8z"></path>
    </svg>
);

interface GoogleButtonProps {
    text: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ text }) => {
  const handleGoogleAuth = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="w-full inline-flex justify-center py-2 px-4 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
    >
      <GoogleIcon />
      {text}
    </button>
  );
};