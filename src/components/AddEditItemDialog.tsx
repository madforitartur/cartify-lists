
import React, { useEffect } from 'react';
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
import { ShoppingItem, Category, AppMode } from '@/types';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { getCategoryOptions, CATEGORIES } from '@/utils/categories';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppMode } from '@/contexts/AppModeContext';
import AddEditTaskDialog from './AddEditTaskDialog';

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string | null;
  itemToEdit?: ShoppingItem;
  mode?: AppMode;
}

const UNITS = ['un', 'kg', 'g', 'l', 'ml', 'pct'];

const AddEditItemDialog: React.FC<AddEditItemDialogProps> = ({ 
  open, 
  onOpenChange,
  listId,
  itemToEdit,
  mode: propMode
}) => {
  const [formState, setFormState] = React.useState({
    name: '',
    quantity: 1,
    unit: 'un',
    price: 0,
    category: 'default' as Category
  });
  
  // Estado separado para controlar o campo de preço como string para facilitar input vazio
  const [priceInput, setPriceInput] = React.useState('');

  const { addItem, updateItem } = useShoppingList();
  const isEditMode = !!itemToEdit;
  const categoryOptions = getCategoryOptions();
  const isMobile = useIsMobile();
  const { mode: contextMode } = useAppMode();
  
  // Use the mode from props if provided, otherwise use the context mode
  const mode = propMode || contextMode;

  useEffect(() => {
    if (open && itemToEdit) {
      setFormState({
        name: itemToEdit.name,
        quantity: itemToEdit.quantity,
        unit: itemToEdit.unit,
        price: itemToEdit.price,
        category: itemToEdit.category
      });
      // Apenas definir o priceInput se o preço for maior que zero
      setPriceInput(itemToEdit.price > 0 ? itemToEdit.price.toFixed(2) : '');
    } else if (!open) {
      // Reset form when dialog closes
      setFormState({
        name: '',
        quantity: 1,
        unit: 'un',
        price: 0,
        category: 'default' as Category
      });
      setPriceInput(''); // Resetar para vazio
    }
  }, [open, itemToEdit]);

  // Important: Move this conditional rendering to the return statement
  // to avoid breaking the Rules of Hooks
  if (mode === 'tasks') {
    return (
      <AddEditTaskDialog
        open={open}
        onOpenChange={onOpenChange}
        listId={listId}
        itemToEdit={itemToEdit}
      />
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setPriceInput(value);
      // Atualiza o formState.price apenas se tiver um valor válido
      setFormState(prev => ({
        ...prev,
        price: value ? parseFloat(value) : 0
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: name === 'quantity' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const incrementQuantity = () => {
    setFormState(prev => ({
      ...prev,
      quantity: prev.unit === 'un' ? Math.floor(prev.quantity + 1) : +(prev.quantity + 0.1).toFixed(2)
    }));
  };

  const decrementQuantity = () => {
    setFormState(prev => ({
      ...prev,
      quantity: prev.unit === 'un' 
        ? Math.max(1, Math.floor(prev.quantity - 1)) 
        : Math.max(0.1, +(prev.quantity - 0.1).toFixed(2))
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

  const getQuantityStep = () => {
    return formState.unit === 'un' ? "1" : "0.1";
  };

  const getQuantityMin = () => {
    return formState.unit === 'un' ? "1" : "0.1";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`sm:max-w-[500px] ${isMobile ? 'top-[5%] translate-y-0' : ''}`}
      >
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
              <div className="col-span-1 flex items-center">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementQuantity}
                >
                  -
                </Button>
                <Input
                  id="item-quantity"
                  name="quantity"
                  type="number"
                  min={getQuantityMin()}
                  step={getQuantityStep()}
                  value={formState.quantity}
                  onChange={handleChange}
                  className="h-8 rounded-none w-16 text-center"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementQuantity}
                >
                  +
                </Button>
              </div>
              
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
                Preço (€)
              </Label>
              <Input
                id="item-price"
                name="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={priceInput}
                onChange={handleChange}
                className="col-span-3"
                placeholder="0,00"
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
