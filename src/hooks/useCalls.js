import { useMemo } from 'react';
import { useApi } from './useApi';

export function useCalls() {
  const { data: calls, loading, error, refetch } = useApi('/calls');

  const sortedCalls = useMemo(() => {
    if (!Array.isArray(calls)) return [];
    return [...calls].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [calls]);

  const groupedCalls = useMemo(() => {
    if (!sortedCalls.length) return [];

    const groups = [];
    for (const call of sortedCalls) {
      const lastGroup = groups[groups.length - 1];
      if (
        lastGroup &&
        lastGroup.userId === call.userId &&
        lastGroup.latestCall.type === call.type
      ) {
        lastGroup.calls.push(call);
      } else {
        groups.push({
          userId: call.userId,
          name: call.name,
          avatar: call.avatar,
          calls: [call],
          latestCall: call,
        });
      }
    }

    return groups;
  }, [sortedCalls]);

  const sortedGroupedCalls = useMemo(() => {
    return [...groupedCalls].sort(
      (a, b) => new Date(b.latestCall.timestamp) - new Date(a.latestCall.timestamp)
    );
  }, [groupedCalls]);

  return { calls: sortedGroupedCalls, loading, error, refetch };
}
