import "./StatusViewer.css";
import { STATUS_TYPES } from "../../utils/constants";

export default function StatusViewer({ status, onClose }) {
    if (!status) return null;

    const currentItem = status?.items?.[0];

    if (!currentItem) return null;

    return (
        <div className="status-viewer">
            <button 
              className="status-viewer__close"
              onClick={onClose}
              >
                x
            </button>

            <h2>{status.name}</h2>

            {currentItem.type === STATUS_TYPES.TEXT && (
                <div
                  className="status-viewer__text"
                  style={{
                    backgroundColor: currentItem.backgroundColor,
                    color: currentItem.textColor,
                  }}
                >
                    {currentItem.text}
                    </div>
                  )}
                  
                    {currentItem.type === STATUS_TYPES.IMAGE && (
                        <div className="status-viewer__image-wrapper">
                            <img 
                              src={currentItem.imageUrl || ""}
                              alt={currentItem.caption || "status"}
                              className="status-viewer__image" 
                              />

                   <p>{currentItem.caption}</p>
                </div>
            )}
        </div>
    );
}