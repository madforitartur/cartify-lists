
import { ShoppingList, ShoppingItem, TaskItem, ListType } from '@/types';

// Add type guard for task items
export const isTaskItem = (item: any): item is TaskItem => {
  return item && 'priority' in item;
};

// Function to initialize lists from localStorage
export const getStoredLists = (storageKey: string): ShoppingList[] => {
  const storedLists = localStorage.getItem(storageKey);
  if (!storedLists) {
    return [];
  }

  try {
    const parsedLists = JSON.parse(storedLists);
    
    // Ensure all lists have a listType property for backwards compatibility
    return parsedLists.map((list: ShoppingList) => {
      if (!list.listType) {
        // Default to shopping type for existing lists
        return { ...list, listType: 'shopping' as ListType };
      }
      return list;
    });
  } catch (e) {
    console.error('Error parsing stored lists:', e);
    return [];
  }
};

// Calculate total for a list (price for shopping lists, completion % for task lists)
export const calculateListTotal = (list: ShoppingList): number => {
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
