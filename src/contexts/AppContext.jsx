import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { mockFetch } from "../utils/mockFetch";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [readChatIds, setReadChatIds] = useState(() => new Set());

  useEffect(() => {
    mockFetch("/me").then(setCurrentUser);
  }, []);

  const markChatRead = useCallback((id) => {
    if (!id) return;
    setReadChatIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const updateAbout = async (newAbout) => {
    try {
      await mockFetch(`/users/${currentUser.id}/profile`, {
        method: "PUT",
        body: JSON.stringify({ about: newAbout }),
      });
      setCurrentUser((prev) => ({ ...prev, about: newAbout }));
    } catch (err) {
      console.error("updateAbout failed:", err);
    }
  };

  const updateAvatar = async (newAvatarUrl) => {
    try {
      await mockFetch(`/users/${currentUser.id}/profile`, {
        method: "PUT",
        body: JSON.stringify({ avatar: newAvatarUrl }),
      });
      setCurrentUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
    } catch (err) {
      console.error("updateAvatar failed:", err);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    updateAbout,
    updateAvatar,
    activeTab,
    setActiveTab,
    selectedChatId,
    setSelectedChatId,
    searchQuery,
    setSearchQuery,
    readChatIds,
    setReadChatIds,
    markChatRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
