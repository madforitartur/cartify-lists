
import React from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ShoppingCart, CheckSquare } from 'lucide-react';

const AppModeToggle: React.FC = () => {
  const { mode, setMode } = useAppMode();
  
  return (
    <div className="mb-6">
      <ToggleGroup 
        type="single" 
        value={mode} 
        onValueChange={(value) => {
          if (value) setMode(value as 'shopping' | 'tasks');
        }}
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
