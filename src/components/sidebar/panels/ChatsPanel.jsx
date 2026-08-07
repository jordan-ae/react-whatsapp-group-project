import { useApp } from '../../../contexts/AppContext';
import { useChats } from '../../../hooks/useChat';
import SearchBar from '../../common/SearchBar';
import ChatListItem from '../ChatListItem';

/**
 * Chats section panel. Owned by the chats team.
 * Renders directly into the shared sidebar body (`.sidebar__list`).
 */
export default function ChatsPanel() {
  const { searchQuery, setSearchQuery, selectedChatId, setSelectedChatId } =
    useApp();
  const { chats, loading } = useChats(searchQuery);

  return (
    <>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search or start new chat"
      />

      <div className="sidebar__list">
        {loading ? (
          <div className="sidebar__loading">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="sidebar__empty">No chats found</div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={selectedChatId === chat.id}
              onClick={() => setSelectedChatId(chat.id)}
            />
          ))
        )}
      </div>
    </>
  );
}
