import { useMemo } from 'react';
import { useApi } from './useApi';

export function useCalls() {
  const { data: calls, loading, error, refetch } = useApi('/calls');

  const groupedCalls = useMemo(() => {
    if (!calls) return [];

    const grouped = {};
    calls.forEach((call) => {
      if (!grouped[call.userId]) {
        grouped[call.userId] = [];
      }
      grouped[call.userId].push(call);
    });

    return Object.entries(grouped).map(([userId, userCalls]) => ({
      userId,
      name: userCalls[0].name,
      avatar: userCalls[0].avatar,
      calls: userCalls.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      latestCall: userCalls.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0],
    }));
  }, [calls]);

  const sortedCalls = useMemo(() => {
    return [...groupedCalls].sort(
      (a, b) => new Date(b.latestCall.timestamp) - new Date(a.latestCall.timestamp)
    );
  }, [groupedCalls]);

  return { calls: sortedCalls, loading, error, refetch };
}
