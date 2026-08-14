import { useState } from "react";
import "./TextStatusComposer.css";
import { STATUS_COLORS } from "../../utils/constants";
import { mockFetch } from "../../utils/mockFetch";

export default function TextStatusComposer({ onClose, onStatusCreated }) {
  const [statusText, setStatusText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#25d366");
  const [showColors, setShowColors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusPost = async () => {

    if (!statusText.trim()) return;

    try {

      setIsSubmitting(true)
      
      console.log('posting status', { text: statusText, backgroundColor })

      const newStatus = await mockFetch('/status', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({ 
          text: statusText,
          backgroundColor: backgroundColor,
        }),
      })

      if(onStatusCreated) {
        onStatusCreated(newStatus)
      }
    }
    catch (error) {
      console.error('failed to post status', error)
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="text-status-composer"
      style={{ backgroundColor }}
    >
      <div className="text-status-composer__header">
        <button
          className="text-status-composer__close"
          onClick={onClose}
          aria-label="Close status composer"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="text-status-composer__color-palette">
          <button
          type="button"
          className="text-status-composer__color-button"
          onClick={() => setShowColors((previous) => !previous)}
          aria-label="Choose background color"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61.43.53 1.03.89 1.7.89 1.13 0 1.93-.89 1.93-1.93 0-.46-.18-.89-.48-1.22-.38-.41-.59-.96-.59-1.55 0-1.22.98-2.2 2.2-2.2h1.87c2.43 0 4.4-1.97 4.4-4.4 0-2.32-1.78-4.19-4.1-4.19zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
        </button>

        {showColors && (
          <div className="text-status-composer__colors">
            {STATUS_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="text-status-composer__color"
                style={{ backgroundColor: color }}
                onClick={() => setBackgroundColor(color)}
                aria-label={`Choose ${color} background`}
              />
            ))}
          </div>
        )}
        </div>


      </div>


      <div className="text-status-composer__content">
        <textarea
          value={statusText}
          onChange={(event) => setStatusText(event.target.value)}
          placeholder="Type a status"
          aria-label="Status text"
          autoFocus
        />
      </div>

      <div className="text-status-composer__bottom">
        <button
          type="button"
          className={`status-composer__send-button ${statusText.trim() ? 'active'  : '' }`}
          onClick={() => handleStatusPost()}
          disabled={isSubmitting}
          aria-label="Send status update"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>

      </div>
    </div>
  );
}