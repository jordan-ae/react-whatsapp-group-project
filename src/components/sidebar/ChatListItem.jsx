import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatTime } from '../../utils/formatDate';
import './ChatListItem.css';

export default function ChatListItem({ chat, isActive, onClick }) {
  const lastMsg = chat.lastMessage;

  return (
    <div
      className={`chat-list-item ${isActive ? 'chat-list-item--active' : ''}`}
      onClick={onClick}
    >
      <Avatar
        name={chat.name}
        size="md"
        status={chat.type === 'group' ? 'group' : undefined}
      />
      <div className="chat-list-item__content">
        <div className="chat-list-item__top">
          <span className="chat-list-item__name">{chat.name}</span>
          {lastMsg && (
            <span className="chat-list-item__time">{formatTime(lastMsg.timestamp)}</span>
          )}
        </div>
        <div className="chat-list-item__bottom">
          <span className="chat-list-item__message">
            {chat.type === 'group' && lastMsg?.senderName && (
              <span className="chat-list-item__sender">{lastMsg.senderName}: </span>
            )}
            {lastMsg?.text || 'No messages yet'}
          </span>
          <div className="chat-list-item__meta">
            {chat.muted && (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="chat-list-item__muted">
                <path d="M12 4L9.91 6.09 12 8.18V4zM18 12c0-3.31-2.69-6-6-6v1.79l5.57 5.57c.14-.3.26-.61.35-.94l.08-.42zm-8 6.59V16H7v-4c0-.76.15-1.49.43-2.16L3.28 7.87 2 9.16l2.1 2.1C4.04 11.68 4 11.84 4 12v2H2v2h8v2.59l4.09-4.09L16 16.59 10 22.59z" />
              </svg>
            )}
            {chat.unreadCount > 0 && <Badge count={chat.unreadCount} />}
          </div>
        </div>
      </div>
    </div>
  );
}
