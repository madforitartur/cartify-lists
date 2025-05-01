
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type ThemeMode = 'light' | 'dark';
type CurrencyType = 'BRL' | 'USD' | 'EUR';
type AccentColor = 
  | 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink' | 'teal' | 'indigo'
  | 'yellow' | 'lime' | 'emerald' | 'cyan' | 'sky' | 'violet' | 'fuchsia' | 'rose';

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
    bg: 'bg-purple-500 hover:bg-purple-600',
    text: 'text-purple-500',
    border: 'border-purple-500',
  },
  orange: {
    bg: 'bg-orange-500 hover:bg-orange-600',
    text: 'text-orange-500',
    border: 'border-orange-500',
  },
  blue: {
    bg: 'bg-blue-500 hover:bg-blue-600',
    text: 'text-blue-500',
    border: 'border-blue-500',
  },
  green: {
    bg: 'bg-green-500 hover:bg-green-600',
    text: 'text-green-500',
    border: 'border-green-500',
  },
  red: {
    bg: 'bg-red-500 hover:bg-red-600',
    text: 'text-red-500',
    border: 'border-red-500',
  },
  pink: {
    bg: 'bg-pink-500 hover:bg-pink-600',
    text: 'text-pink-500',
    border: 'border-pink-500',
  },
  teal: {
    bg: 'bg-teal-500 hover:bg-teal-600',
    text: 'text-teal-500',
    border: 'border-teal-500',
  },
  indigo: {
    bg: 'bg-indigo-500 hover:bg-indigo-600',
    text: 'text-indigo-500',
    border: 'border-indigo-500',
  },
  yellow: {
    bg: 'bg-yellow-500 hover:bg-yellow-600',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
  },
  lime: {
    bg: 'bg-lime-500 hover:bg-lime-600',
    text: 'text-lime-500',
    border: 'border-lime-500',
  },
  emerald: {
    bg: 'bg-emerald-500 hover:bg-emerald-600',
    text: 'text-emerald-500',
    border: 'border-emerald-500',
  },
  cyan: {
    bg: 'bg-cyan-500 hover:bg-cyan-600',
    text: 'text-cyan-500',
    border: 'border-cyan-500',
  },
  sky: {
    bg: 'bg-sky-500 hover:bg-sky-600',
    text: 'text-sky-500',
    border: 'border-sky-500',
  },
  violet: {
    bg: 'bg-violet-500 hover:bg-violet-600',
    text: 'text-violet-500',
    border: 'border-violet-500',
  },
  fuchsia: {
    bg: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    text: 'text-fuchsia-500',
    border: 'border-fuchsia-500',
  },
  rose: {
    bg: 'bg-rose-500 hover:bg-rose-600',
    text: 'text-rose-500',
    border: 'border-rose-500',
  }
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
