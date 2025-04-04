
import React, { useState } from 'react';
import { ShoppingList } from '@/types';
import { useShoppingList } from '@/contexts/shopping-list';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from '@/utils/formatters';
import { Check, MoreVertical, Pencil, Trash2, ShoppingCart, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

interface ListSelectorCardProps {
  list: ShoppingList;
  isActive: boolean;
  onEdit: () => void;
  showType?: boolean;
}

const ListSelectorCard = ({ list, isActive, onEdit, showType = false }: ListSelectorCardProps) => {
  const { setActiveListId, deleteList } = useShoppingList();
  const { getAccentColorClass } = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const handleSelect = () => {
    setActiveListId(list.id);
  };

  const handleDelete = () => {
    deleteList(list.id);
    setDeleteDialogOpen(false);
  };

  const handleCopyToClipboard = () => {
    // Create text from list items
    const itemsText = list.items
      .map(item => `- ${item.name} (${item.quantity} ${item.unit})`)
      .join('\n');
      
    const text = `Lista: ${list.name}\n\n${itemsText}`;
    
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Lista copiada para área de transferência');
    });
  };

  // Count completed and total items
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.completed).length;
  const isCompleteList = totalItems > 0 && completedItems === totalItems;

  return (
    <>
      <div
        className={`
          border rounded-lg p-4 cursor-pointer transition-all
          ${isActive ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-primary'}
          ${list.listType === 'tasks' ? getAccentColorClass('tasks', 'border') : ''}
        `}
        onClick={handleSelect}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {showType && (
                list.listType === 'shopping' ? (
                  <ShoppingCart 
                    className={`h-4 w-4 ${getAccentColorClass('shopping', 'text')}`}  
                  />
                ) : (
                  <CheckSquare 
                    className={`h-4 w-4 ${getAccentColorClass('tasks', 'text')}`} 
                  />
                )
              )}
              <h3 className="font-medium">{list.name}</h3>
              {isCompleteList && totalItems > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Concluída
                </span>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-1">
              <span>{formatDate(list.updatedAt)}</span>
              <span className="mx-1">•</span>
              <span>
                {completedItems}/{totalItems} {list.listType === 'shopping' ? 'itens' : 'tarefas'}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleCopyToClipboard();
              }}>
                <Check className="mr-2 h-4 w-4" />
                Copiar para área de transferência
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {totalItems > 0 && (
          <div className="mt-2">
            <div className="bg-muted h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  list.listType === 'shopping' 
                    ? getAccentColorClass('shopping', 'bg') 
                    : getAccentColorClass('tasks', 'bg')
                }`}
                style={{ width: `${(completedItems / totalItems) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a lista "{list.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ListSelectorCard;
