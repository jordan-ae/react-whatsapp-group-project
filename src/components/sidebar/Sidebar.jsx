import { useApp } from '../../contexts/AppContext';
import { useChats } from '../../hooks/useChat';
import SearchBar from '../common/SearchBar';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import ChatListItem from './ChatListItem';
import SidebarHeader from './SidebarHeader';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { useStatus } from '../../hooks/useStatus';

export default function Sidebar() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, selectedChatId, setSelectedChatId } = useApp();
  const { chats, loading } = useChats(searchQuery);

  const tabs = [
    { id: 'chats', label: 'Chats' },
    { id: 'calls', label: 'Calls' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <aside className="sidebar">
      <SidebarHeader />

      <div className="sidebar__tabs">
        {tabs.map((tab) => (
          <Link
           to={tab.label}
            key={tab.id}
            className={`sidebar__tab ${activeTab === tab.id ? 'sidebar__tab--active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedChatId(null);
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

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
    </aside>
  );
}
