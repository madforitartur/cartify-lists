
import React from 'react';
import { ShoppingItem, Category } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { CATEGORIES } from '@/utils/categories';
import { useShoppingList } from '@/contexts/shopping-list';

interface ShoppingListItemProps {
  item: ShoppingItem;
  listId: string;
  onEdit: (item: ShoppingItem) => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, listId, onEdit }) => {
  const { toggleItemCompletion, deleteItem } = useShoppingList();
  const category = CATEGORIES[item.category];

  return (
    <div className={`flex items-center p-3 rounded-md border mb-2 transition-all ${item.completed ? 'bg-muted/50 opacity-70' : 'bg-card'}`}>
      <Checkbox 
        id={`item-${item.id}`}
        checked={item.completed}
        onCheckedChange={() => toggleItemCompletion(listId, item.id)}
        className="mr-3"
      />
      
      <div className="flex-1 flex flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <label 
              htmlFor={`item-${item.id}`}
              className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {item.name}
            </label>
            <span className={`ml-2 category-badge ${category.className} text-xs px-2 py-0.5`}>
              {category.label}
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <span>{item.quantity} {item.unit}</span>
            <span className="mx-2">•</span>
            <span>{formatCurrency(item.price)} / {item.unit}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 md:mt-0">
          <div className="font-medium mr-4">
            {formatCurrency(item.price * item.quantity)}
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(listId, item.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListItem;
