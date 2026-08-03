import { useCalls } from '../hooks/useCalls';
import Avatar from '../components/common/Avatar';
import EmptyState from '../components/common/EmptyState';
import { formatTime, formatDuration } from '../utils/formatDate';
import { CALL_DIRECTIONS } from '../utils/constants';
import './CallsPage.css';

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const DIRECTION_ICONS = {
  [CALL_DIRECTIONS.INCOMING]: ArrowLeft,
  [CALL_DIRECTIONS.OUTGOING]: ArrowUpRight,
  [CALL_DIRECTIONS.MISSED]: ArrowRight,
};

export default function CallsPage() {
  const { calls, loading } = useCalls();

  return (
    <div className="calls-page">
      <div className="calls-page__header">
        <h2 className="calls-page__title">Calls</h2>
      </div>

      <div className="calls-page__actions">
        <button className="calls-page__create">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          Create call link
        </button>
      </div>

      <div className="calls-page__list">
        {loading ? (
          <div className="calls-page__loading">Loading...</div>
        ) : calls.length === 0 ? (
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
          calls.map((group) => {
            
            const direction = group?.latestCall?.direction;
            const DirectionIcon = DIRECTION_ICONS[direction] || ArrowRight;
            const isMissed = direction === CALL_DIRECTIONS.MISSED;

            return (
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
                    
                      <DirectionIcon 
                        size={16} 
                        color={isMissed ? '#ef4444' : 'currentColor'} 
                      />
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
            );
          })
        )}
      </div>
    </div>
  );
}
