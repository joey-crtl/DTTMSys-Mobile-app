// components/useBottomTab.ts
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useBottomNav } from './BottomNavContext'; // adjust path if needed

type Tab = 'home' | 'flights' | 'favorites' | 'profile';

/**
 * Automatically updates the selected tab in the bottom navigation
 * whenever the screen becomes focused (visible), including swipes.
 * 
 * @param tab The tab that should be highlighted when this screen is active
 */
export const useBottomTab = (tab: Tab) => {
  const { setSelectedTab } = useBottomNav();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setSelectedTab(tab);
    }
  }, [isFocused, tab, setSelectedTab]);
};