
import { ShoppingList, ShoppingItem, TaskItem } from '@/types';
import { toast } from "sonner";
import { isTaskItem } from './utils';

export const createListAction = (
  name: string, 
  mode: 'shopping' | 'tasks',
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  setActiveListId: (id: string | null) => void
): ShoppingList => {
  const newList: ShoppingList = {
    id: crypto.randomUUID(),
    name,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    listType: mode,
  };

  setLists(prev => [...prev, newList]);
  setActiveListId(newList.id);
  toast.success(`Lista "${name}" criada com sucesso!`);
  return newList;
};

export const updateListAction = (
  id: string, 
  name: string,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  setLists(prev => 
    prev.map(list => 
      list.id === id 
        ? { ...list, name, updatedAt: new Date().toISOString() } 
        : list
    )
  );
  toast.success(`Lista atualizada com sucesso!`);
};

export const deleteListAction = (
  id: string,
  lists: ShoppingList[],
  activeListId: string | null,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  setActiveListId: (id: string | null) => void,
  getFilteredLists: () => ShoppingList[]
) => {
  const listToDelete = lists.find(list => list.id === id);
  
  setLists(prev => prev.filter(list => list.id !== id));
  
  if (activeListId === id) {
    // When deleting active list, set another list of the same type as active
    const remainingLists = getFilteredLists().filter(list => list.id !== id);
    setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
  }
  
  toast.success(`Lista "${listToDelete?.name}" removida!`);
};

export const addItemAction = (
  listId: string, 
  item: Omit<ShoppingItem | TaskItem, 'id'>,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
  };

  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      // Make a type-safe update based on the list type
      const updatedList = {
        ...list,
        items: [...list.items, newItem] as typeof list.items,
        updatedAt: new Date().toISOString()
      };
      return updatedList;
    })
  );
  toast.success(`Item adicionado à lista!`);
};

export const updateItemAction = (
  listId: string, 
  itemId: string, 
  updatedFields: Partial<ShoppingItem | TaskItem>,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      return {
        ...list,
        items: list.items.map(item => 
          item.id === itemId 
            ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() }
            : item
        ) as typeof list.items,
        updatedAt: new Date().toISOString()
      };
    })
  );
  toast.success(`Item atualizado com sucesso!`);
};

export const deleteItemAction = (
  listId: string, 
  itemId: string,
  lists: ShoppingList[],
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  const listIndex = lists.findIndex(list => list.id === listId);
  if (listIndex === -1) return;
  
  const itemToDelete = lists[listIndex].items.find(item => item.id === itemId);
  
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      return {
        ...list,
        items: list.items.filter(item => item.id !== itemId),
        updatedAt: new Date().toISOString()
      };
    })
  );
  
  toast.success(`Item "${itemToDelete?.name}" removido!`);
};

export const toggleItemCompletionAction = (
  listId: string, 
  itemId: string,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      return {
        ...list,
        items: list.items.map(item => 
          item.id === itemId 
            ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
            : item
        ) as typeof list.items,
        updatedAt: new Date().toISOString()
      };
    })
  );
};
