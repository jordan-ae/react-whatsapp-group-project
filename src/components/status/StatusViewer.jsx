import "./StatusViewer.css";
import { useState, useEffect } from "react";
import { STATUS_TYPES } from "../../utils/constants";
import ImageWithFallback from "../common/ImageWithFallback";

export default function StatusViewer({ status, onClose }) {
   
  const [currentIndex, setCurrentIndex] = useState(0);

    if (!status) return null;

    const currentItem = status?.items?.[currentIndex];

    if (!currentItem) return null;

    const handleNext = () => {
      if (currentIndex < status.items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // onClose();
      }
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    // Auto-advance with timer

    useEffect(() => {
      const timer = setTimeout(() => {
        if (currentIndex < status.items.length - 1) {
          setCurrentIndex ((prev) => prev + 1);
        } else {
          onClose();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }, [currentIndex, status,onClose]);

    return (
        <div className="status-viewer">
            <button 
              className="status-viewer__close"
              onClick={onClose}
              >
                x
            </button>

            <button 
              className="previous"
              onClick={handlePrevious}
              // disabled={currentIndex === 0}
            >
              &lt;
            </button>

            <button 
               className="next"
               onClick={handleNext}
              //  disabled={currentIndex === status.items.length - 1}
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

                   <p>{currentItem.caption}</p>
                </div>
            )}
        </div>
    );
}