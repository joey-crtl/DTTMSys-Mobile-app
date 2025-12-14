import React, { createContext, useContext, useState, ReactNode } from 'react';

type Tab = 'home' | 'flights' | 'favorites' | 'profile';

interface BottomNavContextType {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export const BottomNavProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState<Tab>('home');
  return (
    <BottomNavContext.Provider value={{ selectedTab, setSelectedTab }}>
      {children}
    </BottomNavContext.Provider>
  );
};

export const useBottomNav = () => {
  const context = useContext(BottomNavContext);
  if (!context) throw new Error('useBottomNav must be used within BottomNavProvider');
  return context;
};