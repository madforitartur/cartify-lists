import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, ShoppingBag, LayoutList, 
  ShoppingBasket, Check, CheckSquare
} from 'lucide-react';
import { useShoppingList } from '@/contexts/shopping-list';
import { useIsMobile } from '@/hooks/use-mobile';
import ShoppingListItem from './ShoppingListItem';
import TaskListItem from './TaskListItem';
import AddEditItemDialog from './AddEditItemDialog';
import AddEditTaskDialog from './AddEditTaskDialog';
import { ShoppingItem, TaskItem } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppMode } from '@/contexts/AppModeContext';
import ListViewHeader from './ListViewHeader';
import ListViewSummary from './ListViewSummary';
import { useTheme } from '@/contexts/ThemeContext';

interface ShoppingListViewProps {
  onBackToLists: () => void;
}

// Type guard to check if an item is a TaskItem
const isTaskItem = (item: ShoppingItem | TaskItem | undefined | null): item is TaskItem => {
  return item !== undefined && item !== null && 'priority' in item;
};

// Type guard to check if an item is a ShoppingItem
const isShoppingItem = (item: ShoppingItem | TaskItem | undefined | null): item is ShoppingItem => {
  return item !== undefined && item !== null && 'category' in item && !('priority' in item);
};

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ onBackToLists }) => {
  const { activeListId, getActiveList, calculateTotalPrice, setActiveListId } = useShoppingList();
  const [searchTerm, setSearchTerm] = useState('');
  const [addEditItemDialogOpen, setAddEditItemDialogOpen] = useState(false);
  const [addEditTaskDialogOpen, setAddEditTaskDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingItem | TaskItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { mode } = useAppMode();
  const { getAccentColorClass } = useTheme();
  
  const isMobile = useIsMobile();
  const activeList = getActiveList();
  
  const totalPrice = activeList ? calculateTotalPrice(activeList.id) : 0;

  if (!activeList) {
    return (
      <div className="text-center py-12">
        {mode === 'shopping' ? (
          <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        ) : (
          <CheckSquare className="mx-auto h-12 w-12 text-orange-500 mb-3" />
        )}
        <h3 className="text-xl font-medium">Nenhuma lista selecionada</h3>
        <Button 
          onClick={onBackToLists} 
          className={mode === 'tasks' ? 'mt-4 bg-orange-500 hover:bg-orange-600' : 'mt-4'}
        >
          Voltar para Listas
        </Button>
      </div>
    );
  }

  const handleBackToLists = () => {
    setActiveListId(null);
    onBackToLists();
  };

  const handleAddItem = () => {
    setItemToEdit(undefined);
    if (mode === 'shopping') {
      setAddEditItemDialogOpen(true);
    } else {
      setAddEditTaskDialogOpen(true);
    }
  };

  const handleEditItem = (item: ShoppingItem | TaskItem) => {
    setItemToEdit(item);
    if (isShoppingItem(item) && mode === 'shopping') {
      setAddEditItemDialogOpen(true);
    } else if (isTaskItem(item) && mode === 'tasks') {
      setAddEditTaskDialogOpen(true);
    }
  };

  const filteredItems = activeList?.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const pendingItems = filteredItems.filter(item => !item.completed);
  const completedItems = filteredItems.filter(item => item.completed);

  const getItemsToDisplay = () => {
    switch (activeTab) {
      case 'pending':
        return pendingItems;
      case 'completed':
        return completedItems;
      default:
        return filteredItems;
    }
  };

  const itemsToDisplay = getItemsToDisplay();

  const handleItemClick = (e: React.MouseEvent, item: ShoppingItem | TaskItem) => {
    e.stopPropagation();
    handleEditItem(item);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <ListViewHeader 
        activeList={activeList}
        pendingItems={pendingItems.length}
        completedItems={completedItems.length}
        handleBackToLists={handleBackToLists}
      />
      
      <ListViewSummary 
        mode={mode}
        totalPrice={totalPrice}
        handleAddItem={handleAddItem}
      />

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={mode === 'shopping' ? "Buscar itens..." : "Buscar tarefas..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid grid-cols-3 mb-4 ${mode === 'tasks' ? `bg-opacity-10 ${getAccentColorClass(mode, 'bg')}` : ''}`}>
            <TabsTrigger 
              value="all" 
              className={`flex items-center ${mode === 'tasks' ? `data-[state=active]:bg-opacity-10 data-[state=active]:${getAccentColorClass(mode, 'bg')} data-[state=active]:${getAccentColorClass(mode, 'text')}` : ''}`}
            >
              <LayoutList className="mr-2 h-4 w-4" />
              Todos ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className={`flex items-center ${mode === 'tasks' ? `data-[state=active]:bg-opacity-10 data-[state=active]:${getAccentColorClass(mode, 'bg')} data-[state=active]:${getAccentColorClass(mode, 'text')}` : ''}`}
            >
              {mode === 'shopping' ? (
                <ShoppingBag className="mr-2 h-4 w-4" />
              ) : (
                <CheckSquare className={`mr-2 h-4 w-4 ${getAccentColorClass(mode, 'text')}`} />
              )}
              Pendentes ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className={`flex items-center ${mode === 'tasks' ? `data-[state=active]:bg-opacity-10 data-[state=active]:${getAccentColorClass(mode, 'bg')} data-[state=active]:${getAccentColorClass(mode, 'text')}` : ''}`}
            >
              <Check className="mr-2 h-4 w-4" />
              Concluídos ({completedItems.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {itemsToDisplay.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          {mode === 'shopping' ? (
            <ShoppingBasket className={`mx-auto h-12 w-12 ${getAccentColorClass('shopping', 'text')} mb-3`} />
          ) : (
            <CheckSquare className={`mx-auto h-12 w-12 ${getAccentColorClass('tasks', 'text')} mb-3`} />
          )}
          
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium">Nenhum {mode === 'shopping' ? 'item' : 'tarefa'} encontrado</h3>
              <p className="text-muted-foreground">
                Tente mudar os termos da busca
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium">Lista vazia</h3>
              <p className="text-muted-foreground mb-4">
                Adicione {mode === 'shopping' ? 'itens à sua lista de compras' : 'tarefas à sua lista'}
              </p>
              <Button 
                onClick={handleAddItem}
                className={getAccentColorClass(mode, 'bg')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar {mode === 'shopping' ? 'Item' : 'Tarefa'}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {itemsToDisplay.map(item => {
            if (mode === 'shopping' && isShoppingItem(item)) {
              return (
                <ShoppingListItem 
                  key={item.id} 
                  item={item}
                  listId={activeList.id}
                  onEdit={() => handleEditItem(item)}
                />
              );
            } else if (mode === 'tasks' && isTaskItem(item)) {
              return (
                <TaskListItem 
                  key={item.id}
                  item={item}
                  listId={activeList.id}
                  onEdit={() => handleEditItem(item)}
                />
              );
            }
            return null;
          })}
        </div>
      )}

      <AddEditItemDialog
        open={addEditItemDialogOpen}
        onOpenChange={setAddEditItemDialogOpen}
        listId={activeListId}
        itemToEdit={isShoppingItem(itemToEdit as any) ? itemToEdit as ShoppingItem : undefined}
        mode={mode}
      />
      
      <AddEditTaskDialog
        open={addEditTaskDialogOpen}
        onOpenChange={setAddEditTaskDialogOpen}
        listId={activeListId}
        itemToEdit={isTaskItem(itemToEdit as any) ? itemToEdit as TaskItem : undefined}
      />
    </div>
  );
};

export default ShoppingListView;
