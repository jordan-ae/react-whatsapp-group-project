import { useCalls } from '../../../hooks/useCalls';
import Avatar from '../../common/Avatar';
import { formatTime } from '../../../utils/formatDate';
import { CALL_DIRECTIONS } from '../../../utils/constants';
import './CallsPanel.css';

export default function CallsPanel() {
  const { calls, loading } = useCalls();
  const safeCalls = Array.isArray(calls) ? calls : [];

  if (loading) {
    return <div className="sidebar__loading">Loading...</div>;
  }

  if (safeCalls.length === 0) {
    return (
      <div className="sidebar__empty">
        No calls yet. Your call history will appear here.
      </div>
    );
  }

  return (
    <div className="sidebar__list">
      {safeCalls.map((group) => (
        <div key={group.userId} className="calls-panel__item">
          <Avatar name={group.name} size="md" />
          
          <div className="calls-panel__item-content">
            <div className="calls-panel__item-top">
              <span className="calls-panel__item-name">{group.name}</span>
              <span className="calls-panel__item-time">
                {formatTime(group.latestCall.timestamp)}
              </span>
            </div>
            
            <div className="calls-panel__item-bottom">
              <div className="calls-panel__item-meta">
                {group.latestCall.direction === CALL_DIRECTIONS.INCOMING && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="calls-panel__icon">
                    <path d="M19 15l-6-6-4 4-4-4" />
                  </svg>
                )}
                {group.latestCall.direction === CALL_DIRECTIONS.OUTGOING && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="calls-panel__icon">
                    <path d="M5 9l6 6 4-4 4 4" />
                  </svg>
                )}
                {group.latestCall.direction === CALL_DIRECTIONS.MISSED && (
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="calls-panel__icon calls-panel__icon--missed">
                    <path d="M19 15l-6-6-4 4-4-4" />
                  </svg>
                )}
                
                <span className={`calls-panel__item-type ${group.latestCall.direction === CALL_DIRECTIONS.MISSED ? 'calls-panel__item-type--missed' : ''}`}>
                  {group.latestCall.type === 'video' ? 'Video call' : 'Voice call'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
