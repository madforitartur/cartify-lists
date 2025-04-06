
import React from 'react';
import { TaskItem, Priority, TaskCategory } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Flag, CalendarClock } from 'lucide-react';
import { useShoppingList } from '@/contexts/shopping-list';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskListItemProps {
  item: TaskItem;
  listId: string;
  onEdit: (item: TaskItem) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'low': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityLabel = (priority: Priority) => {
  switch (priority) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    case 'critical': return 'Crítica';
    default: return 'Padrão';
  }
};

const getCategoryLabel = (category: TaskCategory) => {
  switch (category) {
    case 'work': return 'Trabalho';
    case 'personal': return 'Pessoal';
    case 'health': return 'Saúde';
    case 'education': return 'Educação';
    case 'home': return 'Casa';
    case 'general': return 'Geral';
    default: return 'Geral';
  }
};

const TaskListItem: React.FC<TaskListItemProps> = ({ item, listId, onEdit }) => {
  const { toggleItemCompletion, deleteItem } = useShoppingList();
  const priorityClass = getPriorityColor(item.priority);
  const formattedDueDate = item.dueDate ? 
    format(new Date(item.dueDate), "d 'de' MMMM", { locale: ptBR }) : 
    'Sem prazo';

  return (
    <div className={`flex items-center p-3 rounded-md border mb-2 transition-all ${item.completed ? 'bg-muted/50 opacity-70' : 'bg-card'}`}>
      <Checkbox 
        id={`task-${item.id}`}
        checked={item.completed}
        onCheckedChange={() => toggleItemCompletion(listId, item.id)}
        className="mr-3"
      />
      
      <div className="flex-1 flex flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <label 
              htmlFor={`task-${item.id}`}
              className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}
            >
              {item.name}
            </label>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${priorityClass}`}>
              {getPriorityLabel(item.priority)}
            </span>
            <span className="ml-2 category-badge bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
              {getCategoryLabel(item.category)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>{formattedDueDate}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-2 md:mt-0">
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(listId, item.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;
