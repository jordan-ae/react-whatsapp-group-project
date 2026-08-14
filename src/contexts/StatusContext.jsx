import { createContext, useContext, useState } from "react";
import initialStatuses from "../data/status"

export const StatusContext = createContext();

export function StatusProvider ({children}) {

    const initialMyStatusObj = initialStatuses.find((s) => s.id === "status_me") || null;

    const [myStatus, setMyStatus] = useState(() => {

    const saved = localStorage.getItem("app_my_status");

    return saved ? JSON.parse(saved) : initialMyStatusObj;
  });

  const [recentStatus] = useState(
    initialStatuses.filter((s) => s.id !== "status_me" && !s.viewed)
  );

  const [viewedStatus] = useState(
    initialStatuses.filter((s) => s.id !== "status_me" && s.viewed)
  );

  const [loading] = useState(false);

  const addMyStatus = (newStatusItem, currentUser) => {

    setMyStatus((prevStatus) => {

      const existingItems = prevStatus?.items || [];

      const updatedStatusObj = {
        id: prevStatus?.id || `status_me_${Date.now()}`,
        userId: currentUser?.id || "user_me",
        name: currentUser?.name || "You",
        timestamp: new Date().toISOString(),
        viewed: false,

        items: [
        
          {
            id: `item_${Date.now()}`,
            type: "text",
            text: newStatusItem?.text || "",
            backgroundColor: newStatusItem?.backgroundColor || "#25d366",
            textColor: "#ffffff",
            timestamp: new Date().toISOString(),
          },
          ...existingItems,
        ],
      };

      localStorage.setItem("app_my_status", JSON.stringify(updatedStatusObj));
      return updatedStatusObj;
    });
  };

  const value = {
    myStatus,
    recentStatus,
    viewedStatus,
    loading,
    addMyStatus,
  };
    return (
        <div>
            <StatusContext.Provider value={value}>
                {children}
            </StatusContext.Provider>
        </div>
    )

}

export function useStatusContext () {
  const context = useContext(StatusContext)

  if (!context) {
    throw new Error ('useStatusContext must be used within a context provider')
  } return context;
}