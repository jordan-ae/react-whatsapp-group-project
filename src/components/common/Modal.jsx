import './Modal.css';

export default function Modal({ isOpen, onClose, title, children, fullScreen = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${fullScreen ? 'modal--fullscreen' : ''}`} 
        onClick={(e) => e.stopPropagation()}>
          {!fullScreen && (
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="close modal">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
