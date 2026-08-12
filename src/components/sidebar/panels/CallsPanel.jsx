import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useCalls } from '../../../hooks/useCalls';
import Avatar from '../../common/Avatar';
import { formatTime } from '../../../utils/formatDate';
import { CALL_DIRECTIONS } from '../../../utils/constants';
import './CallsPanel.css';

// A missed call is an *incoming* call that wasn't answered, so it shares the
// incoming arrow — the red `--missed` class carries the difference, not a
// different direction.
const DIRECTION_ICONS = {
  [CALL_DIRECTIONS.INCOMING]: ArrowDownLeft,
  [CALL_DIRECTIONS.OUTGOING]: ArrowUpRight,
  [CALL_DIRECTIONS.MISSED]: ArrowDownLeft,
};

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
                {(() => {
                  const { direction } = group.latestCall;
                  const DirectionIcon = DIRECTION_ICONS[direction] ?? ArrowDownLeft;
                  const isMissed = direction === CALL_DIRECTIONS.MISSED;
                  return (
                    <DirectionIcon
                      size={14}
                      className={`calls-panel__icon ${isMissed ? 'calls-panel__icon--missed' : ''}`}
                      aria-hidden="true"
                    />
                  );
                })()}


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
