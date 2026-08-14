import { useState, useEffect } from "react";
import "./StatusViewer.css";
import { STATUS_TYPES } from "../../utils/constants";
import ImageWithFallback from "../common/ImageWithFallback";

export default function StatusViewer({ status, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = status?.items ?? [];
  const currentItem = items[currentIndex];

  const DURATION_MS = 3000;

  // useEffect set timer when the status is opened
  useEffect(() => {
    setCurrentIndex(0);
  }, [status]);
  // Auto-advance timer
  useEffect(() => {
    if (!currentItem) return;
    const timer = setTimeout(() => {
      if (currentIndex < items.length -1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, DURATION_MS);
    
    return () => clearTimeout(timer);
  }, [currentIndex, currentItem, items.length, onClose]);

    if (!status || !currentItem) {
      return null;
    }

    const handleNext = () => {
      if (currentIndex < status.items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };
    
    return (

        <div className="status-viewer">
          <div className="status-progress-bar-container">

          {items.map((_, index) => {

            const isActive = index === currentIndex;
            
            const isComplete = index < currentIndex;

            return (

              <div key={index} className={`status-progress-bar ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}>
              <div key={isActive ? currentIndex : index } className="status-progress-bar__fill" style={isActive ? {"--fill-ms": `${DURATION_MS}ms` }: undefined}/>
              </div>
            )              
         })}

          </div>
            <button 
              className="status-viewer__close"
              onClick={onClose}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
            </button>

            <button 
              className="previous"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>

            <button 
               className="next"
               onClick={handleNext}
               disabled={currentIndex === items.length - 1}
               >
                &gt;
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
                            <ImageWithFallback
                              src={currentItem.imageUrl}
                              alt={currentItem.caption || "status"}
                              className="status-viewer__image"
                              fallbackLabel="This status image couldn't be loaded"
                            />

                  <h3 className="status-viewer__image-text">{currentItem.text}</h3>
                   <p>{currentItem.caption}</p>
                </div>
                
            )}
        </div>
    );
}