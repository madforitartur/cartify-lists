
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingListProvider } from '@/contexts/ShoppingListContext';
import ListSelector from '@/components/ListSelector';
import ShoppingListView from '@/components/ShoppingListView';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Github } from 'lucide-react';
import { useActiveListNavigation } from '@/hooks/use-active-list-navigation';

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
  
  // This hook handles the navigation on mobile when an active list is selected
  useActiveListNavigation(showLists, setShowLists);
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Cartify</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
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
      </header>
      
      <main className="max-w-7xl mx-auto">
        {isMobile ? (
          // Mobile layout - Show either lists or active list
          showLists ? (
            <ListSelector />
          ) : (
            <ShoppingListView onBackToLists={() => setShowLists(true)} />
          )
        ) : (
          // Desktop layout - Side by side
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 border-r min-h-[calc(100vh-65px)] p-4">
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
