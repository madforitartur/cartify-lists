
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppMode } from '@/types';
import { toast } from "sonner";

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

const STORAGE_KEY = 'cartify-app-mode';

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};

export const AppModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<AppMode>('shopping');

  // Load mode preference from localStorage on initial render
  useEffect(() => {
    const storedMode = localStorage.getItem(STORAGE_KEY);
    if (storedMode === 'shopping' || storedMode === 'tasks') {
      setModeState(storedMode);
    }
  }, []);

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    toast.success(`Modo alterado para ${newMode === 'shopping' ? 'Compras' : 'Tarefas'}`);
  };

  const toggleMode = () => {
    const newMode = mode === 'shopping' ? 'tasks' : 'shopping';
    setMode(newMode);
  };

  return (
    <AppModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </AppModeContext.Provider>
  );
};
