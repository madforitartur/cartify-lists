
import React, { useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
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
import { useShoppingList } from '@/contexts/shopping-list';
import { getCategoryOptions, CATEGORIES } from '@/utils/categories';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppMode } from '@/contexts/AppModeContext';
import AddEditTaskDialog from './AddEditTaskDialog';
import { X } from 'lucide-react';

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
  // First, determine which mode we're in
  const { mode: contextMode } = useAppMode();
  // Use the mode from props if provided, otherwise use the context mode
  const mode = propMode || contextMode;

  // If we're in task mode, render the task dialog instead
  // IMPORTANT: This check must be AFTER all hook calls to satisfy React's Rules of Hooks
  // We need to define all hooks here first, regardless of which UI gets rendered
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

  useEffect(() => {
    if (open && itemToEdit) {
      setFormState({
        name: itemToEdit.name,
        quantity: itemToEdit.quantity,
        unit: itemToEdit.unit,
        price: itemToEdit.price,
        category: itemToEdit.category as Category
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

  // Conditional return AFTER all hooks are defined
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] flex flex-col p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader className="border-b p-4 sticky top-0 bg-background z-10">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-center w-full text-xl">
              {isEditMode ? 'Editar Item' : 'Adicionar Item'}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          <form id="itemForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="item-name" className="text-base font-medium">
                Nome
              </Label>
              <Input
                id="item-name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="border-primary focus:border-primary"
                placeholder="Ex: Maçã"
                autoFocus
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="item-category" className="text-base font-medium">
                Categoria
              </Label>
              <Select
                value={formState.category}
                onValueChange={value => handleSelectChange('category', value)}
              >
                <SelectTrigger className="w-full border-primary focus:border-primary">
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
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="item-quantity" className="text-base font-medium">
                  Quantidade
                </Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="item-unit" className="text-base font-medium">
                    Unidade
                  </Label>
                  <Select
                    value={formState.unit}
                    onValueChange={value => handleSelectChange('unit', value)}
                  >
                    <SelectTrigger className="w-24 border-primary focus:border-primary">
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
              </div>
              <div className="flex items-center">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-r-none"
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
                  className="h-10 rounded-none text-center border-x-0"
                  style={{ width: '100%' }}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-l-none"
                  onClick={incrementQuantity}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="item-price" className="text-base font-medium">
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
                className="border-primary focus:border-primary"
                placeholder="0,00"
              />
            </div>
          </form>
        </div>
        
        <SheetFooter className="flex flex-col gap-2 p-4 mt-auto border-t">
          <Button 
            type="submit" 
            form="itemForm"
            disabled={!formState.name.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 h-12 text-base"
          >
            {isEditMode ? 'Atualizar' : 'Adicionar'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full h-12 text-base"
          >
            Cancelar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditItemDialog;
