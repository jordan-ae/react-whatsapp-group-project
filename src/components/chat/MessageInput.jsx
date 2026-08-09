import { useState } from "react";
import "./MessageInput.css";
import { mockFetch } from "../../utils/mockFetch";
import { useApp } from "../../contexts/AppContext";

export default function MessageInput({onSent}) {
  const [text, setText] = useState("");

  const { selectedChatId } = useApp();

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const result = await mockFetch("/chats/" + selectedChatId + "/messages", {
        method: "POST",
        body: JSON.stringify({ text: text }),
      });

      onSent?.(result)
      setText("");
      
    } catch (error) {
      console.error("Error sending message:", error);
    }

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <button className="message-input__btn" title="Emoji">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-7 0c0 .83-.67 1.5-1.5 1.5S6 11.83 6 11s.67-1.5 1.5-1.5S9 10.17 9 11zm3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
        </svg>
      </button>
      <button className="message-input__btn" title="Attach">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-3.31-2.69-6-6-6S3 1.69 3 5v12.5c0 4.42 3.58 8 8 8s8-3.58 8-8V6h-2.5z" />
        </svg>
      </button>
      <textarea
        type="text"
        className="message-input__field"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      {text.trim() ? (
        <button
          className="message-input__btn message-input__btn--send"
          onClick={handleSend}
          title="Send"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      ) : (
        <button className="message-input__btn" title="Voice message">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
          </svg>
        </button>
      )}
    </div>
  );
}
