import React, { useEffect, useState } from 'react';
import { CredentialsType, SessionUserType } from '@event-organizer/shared-types';
import authAPI from '../api/auth';
import { APIError } from '../libs/api/types';

interface AuthContextType {
  user: SessionUserType | null;
  isLoading: boolean;
  login: (args: { credentials: CredentialsType; onSuccess?: VoidFunction; onError?: (error: Error) => void }) => void;
  logout: (callback?: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<SessionUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authAPI
      .me()
      .then((session) => {
        setUser(session.user);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);

  const login = async ({
    onSuccess,
    onError,
    credentials,
  }: {
    credentials: CredentialsType;
    onSuccess?: VoidFunction;
    onError?: (error: Error) => void;
  }) => {
    try {
      const session = await authAPI.login(credentials);
      if (session) {
        setUser(session.user);
        onSuccess && onSuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        onError && onError(err);
      }
    }
  };

  const logout = async (callback?: VoidFunction) => {
    const response = await authAPI.logout();
    if (response.status === 200) {
      setUser(null);
      callback && callback();
    }
  };

  const value = { user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
