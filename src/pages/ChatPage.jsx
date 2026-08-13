import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useChats, useChatMessages } from "../hooks/useChat";
import Avatar from "../components/common/Avatar";
import EmptyState from "../components/common/EmptyState";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import { formatDateLabel } from "../utils/formatDate";
import Modal from "../components/common/Modal";
import { CHAT_TYPES } from "../utils/constants";
import "./ChatPage.css";

export default function ChatPage() {
  const { chats } = useChats();
  const { chatId } = useParams();

  const { selectedChatId, setSelectedChatId, markChatRead } = useApp();
  // const { messages, loading } = useChatMessages(selectedChatId);
  // const { selectedChatId, setSelectedChatId } = useApp();
  const { messages, loading, refetch } = useChatMessages(selectedChatId);
  const [infoOpen, setInfoOpen] = useState(false);

  const [isCallActive, setCallActive] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const allMessages = [...messages, ...sentMessages];
  const bottomRef = useRef(null);

  const handleSent = (newMsg) => {
    setSentMessages((prev) => [...prev, newMsg]);
  };

  const chat = selectedChatId
    ? chats.find((c) => c.id === selectedChatId)
    : null;

  // const bottomRef = useRef(null);

  useEffect(() => {
    if (chatId && chatId !== selectedChatId) {
      setSelectedChatId(chatId);
    }
    if (chatId) markChatRead(chatId);
  }, [chatId, selectedChatId, setSelectedChatId, markChatRead]);

  useEffect(() => {
    setSentMessages([]);
  }, [selectedChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sentMessages]);

  const userNames = {};
  chats.forEach((chat) => {
    if (chat.type === "individual") {
      userNames[chat.userId] = chat.name;
    }
  });

  useEffect(() => {
    if (selectedChatId) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedChatId]);

  if (!selectedChatId || !chat) {
    return (
      <div className="chat-page chat-page--empty">
        <EmptyState
          icon={
            <svg viewBox="0 0 303 172" width="240" height="136" fill="none">
              <path
                d="M229.565 82.347c0-34.29-27.8-62.09-62.09-62.09-34.291 0-62.09 27.8-62.09 62.09 0 34.29 27.799 62.09 62.09 62.09 34.29 0 62.09-27.8 62.09-62.09z"
                fill="#00a884"
                opacity=".1"
              />
              <path
                d="M167.475 40.257c-23.253 0-42.09 18.837-42.09 42.09 0 23.252 18.837 42.09 42.09 42.09 23.252 0 42.09-18.838 42.09-42.09 0-23.253-18.838-42.09-42.09-42.09zm0 76.38c-18.896 0-34.29-15.394-34.29-34.29 0-18.895 15.394-34.29 34.29-34.29 18.895 0 34.29 15.395 34.29 34.29 0 18.896-15.395 34.29-34.29 34.29z"
                fill="#00a884"
                opacity=".3"
              />
            </svg>
          }
          title="WhatsApp Clone"
          subtitle="Send and receive messages, make calls, and share status updates with your contacts."
        />
      </div>
    );
  }
  return (
    <div className="chat-page">
      <div className="chat-page__header" onClick={() => setInfoOpen(!infoOpen)}>
        <Avatar name={chat.name} size="md" />
        <div className="chat-page__header-info">
          <span className="chat-page__header-name">{chat.name}</span>
          <span className="chat-page__header-status">
            {isTyping ? "typing…" : chat.online ? "online" : "offline"}
          </span>
        </div>
        <div className="chat-page__header-actions">
          <button
            className="chat-page__header-btn"
            title="Voice call"
            onClick={(event) => {
              event.stopPropagation();
              setCallActive(true);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </button>
          <button
            className="chat-page__header-btn"
            title="Video call"
            onClick={(event) => {
              event.stopPropagation();
              setCallActive(true);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="chat-page__messages">
        {loading ? (
          <div className="chat-page__loading">Loading messages...</div>
        ) : allMessages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            subtitle="Start a conversation!"
          />
        ) : (
          <Fragment>
            {allMessages.map((msg, index) => {
              const previous = allMessages[index - 1];
              const showDate =
                !previous ||
                new Date(previous.timestamp).toDateString() !==
                  new Date(msg.timestamp).toDateString();

              return (
                <>
                  {showDate && (
                    <div className="chat-page__date-label">
                      {formatDateLabel(msg.timestamp)}
                    </div>
                  )}

                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === "user_me"}
                  />
                </>
              );
            })}
          </Fragment>
        )}
        <div ref={bottomRef}></div>
      </div>

      <MessageInput onSent={handleSent} />

      {isCallActive && (
        <Modal
          isOpen={isCallActive}
          onClose={() => setCallActive(false)}
          title={`Calling ${chat.name}...`}
        >
          <div className="call-modal-content">
            <Avatar name={chat.name} size="xl" />
            <p>{chat.online ? "Ringing..." : "Unavailable"}</p>
          </div>
        </Modal>
      )}

      {infoOpen && (
        <div className="chat-page__info-panel">
          <div className="chat-page__info-header">
            <h3>Contact info</h3>
            <button
              className="chat-page__info-close"
              onClick={() => setInfoOpen(false)}
              title="Close panel"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          <div className="chat-page__info-body">
            <div className="chat-page__info-avatar-wrap">
              <Avatar name={chat.name} size="xl" />
              <h2>{chat.name}</h2>
              <span className="chat-page__info-subtext">
                {chat.online ? "Online" : "Offline"}
              </span>
            </div>

            <div className="chat-page__info-section">
              <label>Phone number</label>
              <p>{chat.phone || "No phone number available"}</p>
            </div>

            <div className="chat-page__info-section">
              <label>About</label>
              <p>{chat.about || "Hey there! I am using WhatsApp."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
