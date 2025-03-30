
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingList } from '@/types';
import { useShoppingList } from '@/contexts/ShoppingListContext';

interface AddEditListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listToEdit?: ShoppingList;
}

const AddEditListDialog: React.FC<AddEditListDialogProps> = ({ 
  open, 
  onOpenChange,
  listToEdit
}) => {
  const [listName, setListName] = React.useState(listToEdit?.name || '');
  const { createList, updateList } = useShoppingList();
  const isEditMode = !!listToEdit;

  React.useEffect(() => {
    if (open && listToEdit) {
      setListName(listToEdit.name);
    } else if (!open) {
      // Reset form when dialog closes
      setListName('');
    }
  }, [open, listToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listName.trim()) return;
    
    if (isEditMode && listToEdit) {
      updateList(listToEdit.id, listName.trim());
    } else {
      createList(listName.trim());
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Lista' : 'Nova Lista de Compras'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="list-name" className="text-right">
                Nome
              </Label>
              <Input
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Compras da Semana"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!listName.trim()}>
              {isEditMode ? 'Salvar' : 'Criar Lista'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditListDialog;
