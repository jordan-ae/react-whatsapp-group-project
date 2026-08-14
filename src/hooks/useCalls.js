import { useMemo } from 'react';
import { useApi } from './useApi';
import { useApp } from '../contexts/AppContext';

export function useCalls() {
  const { data: calls, loading, error, refetch } = useApi('/calls');
  const { loggedCalls } = useApp();

  const groupedCalls = useMemo(() => {
    // Calls placed in-app (logged to context) sit alongside the ones the
    // mock API returns, so a call you just made shows up in the history.
    const all = [...loggedCalls, ...(calls ?? [])];
    if (all.length === 0) return [];

    const grouped = {};
    all.forEach((call) => {
      if (!grouped[call.userId]) {
        grouped[call.userId] = [];
      }
      grouped[call.userId].push(call);
    });

    return Object.entries(grouped).map(([userId, userCalls]) => {
      const byNewest = [...userCalls].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return {
        userId,
        name: byNewest[0].name,
        avatar: byNewest[0].avatar,
        calls: byNewest,
        latestCall: byNewest[0],
      };
    });
  }, [calls, loggedCalls]);

  const sortedCalls = useMemo(() => {
    return [...groupedCalls].sort(
      (a, b) => new Date(b.latestCall.timestamp) - new Date(a.latestCall.timestamp)
    );
  }, [groupedCalls]);

  return { calls: sortedCalls, loading, error, refetch };
}
