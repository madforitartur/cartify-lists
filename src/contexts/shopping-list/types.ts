
import { ShoppingList, ShoppingItem, TaskItem, Category, BaseItem, TaskCategory, ListType, ListItem } from '@/types';

export interface ShoppingListContextType {
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

export const STORAGE_KEY = 'cartify-shopping-lists';
