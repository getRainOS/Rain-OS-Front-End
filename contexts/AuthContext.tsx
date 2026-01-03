
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { API_BASE_URL } from '../constants';

interface AuthContextType {
  user: User | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('apiKey'));
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to sync Supabase session with Backend to get API Key and User Data
  const syncWithBackend = useCallback(async (token: string) => {
    try {
      // We use fetch directly here to avoid circular dependency or complexifying api.ts
      // The backend expects specific Sync logic
      const response = await fetch(`${API_BASE_URL}/auth/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync user with backend');
      }

      const userData: User = await response.json();
      
      setUser(userData);
      setApiKey(userData.apiKey);
      localStorage.setItem('apiKey', userData.apiKey);
    } catch (error) {
      console.error('Backend sync failed:', error);
      // If sync fails, we might want to sign out or just show error
      // For now, we sign out to ensure consistency
      await supabase.auth.signOut();
      setUser(null);
      setApiKey(null);
      localStorage.removeItem('apiKey');
    }
  }, []);

  // Standard user refetching using the API Key (for updates during session)
  const refetchUser = useCallback(async () => {
    if (!apiKey) {
      return;
    }
    try {
      const userData = await api.get<User>('/users/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user', error);
      // Don't auto-logout on simple fetch error to avoid bad UX on network flakes,
      // but if 401, api.ts might handle it.
    }
  }, [apiKey]);

  const processedTokenRef = React.useRef<string | null>(null);

  useEffect(() => {
    const handleSession = async (currentSession: Session | null, event?: string) => {
       setSession(currentSession);
       
       if (currentSession) {
         // Only sync if this specific token hasn't been processed yet
         // This prevents double-calls from:
         // 1. Initial getSession()
         // 2. onAuthStateChange (SIGNED_IN) firing immediately after
         if (processedTokenRef.current !== currentSession.access_token) {
            processedTokenRef.current = currentSession.access_token;
            setIsLoading(true);
            await syncWithBackend(currentSession.access_token);
            setIsLoading(false);
         }
       } else {
         if (processedTokenRef.current) {
             // If we had a session and now don't, clear state
             processedTokenRef.current = null;
             setUser(null);
             setApiKey(null);
             localStorage.removeItem('apiKey');
         }
         setIsLoading(false);
       }
    };

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
       handleSession(session, 'MOUNT');
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
       // Filter out events that don't need re-syncing if token is same
       if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
           handleSession(session, event);
       }
    });

    return () => subscription.unsubscribe();
  }, [syncWithBackend]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setApiKey(null);
    localStorage.removeItem('apiKey');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        apiKey,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
