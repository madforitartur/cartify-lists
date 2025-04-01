import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem, TaskItem, Category, BaseItem, TaskCategory } from '@/types';
import { toast } from "sonner";

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

  useEffect(() => {
    const storedLists = localStorage.getItem(STORAGE_KEY);
    if (storedLists) {
      try {
        const parsedLists = JSON.parse(storedLists);
        setLists(parsedLists);
        
        if (parsedLists.length > 0 && !activeListId) {
          setActiveListId(parsedLists[0].id);
        }
      } catch (e) {
        console.error('Error parsing stored lists:', e);
        toast.error('Error loading your shopping lists');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const createList = (name: string): ShoppingList => {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      const remainingLists = lists.filter(list => list.id !== id);
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
      prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: [...list.items, newItem as ShoppingItem | TaskItem],
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
    toast.success(`Item adicionado à lista!`);
  };

  const updateItem = (listId: string, itemId: string, updatedFields: Partial<ShoppingItem | TaskItem>) => {
    setLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.map(item => 
                item.id === itemId 
                  ? { 
                      ...item, 
                      ...updatedFields,
                      updatedAt: new Date().toISOString() 
                    } 
                  : item
              ) as (ShoppingItem | TaskItem)[],
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
    toast.success(`Item atualizado com sucesso!`);
  };

  const deleteItem = (listId: string, itemId: string) => {
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) return;
    
    const itemToDelete = lists[listIndex].items.find(item => item.id === itemId);
    
    setLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
    
    toast.success(`Item "${itemToDelete?.name}" removido!`);
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { 
              ...list, 
              items: list.items.map(item => 
                item.id === itemId 
                  ? { 
                      ...item, 
                      completed: !item.completed,
                      updatedAt: new Date().toISOString() 
                    } 
                  : item
              ),
              updatedAt: new Date().toISOString() 
            } 
          : list
      )
    );
  };

  const getActiveList = () => {
    return lists.find(list => list.id === activeListId);
  };

  const calculateTotalPrice = (listId: string): number => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => total + (item.price * item.quantity), 0);
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
        calculateTotalPrice
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};
