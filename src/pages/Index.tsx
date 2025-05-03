
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingListProvider } from '@/contexts/shopping-list';
import ListSelector from '@/components/ListSelector';
import ShoppingListView from '@/components/ShoppingListView';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Github, Settings as SettingsIcon, Home, Sun, Moon } from 'lucide-react';
import { useActiveListNavigation } from '@/hooks/use-active-list-navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const isMobile = useIsMobile();
  const [showLists, setShowLists] = useState(true);
  
  // Efeito para configurar a aplicação em modo tela cheia quando em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      // Define meta tags para comportamento de tela cheia e controle do teclado virtual
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Adiciona listeners para controlar quando o teclado deve aparecer
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          // Permite que o teclado apareça quando um campo é focado
          if (metaViewport) {
            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
          }
        });
        
        input.addEventListener('blur', () => {
          // Restaura o comportamento de tela cheia quando o campo perde o foco
          if (metaViewport) {
            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          }
        });
      });
      
      // Tenta entrar em modo tela cheia em navegadores que suportam
      const requestFullscreen = () => {
        try {
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported');
        }
      };
      
      // Tenta ativar tela cheia quando o usuário interage com a página
      document.addEventListener('touchstart', function onFirstTouch() {
        requestFullscreen();
        document.removeEventListener('touchstart', onFirstTouch);
      }, { once: true });
    }
  }, [isMobile]);
  
  return (
    <ShoppingListProvider>
      <AppContent showLists={showLists} setShowLists={setShowLists} />
    </ShoppingListProvider>
  );
};

const AppContent: React.FC<{
  showLists: boolean;
  setShowLists: (show: boolean) => void;
}> = ({ showLists, setShowLists }) => {
  const isMobile = useIsMobile();
  const { settings, setMode } = useTheme();
  
  // This hook handles the navigation on mobile when an active list is selected
  useActiveListNavigation(showLists, setShowLists);
  
  // Add click handler to prevent event propagation issues
  const handleContentClick = (e: React.MouseEvent) => {
    // This helps prevent clicks from propagating up to parent elements
    e.stopPropagation();
  };

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 dark:text-white flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
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
              <Link to="/" className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Início</span>
              </Link>
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
      
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col" onClick={handleContentClick}>
        {isMobile ? (
          // Mobile layout - Show either lists or active list
          showLists ? (
            <ListSelector />
          ) : (
            <ShoppingListView onBackToLists={() => setShowLists(true)} />
          )
        ) : (
          // Desktop layout - Side by side
          <div className="flex flex-1">
            <div className="w-full md:w-1/3 border-r min-h-[calc(100vh-65px)] p-4 dark:border-slate-700">
              <ListSelector />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <ShoppingListView onBackToLists={() => {}} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
