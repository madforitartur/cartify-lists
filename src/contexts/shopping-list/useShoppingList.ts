
import { useContext } from 'react';
import { ShoppingListContext } from './ShoppingListContext';
import { ShoppingListContextType } from './types';

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    console.error('useShoppingList is being called outside of ShoppingListProvider. Please wrap your component with ShoppingListProvider.');
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
