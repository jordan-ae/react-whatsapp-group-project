import { useApp } from '../contexts/AppContext';
import { useStatus } from '../hooks/useStatus';
import { useState } from 'react';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import { formatStatusTime } from '../utils/formatDate';
import './StatusPage.css';
import StatusViewer from '../components/status/StatusViewer';
import Modal from "../components/common/Modal"

export default function StatusPage() {
  const { currentUser } = useApp();
  const { myStatus, recentStatus, viewedStatus, loading } = useStatus();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const renderStatusItem = (statusItem) => (
    <div 
      key={statusItem.id} 
      className="status-page__item"
      onClick={() => setSelectedStatus(statusItem)}
    >
      <Avatar
        name={statusItem.name}
        size="lg"
        ring={statusItem.viewed ? 'viewed' : 'unviewed'}
      />
      <div className="status-page__item-content">
        <span className="status-page__item-name">{statusItem.name}</span>
        <span className="status-page__item-time">
          {formatStatusTime(statusItem.timestamp)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="status-page">
      <div className="status-page__header">
        <h2 className="status-page__title">Status</h2>
      </div>

      <div className="status-page__my-status">
        <div className="status-page__my-avatar">
          <Avatar name={currentUser?.name || "You"} size="lg" />
          <div className="status-page__add-btn">
            <button className="status-add" onClick={() => setShowModal(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            </button>
          </div>
        </div>
        <div className="status-page__my-content">
          <span className="status-page__my-name">My status</span>
          <span className="status-page__my-time">
            {myStatus ? formatStatusTime(myStatus.timestamp) : "Tap to add status update"}
          </span>
        </div>
      </div>

      <div className="status-page__section">
        <h3 className="status-page__section-title">Recent updates</h3>
        <div className="status-page__list">
          {loading ? (
            <div className="status-page__loading">Loading...</div>
          ) : recentStatus.length === 0 ? (
            <p className="status-page__empty-text">No recent status updates</p>
          ) : (
            recentStatus.map(renderStatusItem)
          )}
        </div>
      </div>

      {viewedStatus.length > 0 && (
        <div className="status-page__section">
          <h3 className="status-page__section-title">Viewed updates</h3>
          <div className="status-page__list">
            {viewedStatus.map(renderStatusItem)}
          </div>
        </div>
      )}

      {selectedStatus && (
        <StatusViewer
           status={selectedStatus}
           onClose={() => setSelectedStatus(null)}
        />
      )}

      {
        showModal && (
          <Modal 
             isOpen={showModal}
             onClose={() => setShowModal(false)}
             title="add-status"
             >
            <div className="status-composer">
              create your status
            </div>
          </Modal>
        )
      }
    </div>
  );
}
