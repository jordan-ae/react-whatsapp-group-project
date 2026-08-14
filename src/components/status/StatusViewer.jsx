import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  MessageCircle,
  Pause,
  Send,
  Smile,
  VolumeX,
  X,
} from "lucide-react";
import "./StatusViewer.css";
import { STATUS_TYPES } from "../../utils/constants";
import ImageWithFallback from "../common/ImageWithFallback";
import Avatar from "../common/Avatar";

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

  const statusDate = new Date(
    currentItem.timestamp || status.timestamp
  );

  const formattedDate = statusDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = statusDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const now = new Date();

  const isToday =
    statusDate.getDate() === now.getDate() &&
    statusDate.getMonth() === now.getMonth() &&
    statusDate.getFullYear() === now.getFullYear();

  const displayTime = isToday
    ? `Today at ${formattedTime}`
    : `${formattedDate} at ${formattedTime}`;

  return (
    <div
      className="status-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${status.name}'s status`}
    >

      <div className="status-viewer__background">
        {currentItem.type === STATUS_TYPES.IMAGE &&
          currentItem.imageUrl && (
            <img
              src={currentItem.imageUrl}
              alt=""
              aria-hidden="true"
            />
          )}

        {currentItem.type === STATUS_TYPES.TEXT && (
          <div
            className="status-viewer__background-text"
            style={{
              backgroundColor: currentItem.backgroundColor,
            }}
          />
        )}
      </div>

      <div className="status-viewer__background-overlay" />

      <button
        type="button"
        className="status-viewer__back"
        onClick={onClose}
        aria-label="Close status viewer"
      >
        <ChevronLeft size={30} strokeWidth={2} />
      </button>

      <button
        type="button"
        className="status-viewer__close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={25} strokeWidth={2} />
      </button>

      <div className="status-viewer__card">

        <div className="status-viewer__progress">
          {items.map((item, index) => (
            <div
              className="status-viewer__progress-segment"
              key={item.id}
            >
              <div
                className={`status-viewer__progress-fill ${
                  index < currentIndex
                    ? "is-complete"
                    : index === currentIndex
                      ? "is-active"
                      : "is-upcoming"
                }`}
                key={`${currentIndex}-${index}`}
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
                {displayTime}
              </span>

            </div>

          </div>

          <div className="status-viewer__actions">

            <button
              type="button"
              className="status-viewer__action"
              aria-label="Pause status"
            >
              <Pause size={19} />
            </button>

            <button
              type="button"
              className="status-viewer__action"
              aria-label="Mute status"
            >
              <VolumeX size={19} />
            </button>

            <button
              type="button"
              className="status-viewer__action"
              aria-label="More options"
            >
              <EllipsisVertical size={20} />
            </button>
          </div>
        </div>
        <div className="status-viewer__content">

          {currentItem.type === STATUS_TYPES.TEXT && (
            <div
              className="status-viewer__text"
              style={{
                backgroundColor:
                  currentItem.backgroundColor,
                color: currentItem.textColor,
              }}
            >
              <span>
                {currentItem.text}
              </span>
            </div>
          )}

          {currentItem.type === STATUS_TYPES.IMAGE && (
            <div className="status-viewer__image-wrapper">

              <ImageWithFallback
                src={currentItem.imageUrl}
                alt={
                  currentItem.caption ||
                  "Status image"
                }
                className="status-viewer__image"
                fallbackLabel="This status image couldn't be loaded"
              />

              {(currentItem.text ||
                currentItem.caption) && (
                <div className="status-viewer__caption">

                  {currentItem.text && (
                    <h3>
                      {currentItem.text}
                    </h3>
                  )}

                  {currentItem.caption && (
                    <p>
                      {currentItem.caption}
                    </p>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          className="status-viewer__navigation status-viewer__navigation--previous"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous status"
        >
          <ChevronLeft size={34} />
        </button>

        <button
          type="button"
          className="status-viewer__navigation status-viewer__navigation--next"
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          aria-label="Next status"
        >
          <ChevronRight size={34} />
        </button>

        <div className="status-viewer__reply">

          <button
            type="button"
            className="status-viewer__reply-icon"
            aria-label="Add emoji"
          >
            <Smile size={22} />
          </button>

          <button
            type="button"
            className="status-viewer__reply-icon"
            aria-label="React to status"
          >
            <MessageCircle size={21} />
          </button>

          <div className="status-viewer__reply-input">
            <span>
              Reply to {status.name}...
            </span>
          </div>

          <button
            type="button"
            className="status-viewer__send"
            aria-label="Send reply"
          >
            <Send size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}