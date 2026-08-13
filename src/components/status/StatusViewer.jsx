import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "./StatusViewer.css";
import { STATUS_TYPES } from "../../utils/constants";
import ImageWithFallback from "../common/ImageWithFallback";
import Avatar from "../common/Avatar";
import { formatStatusTime } from "../../utils/formatDate";

const DURATION_MS = 3000;

export default function StatusViewer({ status, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = status?.items ?? [];
  const currentItem = items[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [status]);

  useEffect(() => {
    if (!currentItem) return;

    const timer = setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((previous) => previous + 1);
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
    if (currentIndex < items.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  return (
    <div
      className="status-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${status.name}'s status`}
    >
      <div className="status-viewer__top-scrim" />

      <div className="status-viewer__progress">
        {items.map((item, index) => (
          <div
            className="status-viewer__progress-segment"
            key={item.id}
          >
            <div
              key={`${currentIndex}-${index}`}
              className={`status-viewer__progress-fill ${
                index < currentIndex
                  ? "status-viewer__progress-fill--complete"
                  : index === currentIndex
                    ? "status-viewer__progress-fill--active"
                    : "status-viewer__progress-fill--upcoming"
              }`}
              style={
                index === currentIndex
                  ? {
                      animationDuration: `${DURATION_MS}ms`,
                    }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <div className="status-viewer__header">
        <div className="status-viewer__user">
          <Avatar
            name={status.name}
            size="sm"
            ring={status.viewed ? "viewed" : "unviewed"}
          />

          <div className="status-viewer__user-info">
            <span className="status-viewer__name">
              {status.name}
            </span>

            <span className="status-viewer__time">
              {formatStatusTime(status.timestamp)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="status-viewer__close"
          onClick={onClose}
          aria-label="Close status"
        >
          <X size={26} strokeWidth={2} />
        </button>
      </div>

      <button
        type="button"
        className="status-viewer__navigation status-viewer__navigation--previous"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous status"
      >
        <ChevronLeft size={32} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        className="status-viewer__navigation status-viewer__navigation--next"
        onClick={handleNext}
        disabled={currentIndex === items.length - 1}
        aria-label="Next status"
      >
        <ChevronRight size={32} strokeWidth={1.8} />
      </button>

      <div className="status-viewer__content">
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

            {currentItem.text && (
              <h3 className="status-viewer__image-text">
                {currentItem.text}
              </h3>
            )}

            {currentItem.caption && (
              <p className="status-viewer__image-caption">
                {currentItem.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}