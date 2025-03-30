
import React from 'react';
import { ShoppingList } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBasket, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';
import { useShoppingList } from '@/contexts/ShoppingListContext';

interface ListSelectorCardProps {
  list: ShoppingList;
  isActive: boolean;
  onEdit: () => void;
}

const ListSelectorCard: React.FC<ListSelectorCardProps> = ({ list, isActive, onEdit }) => {
  const { setActiveListId, deleteList, calculateTotalPrice } = useShoppingList();
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.completed).length;
  const totalPrice = calculateTotalPrice(list.id);

  return (
    <Card 
      className={`cursor-pointer mb-3 card-hover ${isActive ? 'border-primary border-2' : ''}`}
      onClick={() => setActiveListId(list.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <ShoppingBasket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{list.name}</h3>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <span>{completedItems}/{totalItems} itens</span>
                <span className="mx-2">•</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { 
              e.stopPropagation(); 
              onEdit();
            }}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                deleteList(list.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListSelectorCard;
