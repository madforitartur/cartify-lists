
import { useContext } from 'react';
import { ShoppingListContext } from './ShoppingListContext';
import { ShoppingListContextType } from './types';

export const useShoppingList = (): ShoppingListContextType => {
  const context = useContext(ShoppingListContext);
  
  if (!context) {
    // More descriptive error message that helps with debugging
    const error = new Error('useShoppingList must be used within a ShoppingListProvider');
    console.error('useShoppingList hook error: Component not wrapped with ShoppingListProvider.', 
      '\nMake sure the component using this hook is a child of ShoppingListProvider.',
      '\nCheck your component hierarchy and ensure ShoppingListProvider is present.');
    throw error;
  }
  
  return context;
};
