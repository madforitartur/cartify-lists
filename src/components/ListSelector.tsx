
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, CheckSquare } from 'lucide-react';
import { useShoppingList } from '@/contexts/shopping-list';
import ListSelectorCard from './ListSelectorCard';
import AddEditListDialog from './AddEditListDialog';
import { useAppMode } from '@/contexts/AppModeContext';
import { ShoppingList } from '@/types';

const ListSelector: React.FC = () => {
  const { lists, activeListId, setActiveListId, getFilteredLists } = useShoppingList();
  const { mode } = useAppMode();
  const [addEditDialogOpen, setAddEditDialogOpen] = React.useState(false);
  const [listToEdit, setListToEdit] = React.useState<string | null>(null);

  const handleEditList = (listId: string) => {
    setListToEdit(listId);
    setAddEditDialogOpen(true);
  };

  const handleAddEditDialogClose = () => {
    setListToEdit(null);
    setAddEditDialogOpen(false);
  };

  const handleCreateNewList = () => {
    // Clear the active list selection when creating a new list
    setActiveListId(null);
    setAddEditDialogOpen(true);
  };

  const getListToEdit = () => {
    if (!listToEdit) return undefined;
    return lists.find(list => list.id === listToEdit);
  };

  // Get all lists sorted by updatedAt (most recent first)
  const sortedLists = [...lists].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });
  
  // Get filtered lists based on active mode
  const filteredLists = getFilteredLists();

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          {mode === 'shopping' ? (
            <ShoppingCart className="mr-2 text-primary" />
          ) : (
            <CheckSquare className="mr-2 text-orange-500" />
          )}
          Minhas Listas
        </h2>
        <Button 
          onClick={handleCreateNewList}
          className={mode === 'tasks' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          {mode === 'shopping' ? (
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          ) : (
            <CheckSquare className="mx-auto h-12 w-12 text-orange-500 mb-3" />
          )}
          <h3 className="text-lg font-medium">Nenhuma lista criada</h3>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira lista de {mode === 'shopping' ? 'compras' : 'tarefas'} para começar
          </p>
          <Button 
            onClick={handleCreateNewList}
            className={mode === 'tasks' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Lista
          </Button>
        </div>
      ) : (
        <div>
          {/* Show lists based on active mode */}
          <div className="space-y-3 animate-fade-in">
            {filteredLists.map(list => (
              <ListSelectorCard
                key={list.id}
                list={list}
                isActive={list.id === activeListId}
                onEdit={() => handleEditList(list.id)}
              />
            ))}
          </div>

          {/* Show "Todas as Listas" section if in either mode */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <span>Todas as Listas</span>
              <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {lists.length}
              </span>
            </h3>
            <div className="space-y-3 animate-fade-in">
              {sortedLists.map(list => (
                <ListSelectorCard
                  key={list.id}
                  list={list}
                  isActive={list.id === activeListId}
                  onEdit={() => handleEditList(list.id)}
                  showType
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <AddEditListDialog
        open={addEditDialogOpen}
        onOpenChange={handleAddEditDialogClose}
        listToEdit={getListToEdit()}
      />
    </div>
  );
};

export default ListSelector;
