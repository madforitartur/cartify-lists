
import { useContext } from 'react';
import { ShoppingListContext } from './ShoppingListContext';
import { ShoppingListContextType } from './types';

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};
