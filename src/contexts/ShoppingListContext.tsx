
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem, TaskItem, Category, BaseItem, TaskCategory, ListType, ListItem } from '@/types';
import { toast } from "sonner";
import { useAppMode } from '@/contexts/AppModeContext';

interface ShoppingListContextType {
  lists: ShoppingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  createList: (name: string) => ShoppingList;
  updateList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  addItem: (listId: string, item: Omit<ShoppingItem | TaskItem, 'id'>) => void;
  updateItem: (listId: string, itemId: string, item: Partial<ShoppingItem | TaskItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  toggleItemCompletion: (listId: string, itemId: string) => void;
  getActiveList: () => ShoppingList | undefined;
  calculateTotalPrice: (listId: string) => number;
  getFilteredLists: () => ShoppingList[];
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
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const { mode } = useAppMode();

  useEffect(() => {
    const storedLists = localStorage.getItem(STORAGE_KEY);
    if (storedLists) {
      try {
        const parsedLists = JSON.parse(storedLists);
        
        // Ensure all lists have a listType property for backwards compatibility
        const updatedLists = parsedLists.map((list: ShoppingList) => {
          if (!list.listType) {
            // Default to shopping type for existing lists
            return { ...list, listType: 'shopping' as ListType };
          }
          return list;
        });
        
        setLists(updatedLists);
        
        // Set active list based on current mode
        const listsOfCurrentMode = updatedLists.filter(
          (list: ShoppingList) => list.listType === mode
        );
        
        if (listsOfCurrentMode.length > 0) {
          setActiveListId(listsOfCurrentMode[0].id);
        }
      } catch (e) {
        console.error('Error parsing stored lists:', e);
        toast.error('Error loading your shopping lists');
      }
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  // Filter lists based on current mode (shopping or tasks)
  const getFilteredLists = () => {
    return lists.filter(list => list.listType === mode);
  };

  const createList = (name: string): ShoppingList => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listType: mode, // Set the list type based on current mode
    };

    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    toast.success(`Lista "${name}" criada com sucesso!`);
    return newList;
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
      // When deleting active list, set another list of the same type as active
      const remainingLists = getFilteredLists().filter(list => list.id !== id);
      setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
    }
    
    toast.success(`Lista "${listToDelete?.name}" removida!`);
  };

  // Add typeguard function
  const isTaskItem = (item: any): item is TaskItem => {
    return item && 'priority' in item;
  }

  const addItem = (listId: string, item: Omit<ShoppingItem | TaskItem, 'id'>) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
    };

    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        // This ensures type safety by checking the list type
        if (list.listType === 'shopping') {
          // For shopping lists, we know the items are ShoppingItem[]
          return {
            ...list,
            items: [...(list.items as ShoppingItem[]), newItem as ShoppingItem],
            updatedAt: new Date().toISOString()
          };
        } else {
          // For task lists, we know the items are TaskItem[]
          return {
            ...list,
            items: [...(list.items as TaskItem[]), newItem as TaskItem],
            updatedAt: new Date().toISOString()
          };
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
            items: (list.items as ShoppingItem[]).map(item => 
              item.id === itemId 
                ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } as ShoppingItem
                : item
            ),
            updatedAt: new Date().toISOString()
          };
        } else {
          return {
            ...list,
            items: (list.items as TaskItem[]).map(item => 
              item.id === itemId 
                ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() } as TaskItem
                : item
            ),
            updatedAt: new Date().toISOString()
          };
        }
      })
    );
    toast.success(`Item atualizado com sucesso!`);
  };

  const deleteItem = (listId: string, itemId: string) => {
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

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(prev => 
      prev.map(list => {
        if (list.id !== listId) return list;
        
        return {
          ...list,
          items: list.items.map(item => 
            item.id === itemId 
              ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
              : item
          ),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const getActiveList = () => {
    return lists.find(list => list.id === activeListId);
  };

  const calculateTotalPrice = (listId: string): number => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    if (list.listType === 'shopping') {
      // For shopping lists, calculate total price
      return list.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } else {
      // For task lists, calculate completion percentage
      const totalItems = list.items.length;
      if (totalItems === 0) return 0;
      
      const completedItems = list.items.filter(item => item.completed).length;
      return (completedItems / totalItems) * 100;
    }
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
        getFilteredLists
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
