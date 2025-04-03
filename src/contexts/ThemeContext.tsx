
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type ThemeMode = 'light' | 'dark';
type CurrencyType = 'BRL' | 'USD' | 'EUR';
type AccentColor = 'purple' | 'orange' | 'blue' | 'green' | 'red';

interface ThemeSettings {
  mode: ThemeMode;
  currency: CurrencyType;
  shoppingAccentColor: AccentColor;
  tasksAccentColor: AccentColor;
}

interface ThemeContextType {
  settings: ThemeSettings;
  setMode: (mode: ThemeMode) => void;
  setCurrency: (currency: CurrencyType) => void;
  setAccentColor: (type: 'shopping' | 'tasks', color: AccentColor) => void;
  getAccentColorClass: (type: 'shopping' | 'tasks', element: 'bg' | 'text' | 'border') => string;
  getCurrencySymbol: () => string;
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  currency: 'BRL',
  shoppingAccentColor: 'purple',
  tasksAccentColor: 'orange'
};

const STORAGE_KEY = 'cartify-theme-settings';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Map accent colors to Tailwind classes
const accentColorMap = {
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    border: 'border-purple-500',
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    border: 'border-blue-500',
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    border: 'border-green-500',
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    border: 'border-red-500',
  },
};

// Map currency to symbols
const currencySymbols = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
      
      // Apply theme to document
      if (settings.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error loading theme settings:', e);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (settings.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setMode = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, mode }));
    toast.success(`Tema alterado para ${mode === 'dark' ? 'escuro' : 'claro'}`);
  };

  const setCurrency = (currency: CurrencyType) => {
    setSettings(prev => ({ ...prev, currency }));
    toast.success(`Moeda alterada para ${currency}`);
  };

  const setAccentColor = (type: 'shopping' | 'tasks', color: AccentColor) => {
    setSettings(prev => ({
      ...prev,
      ...(type === 'shopping' 
        ? { shoppingAccentColor: color }
        : { tasksAccentColor: color })
    }));
    toast.success(`Cor do modo ${type === 'shopping' ? 'Compras' : 'Tarefas'} alterada`);
  };

  const getAccentColorClass = (type: 'shopping' | 'tasks', element: 'bg' | 'text' | 'border') => {
    const color = type === 'shopping' ? settings.shoppingAccentColor : settings.tasksAccentColor;
    return accentColorMap[color][element];
  };

  const getCurrencySymbol = () => {
    return currencySymbols[settings.currency] || 'R$';
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        settings, 
        setMode, 
        setCurrency, 
        setAccentColor, 
        getAccentColorClass,
        getCurrencySymbol
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
