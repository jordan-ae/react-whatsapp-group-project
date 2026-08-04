import { useMemo } from "react";
import { useApi } from "./useApi";

export function useStatus() {
  const { data: statusList, loading, error, refetch } = useApi("/status");

  const { myStatus, recentStatus, viewedStatus } = useMemo(() => {
    if (!statusList)
      return { myStatus: null, recentStatus: [], viewedStatus: [] };

    const my = statusList.find((s) => s.userId === 'user_me');
    const recent = [];
    const viewed = [];

    statusList.forEach((s) => {
      if (s.userId === "user_me") return;
      if (!s.viewed) {
        recent.push(s);
      } else {              
        viewed.push(s);
      }
    });

    recent.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    viewed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return { 
      myStatus: my, 
      recentStatus: recent, 
      viewedStatus: viewed 
    };
  }, [statusList]);

  return { myStatus, recentStatus, viewedStatus, loading, error, refetch };
}
