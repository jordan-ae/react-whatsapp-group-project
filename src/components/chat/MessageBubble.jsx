import { MESSAGE_TYPES, MESSAGE_STATUS } from '../../utils/constants';
import { formatMessageTime } from '../../utils/formatDate';
import './MessageBubble.css';

export default function MessageBubble({ message, isOwn, grouped }) {
  const renderContent = () => {
    switch (message.type) {
      case MESSAGE_TYPES.TEXT:
        return <p className="message-bubble__text">{message.text}</p>;

      case MESSAGE_TYPES.IMAGE:
        return (
          <div className="message-bubble__image">
            <div className="message-bubble__image-placeholder">
              📷 {message.caption || 'Image'}
            </div>
            {message.caption && (
              <p className="message-bubble__caption">{message.caption}</p>
            )}
          </div>
        );

      case MESSAGE_TYPES.AUDIO:
        return (
          <div className="message-bubble__audio">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
            </svg>
            <span>Voice message ({message.duration}s)</span>
          </div>
        );

      case MESSAGE_TYPES.DOCUMENT:
        return (
          <div className="message-bubble__document">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            </svg>
            <div className="message-bubble__doc-info">
              <span className="message-bubble__doc-name">{message.fileName}</span>
            </div>
          </div>
        );

      case MESSAGE_TYPES.LOCATION:
        return (
          <div className="message-bubble__location">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{message.address || 'Location'}</span>
          </div>
        );

      case MESSAGE_TYPES.STICKER:
        return (
          <div className="message-bubble__sticker">
            {message.text || '👍'}
          </div>
        );

      case MESSAGE_TYPES.SYSTEM:
        return (
          <div className="message-bubble__system">
            {message.text}
          </div>
        );

      default:
        return <p className="message-bubble__text">{message.text}</p>;
    }
  };

  if (message.type === MESSAGE_TYPES.SYSTEM) {
    return (
      <div className="message-bubble message-bubble--system">
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      className={`message-bubble ${isOwn ? 'message-bubble--own' : 'message-bubble--other'
        } ${grouped ? 'message-bubble--grouped' : ''}`}
    >
      {renderContent()}

      <div className="message-bubble__meta">
        <span className="message-bubble__time">{formatMessageTime(message.timestamp)}</span>
        {isOwn && (
          <span
            className={`message-bubble__status message-bubble__status--${message.status}`}
          >
            {message.status === MESSAGE_STATUS.READ && (
              <>
              <svg viewBox="0 0 16 11" width="16" height="11" fill="currentColor">
                <path d="M11.071.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-2.011-2.095A.463.463 0 002.045 6a.482.482 0 00-.381.178.534.534 0 00-.127.381.497.497 0 00.178.356l2.394 2.49a.584.584 0 00.355.178.417.417 0 00.33-.127l6.603-8.26a.534.534 0 00.127-.381.497.497 0 00-.178-.356l-.178-.127zm-3.326 4.59a.427.427 0 00.33-.127l4.172-5.258a.534.534 0 00.127-.38.497.497 0 00-.178-.357.457.457 0 00-.304-.102.493.493 0 00-.381.178L7.59 5.443l.152.178.178-.127z" />
              </svg>
              <svg viewBox="0 0 16 11" width="16" height="11" fill="currentColor">
                <path d="M11.071.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-2.011-2.095A.463.463 0 002.045 6a.482.482 0 00-.381.178.534.534 0 00-.127.381.497.497 0 00.178.356l2.394 2.49a.584.584 0 00.355.178.417.417 0 00.33-.127l6.603-8.26a.534.534 0 00.127-.381.497.497 0 00-.178-.356l-.178-.127zm-3.326 4.59a.427.427 0 00.33-.127l4.172-5.258a.534.534 0 00.127-.38.497.497 0 00-.178-.357.457.457 0 00-.304-.102.493.493 0 00-.381.178L7.59 5.443l.152.178.178-.127z" />
              </svg>
              </>
              
            )}

            {message.status === MESSAGE_STATUS.DELIVERED && (
              <svg viewBox="0 0 16 11" width="16" height="11" fill="currentColor">
                <path d="M11.071.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-2.011-2.095A.463.463 0 002.045 6a.482.482 0 00-.381.178.534.534 0 00-.127.381.497.497 0 00.178.356l2.394 2.49a.584.584 0 00.355.178.417.417 0 00.33-.127l6.603-8.26a.534.534 0 00.127-.381.497.497 0 00-.178-.356l-.178-.127z" />
              </svg>
            )}

            {message.status === MESSAGE_STATUS.SENT && (
              <svg viewBox="0 0 12 11" width="12" height="11" fill="currentColor">
                <path d="M11.155.653a.457.457 0 00-.305-.102.493.493 0 00-.38.178L4.28 8.365l-2.01-2.095A.463.463 0 001.91 6a.482.482 0 00-.38.178.534.534 0 00-.128.381.497.497 0 00.179.356l2.394 2.49a.584.584 0 00.355.178.417.417 0 00.33-.127l6.602-8.26a.534.534 0 00.127-.381.497.497 0 00-.178-.356l-.178-.127z" />
              </svg>
            )}

            {message.status === MESSAGE_STATUS.FAILED && '!'}
          </span>
        )}
      </div>
    </div>
  );
}
