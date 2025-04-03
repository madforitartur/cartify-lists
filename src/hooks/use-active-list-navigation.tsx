
import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { useShoppingList } from '@/contexts/shopping-list';

export const useActiveListNavigation = (
  showLists: boolean,
  setShowLists: (show: boolean) => void
) => {
  const { activeListId } = useShoppingList();
  const isMobile = useIsMobile();
  
  // On mobile, when activeListId changes and it's not null
  // we want to navigate to the list view (i.e., hide the list selector)
  useEffect(() => {
    if (isMobile && activeListId) {
      setShowLists(false);
    }
  }, [activeListId, isMobile, setShowLists]);
};
