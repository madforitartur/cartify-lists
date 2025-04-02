
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { ShoppingList } from '@/types';

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
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBackToLists} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">{activeList.name}</h2>
          <p className="text-muted-foreground">
            {pendingItems} pendentes • {completedItems} concluídos
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ListViewHeader;
