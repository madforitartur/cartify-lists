
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, CheckSquare, ShoppingCart } from 'lucide-react';
import { ShoppingList } from '@/types';
import { useAppMode } from '@/contexts/AppModeContext';

interface ListViewHeaderProps {
  activeList: ShoppingList;
  pendingItems: number;
  completedItems: number;
  handleBackToLists: () => void;
}

const ListViewHeader: React.FC<ListViewHeaderProps> = ({
  activeList,
  pendingItems,
  completedItems,
  handleBackToLists
}) => {
  const { mode } = useAppMode();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToLists} 
          className={`mr-2 ${mode === 'tasks' ? 'text-orange-500 hover:text-orange-600' : ''}`}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          {mode === 'tasks' ? (
            <CheckSquare className="h-5 w-5 text-orange-500 mr-2" />
          ) : (
            <ShoppingCart className="h-5 w-5 text-primary mr-2" />
          )}
          <div>
            <h2 className={`text-2xl font-semibold ${mode === 'tasks' ? 'text-orange-500' : ''}`}>
              {activeList.name}
            </h2>
            <p className="text-muted-foreground">
              {pendingItems} pendentes • {completedItems} concluídos
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          className={mode === 'tasks' ? 'text-orange-500 hover:text-orange-600' : ''}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ListViewHeader;
