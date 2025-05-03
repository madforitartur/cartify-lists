
import { ShoppingList, ShoppingItem, TaskItem, ListType } from '@/types';
import { toast } from "sonner";

export const createListAction = (
  name: string, 
  mode: 'shopping' | 'tasks',
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  setActiveListId: (id: string | null) => void,
  showToast: boolean = false
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
  if (showToast) {
    toast.success(`Lista "${name}" criada com sucesso!`);
  }
  return newList;
};

export const updateListAction = (
  id: string, 
  name: string,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  showToast: boolean = false
) => {
  setLists(prev => 
    prev.map(list => 
      list.id === id 
        ? { ...list, name, updatedAt: new Date().toISOString() } 
        : list
    )
  );
  if (showToast) {
    toast.success(`Lista atualizada com sucesso!`);
  }
};

export const deleteListAction = (
  id: string,
  lists: ShoppingList[],
  activeListId: string | null,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  setActiveListId: (id: string | null) => void,
  getFilteredLists: () => ShoppingList[],
  showToast: boolean = false
) => {
  const listToDelete = lists.find(list => list.id === id);
  
  setLists(prev => prev.filter(list => list.id !== id));
  
  if (activeListId === id) {
    // When deleting active list, set another list of the same type as active
    const remainingLists = getFilteredLists().filter(list => list.id !== id);
    setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
  }
  
  if (showToast && listToDelete) {
    toast.success(`Lista "${listToDelete.name}" removida!`);
  }
};

export const addItemAction = (
  listId: string, 
  item: Omit<ShoppingItem | TaskItem, 'id'>,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  showToast: boolean = false
) => {
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
  };

  // Type safety check to ensure we're adding the right type of item to the right type of list
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      // Create a proper typed version of the items array
      let typedItems;
      if (list.listType === 'shopping') {
        // For shopping lists, ensure the item has a category property
        if ('priority' in newItem) {
          // This is a task item being added to a shopping list (unusual case)
          // Convert to shopping item or handle as needed
          const { priority, description, dueDate, ...rest } = newItem as TaskItem;
          typedItems = [...list.items, { ...rest, category: 'default' }] as ShoppingItem[];
        } else {
          // Normal case: Shopping item to shopping list
          typedItems = [...list.items, newItem] as ShoppingItem[];
        }
      } else {
        // For task lists, ensure the item has a priority property
        if (!('priority' in newItem)) {
          // This is a shopping item being added to a task list (unusual case)
          // Convert to task item or handle as needed
          typedItems = [...list.items, { ...newItem, priority: 'medium', category: 'general' }] as TaskItem[];
        } else {
          // Normal case: Task item to task list
          typedItems = [...list.items, newItem] as TaskItem[];
        }
      }
      
      return {
        ...list,
        items: typedItems,
        updatedAt: new Date().toISOString()
      };
    })
  );
  if (showToast) {
    toast.success(`Item adicionado à lista!`);
  }
};

export const updateItemAction = (
  listId: string, 
  itemId: string, 
  updatedFields: Partial<ShoppingItem | TaskItem>,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  showToast: boolean = false
) => {
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      // Type safety for updating items
      const updatedItems = list.items.map(item => 
        item.id === itemId 
          ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() }
          : item
      );
      
      return {
        ...list,
        items: list.listType === 'shopping' ? updatedItems as ShoppingItem[] : updatedItems as TaskItem[],
        updatedAt: new Date().toISOString()
      };
    })
  );
  if (showToast) {
    toast.success(`Item atualizado com sucesso!`);
  }
};

export const deleteItemAction = (
  listId: string, 
  itemId: string,
  lists: ShoppingList[],
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>,
  showToast: boolean = false
) => {
  const listIndex = lists.findIndex(list => list.id === listId);
  if (listIndex === -1) return;
  
  const itemToDelete = lists[listIndex].items.find(item => item.id === itemId);
  
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      const filteredItems = list.items.filter(item => item.id !== itemId);
      
      return {
        ...list,
        items: list.listType === 'shopping' ? filteredItems as ShoppingItem[] : filteredItems as TaskItem[],
        updatedAt: new Date().toISOString()
      };
    })
  );
  
  if (showToast && itemToDelete) {
    toast.success(`Item "${itemToDelete.name}" removido!`);
  }
};

export const toggleItemCompletionAction = (
  listId: string, 
  itemId: string,
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
) => {
  setLists(prev => 
    prev.map(list => {
      if (list.id !== listId) return list;
      
      const toggledItems = list.items.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
          : item
      );
      
      return {
        ...list,
        items: list.listType === 'shopping' ? toggledItems as ShoppingItem[] : toggledItems as TaskItem[],
        updatedAt: new Date().toISOString()
      };
    })
  );
};
