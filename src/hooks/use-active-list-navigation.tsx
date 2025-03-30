
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { useShoppingList } from '@/contexts/ShoppingListContext';

export const useActiveListNavigation = (
  showLists: boolean, 
  setShowLists: (show: boolean) => void
) => {
  const isMobile = useIsMobile();
  const { activeListId } = useShoppingList();

  // On mobile, when an active list is selected, switch to the list view
  useEffect(() => {
    if (isMobile && activeListId && showLists) {
      setShowLists(false);
    }
  }, [activeListId, isMobile, showLists, setShowLists]);

  return null;
};
