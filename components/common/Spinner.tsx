import React from 'react';

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-4',
      lg: 'h-16 w-16 border-4',
      xl: 'h-24 w-24 border-4'
  };

  return (
    <div className={`flex justify-center items-center`}>
      <div className={`animate-spin rounded-full border-t-blue-600 border-white/20 ${sizeClasses[size]} ${className}`}></div>
    </div>
  );
};
