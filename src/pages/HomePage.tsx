
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckSquare, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppMode } from '@/contexts/AppModeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { settings, setMode: setThemeMode } = useTheme();
  const { setMode } = useAppMode();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Initialize the clock
    updateTime();
    
    // Update the clock every second
    const interval = setInterval(updateTime, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  };

  const handleModeSelect = (selectedMode: 'shopping' | 'tasks') => {
    // Only set the mode without selecting a specific list
    setMode(selectedMode);
    // Navigate to the lists page instead of directly selecting a list
    navigate('/lists');
  };

  const toggleTheme = () => {
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Cartify</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label={settings.mode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {settings.mode === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings" className="flex items-center">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Small clock below settings button */}
      <div className="flex justify-center mt-2">
        <div className="text-sm font-medium text-muted-foreground">{currentTime}</div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center w-full max-w-2xl mx-auto px-4">
          {/* Shopping mode card */}
          <div 
            onClick={() => handleModeSelect('shopping')}
            className={`w-full md:w-1/2 max-w-xs cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg border p-6 flex flex-col items-center space-y-4 bg-white dark:bg-slate-800 hover:bg-${settings.shoppingAccentColor}-50 dark:hover:bg-${settings.shoppingAccentColor}-950/20`}
          >
            <div className={`p-6 rounded-full bg-${settings.shoppingAccentColor}-100 dark:bg-${settings.shoppingAccentColor}-900/20`}>
              <ShoppingCart 
                className={`h-16 w-16 text-${settings.shoppingAccentColor}-500`} 
              />
            </div>
            <h2 className="text-xl font-semibold">Compras</h2>
            <p className="text-center text-muted-foreground">Crie e gerencie suas listas de compras</p>
          </div>

          {/* Tasks mode card */}
          <div 
            onClick={() => handleModeSelect('tasks')}
            className={`w-full md:w-1/2 max-w-xs cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-xl shadow-lg border p-6 flex flex-col items-center space-y-4 bg-white dark:bg-slate-800 hover:bg-${settings.tasksAccentColor}-50 dark:hover:bg-${settings.tasksAccentColor}-950/20`}
          >
            <div className={`p-6 rounded-full bg-${settings.tasksAccentColor}-100 dark:bg-${settings.tasksAccentColor}-900/20`}>
              <CheckSquare 
                className={`h-16 w-16 text-${settings.tasksAccentColor}-500`} 
              />
            </div>
            <h2 className="text-xl font-semibold">Tarefas</h2>
            <p className="text-center text-muted-foreground">Organize suas tarefas diárias</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
