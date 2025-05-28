
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Maximize, Minimize } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const SettingsHeader = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functionality
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

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

  return (
    <header className="bg-white dark:bg-slate-800 border-b py-4 px-4 sm:px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="mr-2"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/" className="flex items-center">
            <Home className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Início</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default SettingsHeader;
