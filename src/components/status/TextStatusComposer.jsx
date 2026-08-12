import { useState } from "react";
import "./TextStatusComposer.css";
import { STATUS_COLORS } from "../../utils/constants";

export default function TextStatusComposer({ onClose }) {
  const [statusText, setStatusText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#25d366");
  const [showColors, setShowColors] = useState(false);

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
          x
        </button>

        <h2>Add status</h2>
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

        <button
          type="button"
          className="text-status-composer__color-button"
          onClick={() => setShowColors((previous) => !previous)}
          aria-label="Choose background color"
        >
          🎨
        </button>
      </div>
    </div>
  );
}