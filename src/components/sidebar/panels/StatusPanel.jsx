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
import { useState } from "react";
import { useStatus } from "../../../hooks/useStatus";
import Avatar from "../../common/Avatar";
import { formatStatusTime } from "../../../utils/formatDate";
import StatusViewer from "../../status/StatusViewer";
import Modal from "../../common/Modal";
import TextStatusComposer from "../../status/TextStatusComposer";
import "./StatusPanel.css";

export default function StatusPanel() {
  const {
    myStatus,
    recentStatus,
    viewedStatus,
    loading,
  } = useStatus();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const hasRecentStatus = recentStatus && recentStatus.length > 0;
  const hasViewedStatus = viewedStatus && viewedStatus.length > 0;

  if (loading) {
    return (
      <div className="sidebar__list">
        <div className="sidebar__loading">
          Loading statuses...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="sidebar__list status-panel">

        <section className="status-panel__section">
          <h3 className="status-panel__heading">
            My status
          </h3>

          <div
            className="status-panel__item status-panel__my-status"
            onClick={() => {
              if (myStatus) {
                setSelectedStatus(myStatus);
              } else {
                setShowModal(true);
              }
            }}
          >
            <div className="status-panel__avatar-wrapper">
              <Avatar
                name={myStatus?.name || "You"}
                size="lg"
                ring={myStatus ? "unviewed" : undefined}
              />

              <button
                type="button"
                className="status-panel__add-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowModal(true);
                }}
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
                  : "Tap to add status update"}
              </span>
            </div>
          </div>
        </section>

        {hasRecentStatus && (
          <section className="status-panel__section">
            <h3 className="status-panel__heading">
              Recent updates
            </h3>

            <div className="status-panel__items">
              {recentStatus.map((status) => (
                <div
                  className="status-panel__item"
                  key={status.id}
                  onClick={() => setSelectedStatus(status)}
                >
                  <Avatar
                    name={status.name}
                    size="lg"
                    ring="unviewed"
                  />

                  <div className="status-panel__content">
                    <span className="status-panel__name">
                      {status.name}
                    </span>

                    <span className="status-panel__time">
                      {formatStatusTime(status.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasViewedStatus && (
          <section className="status-panel__section">
            <h3 className="status-panel__heading">
              Viewed updates
            </h3>

            <div className="status-panel__items">
              {viewedStatus.map((status) => (
                <div
                  className="status-panel__item"
                  key={status.id}
                  onClick={() => setSelectedStatus(status)}
                >
                  <Avatar
                    name={status.name}
                    size="lg"
                    ring="viewed"
                  />

                  <div className="status-panel__content">
                    <span className="status-panel__name">
                      {status.name}
                    </span>

                    <span className="status-panel__time">
                      {formatStatusTime(status.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!myStatus &&
          !hasRecentStatus &&
          !hasViewedStatus && (
            <div className="sidebar__empty">
              No status updates
            </div>
          )}
      </div>

      {selectedStatus && (
        <StatusViewer
          status={selectedStatus}
          onClose={() => setSelectedStatus(null)}
        />
      )}

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
    </>
  );
}