// Status section panel — SKELETON. Owned by the status team.
//
// The sidebar shell renders this component in the sidebar body when the Status
// tab is active (registered in ../sections.js). See ChatsPanel.jsx for a
// fully-worked example of the pattern.
//
// TODO(status team): render status updates here.
//   1. const { myStatus, recentStatus, viewedStatus, loading } = useStatus();
//      // from ../../../hooks/useStatus
//   2. Show "My status" plus the Recent and Viewed sections. You can reuse the
//      shared body classes `.sidebar__list`, `.sidebar__loading`,
//      `.sidebar__empty` (defined in ../Sidebar.css).
//   3. Add a StatusPanel.css next to this file for any status-specific styles.
import { useState } from 'react';
import { useStatus } from '../../../hooks/useStatus';
import Avatar from '../../common/Avatar';
import { formatStatusTime } from '../../../utils/formatDate';
import StatusViewer from '../../status/StatusViewer';
import Modal from '../../common/Modal';
import TextStatusComposer from '../../status/TextStatusComposer';
import './StatusPanel.css';

export default function StatusPanel() {
  const {
    myStatus,
    recentStatus,
    viewedStatus,
    loading,
  } = useStatus();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="sidebar__list">
        <div className="sidebar__loading">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sidebar__list">

        <div className="status-panel__section-title">
          My status
        </div>

        <div className="status-panel__item">
          <div className="status-panel__avatar-wrapper">
            <Avatar
              name={myStatus?.name || 'You'}
              size="lg"
              ring={myStatus ? 'unviewed' : undefined}
            />

            <button
              type="button"
              className="status-panel__add"
              onClick={() => setShowModal(true)}
              aria-label="Add a status update"
            >
              +
            </button>
          </div>

          <div className="status-panel__content">
            <span className="status-panel__name">
              My status
            </span>

            <span className="status-panel__time">
              {myStatus
                ? formatStatusTime(myStatus.timestamp)
                : 'Tap to add status update'}
            </span>
          </div>
        </div>

        <div className="status-panel__section-title">
          Recent updates
        </div>

        {recentStatus.length === 0 ? (
          <div className="sidebar__empty">
            No recent status updates
          </div>
        ) : (
          recentStatus.map((statusItem) => (
            <div
              key={statusItem.id}
              className="status-panel__item"
              onClick={() => setSelectedStatus(statusItem)}
            >
              <Avatar
                name={statusItem.name}
                size="lg"
                ring="unviewed"
              />

              <div className="status-panel__content">
                <span className="status-panel__name">
                  {statusItem.name}
                </span>

                <span className="status-panel__time">
                  {formatStatusTime(statusItem.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}

        {viewedStatus.length > 0 && (
          <>
            <div className="status-panel__section-title">
              Viewed updates
            </div>

            {viewedStatus.map((statusItem) => (
              <div
                key={statusItem.id}
                className="status-panel__item"
                onClick={() => setSelectedStatus(statusItem)}
              >
                <Avatar
                  name={statusItem.name}
                  size="lg"
                  ring="viewed"
                />

                <div className="status-panel__content">
                  <span className="status-panel__name">
                    {statusItem.name}
                  </span>

                  <span className="status-panel__time">
                    {formatStatusTime(statusItem.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="New status"
          fullScreen
        >
          <TextStatusComposer
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}

      {selectedStatus && (
        <StatusViewer
          status={selectedStatus}
          onClose={() => setSelectedStatus(null)}
        />
      )}
    </>
  );
}
