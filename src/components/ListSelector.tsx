
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import { useShoppingList } from '@/contexts/shopping-list';
import ListSelectorCard from './ListSelectorCard';
import AddEditListDialog from './AddEditListDialog';

const ListSelector: React.FC = () => {
  const { lists, activeListId, setActiveListId } = useShoppingList();
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

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <ShoppingCart className="mr-2 text-primary" />
          Minhas Listas
        </h2>
        <Button onClick={handleCreateNewList}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">Nenhuma lista criada</h3>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira lista de compras para começar
          </p>
          <Button onClick={handleCreateNewList}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Lista
          </Button>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {lists.map(list => (
            <ListSelectorCard
              key={list.id}
              list={list}
              isActive={list.id === activeListId}
              onEdit={() => handleEditList(list.id)}
            />
          ))}
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
