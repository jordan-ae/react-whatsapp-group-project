import { useMemo } from 'react';
import { useApi } from './useApi';

export function useChats(search = '') {
  const url = search ? `/chats?search=${encodeURIComponent(search)}` : '/chats';
  const { data: chats, loading, error, refetch } = useApi(url);

  const sortedChats = useMemo(() => {
    if (!chats) return [];
    return [...chats].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
  }, [chats]);

  return { chats: sortedChats, loading, error, refetch };
}

export function useChatMessages(chatId) {
  const { data: messages, loading, error, refetch } = useApi(
    chatId ? `/chats/${chatId}/messages` : null
  );

  return { messages: messages || [], loading, error, refetch };
}
