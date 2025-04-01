import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, ArrowLeft, Share2, Search, ShoppingBag, LayoutList, 
  ShoppingBasket, Check, CalendarClock, Clock, CheckSquare
} from 'lucide-react';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ShoppingListItem from './ShoppingListItem';
import TaskListItem from './TaskListItem';
import AddEditItemDialog from './AddEditItemDialog';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingItem, AppMode } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppMode } from '@/contexts/AppModeContext';

interface ShoppingListViewProps {
  onBackToLists: () => void;
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ onBackToLists }) => {
  const { activeListId, getActiveList, calculateTotalPrice, setActiveListId } = useShoppingList();
  const [searchTerm, setSearchTerm] = useState('');
  const [addEditItemDialogOpen, setAddEditItemDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ShoppingItem | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { mode } = useAppMode();
  
  const isMobile = useIsMobile();
  const activeList = getActiveList();
  
  const totalPrice = activeList ? calculateTotalPrice(activeList.id) : 0;

  if (!activeList) {
    return (
      <div className="text-center py-12">
        <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-xl font-medium">Nenhuma lista selecionada</h3>
        <Button onClick={onBackToLists} className="mt-4">
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
    setAddEditItemDialogOpen(true);
  };

  const handleEditItem = (item: ShoppingItem) => {
    setItemToEdit(item);
    setAddEditItemDialogOpen(true);
  };

  const filteredItems = activeList.items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToLists} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">{activeList.name}</h2>
            <p className="text-muted-foreground">
              {pendingItems.length} pendentes • {completedItems.length} concluídos
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {mode === 'shopping' ? (
        <div className="bg-card border rounded-lg p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Valor Total Estimado</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalPrice)}</p>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className="text-2xl font-semibold">
              {completedItems.length > 0 
                ? Math.round((completedItems.length / filteredItems.length) * 100)
                : 0}%
            </p>
          </div>
          <Button onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Tarefa
          </Button>
        </div>
      )}

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all" className="flex items-center">
              <LayoutList className="mr-2 h-4 w-4" />
              Todos ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              {mode === 'shopping' ? (
                <ShoppingBag className="mr-2 h-4 w-4" />
              ) : (
                <Clock className="mr-2 h-4 w-4" />
              )}
              Pendentes ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Concluídos ({completedItems.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {itemsToDisplay.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
          {mode === 'shopping' ? (
            <ShoppingBasket className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          ) : (
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
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
              <Button onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar {mode === 'shopping' ? 'Item' : 'Tarefa'}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {itemsToDisplay.map(item => (
            mode === 'shopping' ? (
              <ShoppingListItem 
                key={item.id} 
                item={item as ShoppingItem} 
                listId={activeList.id}
                onEdit={handleEditItem}
              />
            ) : (
              <TaskListItem 
                key={item.id}
                item={item as any} // Will be properly typed after full implementation
                listId={activeList.id}
                onEdit={() => {}} // Will implement task edit functionality
              />
            )
          ))}
        </div>
      )}

      <AddEditItemDialog
        open={addEditItemDialogOpen}
        onOpenChange={setAddEditItemDialogOpen}
        listId={activeListId}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};

export default ShoppingListView;
