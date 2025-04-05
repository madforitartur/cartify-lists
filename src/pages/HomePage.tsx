
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppMode } from '@/contexts/AppModeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { settings } = useTheme();
  const { setMode } = useAppMode();

  const handleModeSelect = (selectedMode: 'shopping' | 'tasks') => {
    setMode(selectedMode);
    navigate('/lists');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Cartify</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center w-full max-w-2xl mx-auto px-4">
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
