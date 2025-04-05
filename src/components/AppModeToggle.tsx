
import React, { useEffect } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { useShoppingList } from '@/contexts/shopping-list';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ShoppingCart, CheckSquare } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const AppModeToggle: React.FC = () => {
  const { mode, setMode } = useAppMode();
  const { lists, setActiveListId } = useShoppingList();
  const { getAccentColorClass, settings } = useTheme();
  
  // When mode changes, update the active list
  useEffect(() => {
    const listsOfCurrentMode = lists.filter(list => list.listType === mode);
    if (listsOfCurrentMode.length > 0) {
      setActiveListId(listsOfCurrentMode[0].id);
    } else {
      setActiveListId(null);
    }
  }, [mode, lists, setActiveListId]);

  const handleModeChange = (value: string) => {
    if (value) {
      setMode(value as 'shopping' | 'tasks');
    }
  };

  // Get the actual color classes directly from the theme settings
  const getButtonColorClass = (buttonMode: 'shopping' | 'tasks') => {
    const color = buttonMode === 'shopping' 
      ? settings.shoppingAccentColor 
      : settings.tasksAccentColor;
    
    return `bg-${color}-500 hover:bg-${color}-600 data-[state=on]:bg-${color}-500`;
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
          className={`flex-1 rounded-full ${getButtonColorClass('shopping')} data-[state=on]:text-white transition-colors data-[state=on]:shadow-sm`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Compras
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="tasks" 
          aria-label="Modo Tarefas"
          className={`flex-1 rounded-full ${getButtonColorClass('tasks')} data-[state=on]:text-white transition-colors data-[state=on]:shadow-sm`}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Tarefas
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default AppModeToggle;
