
import React, { useEffect } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ShoppingCart, CheckSquare } from 'lucide-react';

const AppModeToggle: React.FC = () => {
  const { mode, setMode } = useAppMode();
  const { lists, setActiveListId } = useShoppingList();
  
  // When mode changes, update the active list
  useEffect(() => {
    const listsOfCurrentMode = lists.filter(list => list.listType === mode);
    if (listsOfCurrentMode.length > 0) {
      setActiveListId(listsOfCurrentMode[0].id);
    } else {
      setActiveListId(null);
    }
  }, [mode, lists]);

  const handleModeChange = (value: string) => {
    if (value) {
      setMode(value as 'shopping' | 'tasks');
    }
  };
  
  return (
    <div className="mb-6">
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={handleModeChange}
        className="border rounded-full p-1 w-full max-w-xs mx-auto"
      >
        <ToggleGroupItem 
          value="shopping" 
          aria-label="Modo Compras"
          className="flex-1 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Compras
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="tasks" 
          aria-label="Modo Tarefas"
          className="flex-1 rounded-full data-[state=on]:bg-orange-500 data-[state=on]:text-white"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Tarefas
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default AppModeToggle;
