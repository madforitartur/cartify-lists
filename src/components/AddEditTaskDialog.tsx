import React, { useEffect, useState } from 'react';
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingItem, TaskItem, Priority, TaskCategory } from '@/types';
import { useShoppingList } from '@/contexts/ShoppingListContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

interface AddEditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string | null;
  itemToEdit?: ShoppingItem;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
];

const CATEGORIES: { value: TaskCategory; label: string }[] = [
  { value: 'general', label: 'Geral' },
  { value: 'work', label: 'Trabalho' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'health', label: 'Saúde' },
  { value: 'education', label: 'Educação' },
  { value: 'home', label: 'Casa' },
];

const AddEditTaskDialog: React.FC<AddEditTaskDialogProps> = ({ 
  open, 
  onOpenChange,
  listId,
  itemToEdit
}) => {
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    priority: 'medium' as Priority,
    category: 'general' as TaskCategory,
    dueDate: undefined as Date | undefined,
  });
  
  const { addItem, updateItem } = useShoppingList();
  const isEditMode = !!itemToEdit;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && itemToEdit) {
      // Cast to TaskItem to access task-specific fields
      const taskItem = itemToEdit as unknown as TaskItem;
      setFormState({
        name: itemToEdit.name,
        description: taskItem.description || '',
        priority: taskItem.priority || 'medium',
        category: taskItem.category as TaskCategory || 'general',
        dueDate: taskItem.dueDate ? new Date(taskItem.dueDate) : undefined,
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormState({
        name: '',
        description: '',
        priority: 'medium',
        category: 'general',
        dueDate: undefined,
      });
    }
  }, [open, itemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormState(prev => ({
      ...prev,
      dueDate: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name.trim() || !listId) return;
    
    const taskData = {
      name: formState.name.trim(),
      description: formState.description,
      priority: formState.priority,
      category: formState.category,
      dueDate: formState.dueDate,
      // Keep original properties required by ShoppingItem
      quantity: 1,
      unit: 'un',
      price: 0,
      completed: isEditMode ? (itemToEdit?.completed || false) : false
    };
    
    if (isEditMode && itemToEdit) {
      updateItem(listId, itemToEdit.id, taskData);
    } else {
      addItem(listId, taskData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`sm:max-w-[500px] ${isMobile ? 'top-[5%] translate-y-0' : ''}`}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-orange-600">
              {isEditMode ? 'Editar Tarefa' : 'Adicionar Tarefa'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-name" className="text-right">
                Nome
              </Label>
              <Input
                id="task-name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: Enviar email para equipe"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="task-description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Detalhes adicionais sobre a tarefa..."
                className="col-span-3 resize-none min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">
                Prioridade
              </Label>
              <Select
                value={formState.priority}
                onValueChange={value => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-category" className="text-right">
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
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Prazo
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formState.dueDate ? (
                        format(formState.dueDate, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formState.dueDate}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
            <Button 
              type="submit" 
              disabled={!formState.name.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isEditMode ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTaskDialog;
