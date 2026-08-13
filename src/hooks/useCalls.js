import { useMemo } from 'react';
import { useApi } from './useApi';
import { useApp } from '../contexts/AppContext';

export function useCalls() {
  const { data: calls, loading, error, refetch } = useApi('/calls');
  const { loggedCalls } = useApp();

  const groupedCalls = useMemo(() => {
    const all = [...loggedCalls, ...(calls ?? [])];
    if (all.length === 0) return [];

    const sortedAll = [...all].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const result = [];
    let currentGroup = null;

    sortedAll.forEach((call) => {
      if (
        currentGroup &&
        currentGroup.userId === call.userId &&
        currentGroup.latestCall.type === call.type &&
        currentGroup.latestCall.direction === call.direction
      ) {
        currentGroup.calls.push(call);
      } else {
        currentGroup = {
          userId: call.userId,
          name: call.name,
          avatar: call.avatar,
          calls: [call],
          latestCall: call,
        };
        result.push(currentGroup);
      }
    });

    return result;
  }, [calls, loggedCalls]);

  return { calls: groupedCalls, loading, error, refetch };
}
