import React, { createContext, useContext, useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  avatar?: string;
  location?: string;
  points: number;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePoints: (newPoints: number) => void;
  addPoints: (pointsToAdd: number) => void;
  deductPoints: (pointsToDeduct: number) => Promise<boolean>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const updatePoints = useCallback((newPoints: number) => {
    setUser((prev) => prev ? { ...prev, points: newPoints } : null);
  }, []);

  const addPoints = useCallback((pointsToAdd: number) => {
    setUser((prev) => prev ? { ...prev, points: prev.points + pointsToAdd } : null);
  }, []);

  const deductPoints = useCallback(async (pointsToDeduct: number): Promise<boolean> => {
    if (!user || user.points < pointsToDeduct) {
      return false;
    }
    updatePoints(user.points - pointsToDeduct);
    return true;
  }, [user, updatePoints]);

  const value: UserContextType = {
    user,
    setUser,
    updatePoints,
    addPoints,
    deductPoints,
    loading,
    setLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
