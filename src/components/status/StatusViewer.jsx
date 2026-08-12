import { useEffect, useState } from "react";
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

  // Reset to the first status whenever a different status is opened.
  useEffect(() => {
    setCurrentIndex(0);
  }, [status]);

  // Automatically move to the next status every 3 seconds.
  useEffect(() => {
    if (!currentItem) return;

    const timer = setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((previousIndex) => previousIndex + 1);
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
      setCurrentIndex((previousIndex) => previousIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previousIndex) => previousIndex - 1);
    }
  };

  return (
    <div className="status-viewer">
      {/* Blurred background for image statuses */}
      {currentItem.type === STATUS_TYPES.IMAGE && currentItem.imageUrl && (
        <div
          className="status-viewer__background"
          style={{
            backgroundImage: `url(${currentItem.imageUrl})`,
          }}
          aria-hidden="true"
        />
      )}

      <div className="status-viewer__overlay" aria-hidden="true" />

      <div className="status-viewer__top">
        <div className="status-viewer__progress">
          {items.map((item, index) => (
            <div
              className="status-viewer__progress-segment"
              key={item.id || index}
            >
              <div
                className={`status-viewer__progress-fill ${
                  index < currentIndex
                    ? "status-viewer__progress-fill--complete"
                    : index > currentIndex
                      ? "status-viewer__progress-fill--upcoming"
                      : "status-viewer__progress-fill--active"
                }`}
                key={`${currentIndex}-${index}`}
              />
            </div>
          ))}
        </div>

        <div className="status-viewer__header">
          <Avatar
            name={status.name}
            size="sm"
          />

          <div className="status-viewer__user-info">
            <h2>{status.name}</h2>

            <span>
              {formatStatusTime(
                currentItem.timestamp || status.timestamp
              )}
            </span>
          </div>

          <button
            type="button"
            className="status-viewer__close"
            onClick={onClose}
            aria-label="Close status viewer"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        type="button"
        className="status-viewer__navigation status-viewer__navigation--previous"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous status"
      >
        ‹
      </button>

      <button
        type="button"
        className="status-viewer__navigation status-viewer__navigation--next"
        onClick={handleNext}
        disabled={currentIndex === items.length - 1}
        aria-label="Next status"
      >
        ›
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
              <div className="status-viewer__image-text">
                {currentItem.text}
              </div>
            )}

            {currentItem.caption && (
              <div className="status-viewer__caption">
                {currentItem.caption}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}