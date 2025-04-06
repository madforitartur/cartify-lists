
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

  const toggleTheme = () => {
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
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Início</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings" className="flex items-center">
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
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
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
