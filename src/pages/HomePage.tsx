
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckSquare, Github, Settings as SettingsIcon, Sun, Moon, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const HomePage = () => {
  const { settings, setMode } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erro ao alternar fullscreen:', error);
    }
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleFullscreen}
              className="mr-2"
              aria-label={isFullscreen ? 'Sair do modo tela cheia' : 'Entrar no modo tela cheia'}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Cartify</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="hidden sm:flex"
              aria-label={settings.mode === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {settings.mode === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings" className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <SettingsIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Configurações</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <a 
                href="https://github.com/your-username/cartify" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/lists" className="group relative rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:border-slate-800">
            <div className="p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Listas de Compras</h3>
                <p className="text-sm text-muted-foreground">Gerencie suas listas de compras de forma eficiente.</p>
              </div>
              <ShoppingCart className="absolute bottom-2 right-2 h-16 w-16 opacity-20 group-hover:opacity-30 transition-opacity" />
            </div>
            <Button variant="link" className="absolute bottom-4 right-4">
              Acessar <span aria-hidden="true">→</span>
            </Button>
          </Link>

          <Link to="/tasks" className="group relative rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 dark:border-slate-800">
            <div className="p-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Listas de Tarefas</h3>
                <p className="text-sm text-muted-foreground">Organize suas tarefas diárias e mantenha-se produtivo.</p>
              </div>
              <CheckSquare className="absolute bottom-2 right-2 h-16 w-16 opacity-20 group-hover:opacity-30 transition-opacity" />
            </div>
            <Button variant="link" className="absolute bottom-4 right-4">
              Acessar <span aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
