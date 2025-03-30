
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingItem, Category } from '@/types';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { getCategoryOptions, CATEGORIES } from '@/utils/categories';

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string | null;
  itemToEdit?: ShoppingItem;
}

const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pct'];

const AddEditItemDialog: React.FC<AddEditItemDialogProps> = ({ 
  open, 
  onOpenChange,
  listId,
  itemToEdit
}) => {
  const [formState, setFormState] = React.useState({
    name: '',
    quantity: 1,
    unit: 'un',
    price: 0,
    category: 'default' as Category
  });

  const { addItem, updateItem } = useShoppingList();
  const isEditMode = !!itemToEdit;
  const categoryOptions = getCategoryOptions();

  React.useEffect(() => {
    if (open && itemToEdit) {
      setFormState({
        name: itemToEdit.name,
        quantity: itemToEdit.quantity,
        unit: itemToEdit.unit,
        price: itemToEdit.price,
        category: itemToEdit.category
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormState({
        name: '',
        quantity: 1,
        unit: 'un',
        price: 0,
        category: 'default' as Category
      });
    }
  }, [open, itemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name.trim() || !listId) return;
    
    if (isEditMode && itemToEdit) {
      updateItem(listId, itemToEdit.id, {
        name: formState.name.trim(),
        quantity: formState.quantity,
        unit: formState.unit,
        price: formState.price,
        category: formState.category
      });
    } else {
      addItem(listId, {
        name: formState.name.trim(),
        quantity: formState.quantity,
        unit: formState.unit,
        price: formState.price,
        category: formState.category,
        completed: false
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Item' : 'Adicionar Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Nome
              </Label>
              <Input
                id="item-name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Maçã"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-category" className="text-right">
                Categoria
              </Label>
              <Select
                value={formState.category}
                onValueChange={value => handleSelectChange('category', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-quantity" className="text-right">
                Quantidade
              </Label>
              <Input
                id="item-quantity"
                name="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={formState.quantity}
                onChange={handleChange}
                className="col-span-1"
              />
              
              <Label htmlFor="item-unit" className="text-right">
                Unidade
              </Label>
              <Select
                value={formState.unit}
                onValueChange={value => handleSelectChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-price" className="text-right">
                Preço (R$)
              </Label>
              <Input
                id="item-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formState.price}
                onChange={handleChange}
                className="col-span-3"
                placeholder="0.00"
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
            <Button type="submit" disabled={!formState.name.trim()}>
              {isEditMode ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemDialog;
