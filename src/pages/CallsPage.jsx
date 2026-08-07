import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Modal from '../components/common/Modal';
import { useCalls } from '../hooks/useCalls';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import { formatTime, formatDuration } from '../utils/formatDate';
import { CALL_DIRECTIONS } from '../utils/constants';
import './CallsPage.css';

export default function CallsPage() {
  const { calls, loading } = useCalls();
  const safeCalls = Array.isArray(calls) ? calls : [];
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { data: users, loading: usersLoading } = useApi('/users');
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="calls-page">
      <div className="calls-page__header">
        <h2 className="calls-page__title">Calls</h2>
      </div>

      <div className="calls-page__actions">
        <div className="calls-page__create">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          Create call link
          <button
            className="calls-page__new-call"
            onClick={() => setIsPickerOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
            New call
          </button>
        </div>
      </div>

      <div className="calls-page__list">
        {loading ? (
          <div className="calls-page__loading">Loading...</div>
        ) : safeCalls.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            }
            title="No calls yet"
            subtitle="Your call history will appear here"
          />
        ) : (
          safeCalls.map((group) => (
            <div key={group.userId} className="calls-page__item">
              <Avatar name={group.name} size="md" />
              <div className="calls-page__item-content">
                <div className="calls-page__item-top">
                  <span className="calls-page__item-name">{group.name}</span>
                  <span className="calls-page__item-time">
                    {formatTime(group.latestCall.timestamp)}
                  </span>
                </div>
                <div className="calls-page__item-bottom">
                  <div className="calls-page__item-type">
                    {group.latestCall.direction === CALL_DIRECTIONS.INCOMING && (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 15l-6-6-4 4-4-4" />
                      </svg>
                    )}
                    {group.latestCall.direction === CALL_DIRECTIONS.OUTGOING && (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M5 9l6 6 4-4 4 4" />
                      </svg>
                    )}
                    {group.latestCall.direction === CALL_DIRECTIONS.MISSED && (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="calls-page__missed">
                        <path d="M19 15l-6-6-4 4-4-4" />
                      </svg>
                    )}
                    <span className={
                      group.latestCall.direction === CALL_DIRECTIONS.MISSED
                        ? 'calls-page__missed-text'
                        : ''
                    }>
                      {group.latestCall.type === 'video' ? 'Video call' : 'Voice call'}
                    </span>
                  </div>
                  {group.latestCall.answered && group.latestCall.duration > 0 && (
                    <span className="calls-page__duration">
                      {formatDuration(group.latestCall.duration)}
                    </span>
                  )}
                </div>
              </div>
              <button className="calls-page__call-btn" title="Call">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        title="Select a contact"
      >
        {usersLoading ? (
          <div className="calls-page__loading">
            Loading contacts...
          </div>
        ) : (
          <div className="calls-page__contacts">
            {safeUsers.map((user) => (
              <button
                key={user.id}
                className="calls-page__contact"
                type="button"
              >
                <Avatar
                  name={user.name}
                  size="md"
                />

                <span>{user.name}</span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
