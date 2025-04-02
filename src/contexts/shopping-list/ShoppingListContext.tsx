
import React, { createContext, useState, useEffect } from 'react';
import { ShoppingList } from '@/types';
import { toast } from "sonner";
import { useAppMode } from '@/contexts/AppModeContext';
import { ShoppingListContextType, STORAGE_KEY } from './types';
import { 
  createListAction, 
  updateListAction, 
  deleteListAction,
  addItemAction,
  updateItemAction,
  deleteItemAction,
  toggleItemCompletionAction
} from './actions';
import { getStoredLists, calculateListTotal } from './utils';

export const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const { mode } = useAppMode();

  // Load lists from localStorage on initial render
  useEffect(() => {
    try {
      const updatedLists = getStoredLists(STORAGE_KEY);
      setLists(updatedLists);
        
      // Set active list based on current mode
      const listsOfCurrentMode = updatedLists.filter(
        (list: ShoppingList) => list.listType === mode
      );
      
      if (listsOfCurrentMode.length > 0) {
        setActiveListId(listsOfCurrentMode[0].id);
      }
    } catch (e) {
      console.error('Error loading stored lists:', e);
      toast.error('Error loading your shopping lists');
    }
  }, [mode]);

  // Save lists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  // Filter lists based on current mode (shopping or tasks)
  const getFilteredLists = () => {
    return lists.filter(list => list.listType === mode);
  };

  const createList = (name: string): ShoppingList => {
    return createListAction(name, mode, setLists, setActiveListId);
  };

  const updateList = (id: string, name: string) => {
    updateListAction(id, name, setLists);
  };

  const deleteList = (id: string) => {
    deleteListAction(id, lists, activeListId, setLists, setActiveListId, getFilteredLists);
  };

  const addItem = (listId: string, item: Omit<ShoppingList['items'][0], 'id'>) => {
    addItemAction(listId, item, setLists);
  };

  const updateItem = (listId: string, itemId: string, item: Partial<ShoppingList['items'][0]>) => {
    updateItemAction(listId, itemId, item, setLists);
  };

  const deleteItem = (listId: string, itemId: string) => {
    deleteItemAction(listId, itemId, lists, setLists);
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    toggleItemCompletionAction(listId, itemId, setLists);
  };

  const getActiveList = () => {
    return lists.find(list => list.id === activeListId);
  };

  const calculateTotalPrice = (listId: string): number => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    return calculateListTotal(list);
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
