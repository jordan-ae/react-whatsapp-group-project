import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockFetch } from '../utils/mockFetch';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    mockFetch('/me').then(setCurrentUser);
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    activeTab,
    setActiveTab,
    selectedChatId,
    setSelectedChatId,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
