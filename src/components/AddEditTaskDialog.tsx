
import React, { useEffect, useState } from 'react';
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingItem, TaskItem, Priority, TaskCategory } from '@/types';
import { useShoppingList } from '@/contexts/shopping-list';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';

interface AddEditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string | null;
  itemToEdit?: ShoppingItem | TaskItem;
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
      // Check if it's a TaskItem by checking for the priority property
      if ('priority' in itemToEdit) {
        const taskItem = itemToEdit as TaskItem;
        setFormState({
          name: itemToEdit.name,
          description: taskItem.description || '',
          priority: taskItem.priority,
          category: taskItem.category,
          dueDate: taskItem.dueDate ? new Date(taskItem.dueDate) : undefined,
        });
      } else {
        // Handle case where a ShoppingItem is being edited as a TaskItem
        setFormState({
          name: itemToEdit.name,
          description: '',
          priority: 'medium',
          category: 'general',
          dueDate: undefined,
        });
      }
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
    
    const taskData: Omit<TaskItem, 'id'> = {
      name: formState.name.trim(),
      description: formState.description,
      priority: formState.priority,
      category: formState.category as TaskCategory,
      dueDate: formState.dueDate,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] flex flex-col p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader className="border-b p-4 sticky top-0 bg-background z-10">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-center w-full text-orange-600 text-xl">
              {isEditMode ? 'Editar Tarefa' : 'Adicionar Tarefa'}
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
          <form id="taskForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="task-name" className="text-base font-medium">
                Nome
              </Label>
              <Input
                id="task-name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Ex: Enviar email para equipe"
                className="border-purple-300 focus:border-purple-500"
                autoFocus
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="task-description" className="text-base font-medium">
                Descrição
              </Label>
              <Textarea
                id="task-description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                placeholder="Detalhes adicionais sobre a tarefa..."
                className="resize-none min-h-[100px] border-purple-300 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="task-priority" className="text-base font-medium">
                Prioridade
              </Label>
              <Select
                value={formState.priority}
                onValueChange={value => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="w-full border-purple-300 focus:border-purple-500">
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
            
            <div className="space-y-3">
              <Label htmlFor="task-category" className="text-base font-medium">
                Categoria
              </Label>
              <Select
                value={formState.category}
                onValueChange={value => handleSelectChange('category', value)}
              >
                <SelectTrigger className="w-full border-purple-300 focus:border-purple-500">
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
            
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Prazo
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-purple-300 focus:border-purple-500"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.dueDate ? (
                      format(formState.dueDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={formState.dueDate}
                    onSelect={handleDateChange}
                    initialFocus
                    className="z-50"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>
        
        <SheetFooter className="flex flex-col gap-2 p-4 mt-auto border-t">
          <Button 
            type="submit" 
            form="taskForm"
            disabled={!formState.name.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base"
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

export default AddEditTaskDialog;
