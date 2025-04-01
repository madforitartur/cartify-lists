
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BaseList, ShoppingItem, TaskItem, ListType, 
  ShoppingListWithItems, TaskListWithItems, ListWithItems 
} from '@/types';
import { toast } from "sonner";
import { useAppMode } from './AppModeContext';

interface ShoppingListContextType {
  lists: ListWithItems[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  createList: (name: string) => ListWithItems;
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  addItem: (listId: string, item: Omit<ShoppingItem | TaskItem, 'id'>) => void;
  updateItem: (listId: string, itemId: string, item: Partial<ShoppingItem | TaskItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string) => void;
  getActiveList: () => ListWithItems | undefined;
  calculateTotalPrice: (listId: string) => number;
  filteredLists: ListWithItems[];
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

const STORAGE_KEY = 'cartify-shopping-lists';

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ListWithItems[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const { mode } = useAppMode();

  useEffect(() => {
    const storedLists = localStorage.getItem(STORAGE_KEY);
    if (storedLists) {
      try {
        const parsedLists = JSON.parse(storedLists);
        
        // Add listType field to existing lists if missing
        const updatedLists = parsedLists.map((list: any) => {
          if (!list.listType) {
            // For backward compatibility, determine list type based on item categories
            const hasTaskItems = list.items.some((item: any) => 
              item.priority !== undefined || 
              (item.category !== undefined && 
               ['general', 'work', 'personal', 'health', 'education', 'home'].includes(item.category)));
            
            return {
              ...list,
              listType: hasTaskItems ? 'tasks' : 'shopping'
            };
          }
          return list;
        });
        
        setLists(updatedLists as ListWithItems[]);
        
        if (updatedLists.length > 0 && !activeListId) {
          // Set active list based on current mode
          const listForCurrentMode = updatedLists.find((list: BaseList) => list.listType === mode);
          setActiveListId(listForCurrentMode?.id || updatedLists[0].id);
        }
      } catch (e) {
        console.error('Error parsing stored lists:', e);
        toast.error('Error loading your shopping lists');
      }
    }
  }, []);

  // When mode changes, update activeListId if needed
  useEffect(() => {
    if (lists.length > 0) {
      const currentActiveList = lists.find(list => list.id === activeListId);
      if (!currentActiveList || currentActiveList.listType !== mode) {
        const listForCurrentMode = lists.find(list => list.listType === mode);
        if (listForCurrentMode) {
          setActiveListId(listForCurrentMode.id);
        }
      }
    }
  }, [mode, lists, activeListId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  // Filter lists based on current mode
  const filteredLists = lists.filter(list => list.listType === mode);

  const createList = (name: string): ListWithItems => {
    if (mode === 'shopping') {
      const newList: ShoppingListWithItems = {
        id: crypto.randomUUID(),
        name,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        listType: 'shopping'
      };
      
      setLists(prev => [...prev, newList]);
      setActiveListId(newList.id);
      toast.success(`Lista "${name}" criada com sucesso!`);
      return newList;
    } else {
      const newList: TaskListWithItems = {
        id: crypto.randomUUID(),
        name,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        listType: 'tasks'
      };
      
      setLists(prev => [...prev, newList]);
      setActiveListId(newList.id);
      toast.success(`Lista "${name}" criada com sucesso!`);
      return newList;
    }
  };

  const updateList = (id: string, name: string) => {
    setLists(prev => 
      prev.map(list => 
        list.id === id 
          ? { ...list, name, updatedAt: new Date().toISOString() } 
          : list
      )
    );
    toast.success(`Lista atualizada com sucesso!`);
  };

  const deleteList = (id: string) => {
    const listToDelete = lists.find(list => list.id === id);
    
    setLists(prev => prev.filter(list => list.id !== id));
    
    if (activeListId === id) {
      // Find another list of the same type
      const remainingLists = lists.filter(list => list.id !== id && list.listType === mode);
      setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
    }
    
    toast.success(`Lista "${listToDelete?.name}" removida!`);
  };

  const addItem = (listId: string, item: Omit<ShoppingItem | TaskItem, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    };

    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        if (list.listType === 'shopping' && 'priority' in newItem) {
          // Don't add task items to shopping lists
          toast.error("Não é possível adicionar tarefas a uma lista de compras");
          return list;
        }
        
        if (list.listType === 'tasks' && !('priority' in newItem)) {
          // Don't add shopping items to task lists
          toast.error("Não é possível adicionar itens de compras a uma lista de tarefas");
          return list;
        }
        
        if (list.listType === 'shopping') {
          // TypeScript knows this is a shopping list
          return {
            ...list,
            items: [...(list as ShoppingListWithItems).items, newItem as ShoppingItem],
            updatedAt: new Date().toISOString()
          } as ShoppingListWithItems;
        } else {
          // TypeScript knows this is a task list
          return {
            ...list,
            items: [...(list as TaskListWithItems).items, newItem as TaskItem],
            updatedAt: new Date().toISOString()
          } as TaskListWithItems;
        }
      })
    );
    toast.success(`Item adicionado à lista!`);
  };

  const updateItem = (listId: string, itemId: string, updatedFields: Partial<ShoppingItem | TaskItem>) => {
    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        if (list.listType === 'shopping') {
          return {
            ...list,
            items: (list as ShoppingListWithItems).items.map(item => 
              item.id === itemId ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } : item
            ),
            updatedAt: new Date().toISOString()
          } as ShoppingListWithItems;
        } else {
          return {
            ...list,
            items: (list as TaskListWithItems).items.map(item => 
              item.id === itemId ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } : item
            ),
            updatedAt: new Date().toISOString()
          } as TaskListWithItems;
        }
      })
    );
    toast.success(`Item atualizado com sucesso!`);
  };

  const deleteItem = (listId: string, itemId: string) => {
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) return;
    
    const list = lists[listIndex];
    const itemToDelete = list.items.find(item => item.id === itemId);
    
    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        if (list.listType === 'shopping') {
          return {
            ...list,
            items: (list as ShoppingListWithItems).items.filter(item => item.id !== itemId),
            updatedAt: new Date().toISOString()
          } as ShoppingListWithItems;
        } else {
          return {
            ...list,
            items: (list as TaskListWithItems).items.filter(item => item.id !== itemId),
            updatedAt: new Date().toISOString()
          } as TaskListWithItems;
        }
      })
    );
    
    toast.success(`Item "${itemToDelete?.name}" removido!`);
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        if (list.listType === 'shopping') {
          return {
            ...list,
            items: (list as ShoppingListWithItems).items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
            ),
            updatedAt: new Date().toISOString()
          } as ShoppingListWithItems;
        } else {
          return {
            ...list,
            items: (list as TaskListWithItems).items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() } : item
            ),
            updatedAt: new Date().toISOString()
          } as TaskListWithItems;
        }
      })
    );
  };

  const getActiveList = () => {
    return lists.find(list => list.id === activeListId);
  };

  const calculateTotalPrice = (listId: string): number => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <ShoppingListContext.Provider 
      value={{ 
        lists, 
        activeListId, 
        setActiveListId, 
        createList, 
        updateList, 
        deleteList, 
        addItem, 
        updateItem, 
        deleteItem, 
        toggleItemCompletion,
        getActiveList,
        calculateTotalPrice,
        filteredLists
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
