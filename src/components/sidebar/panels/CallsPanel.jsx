import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useCalls } from '../../../hooks/useCalls';
import Avatar from '../../common/Avatar';
import { formatTime } from '../../../utils/formatDate';
import { CALL_DIRECTIONS, CALL_TYPES } from '../../../utils/constants';
import './CallsPanel.css';

const DIRECTION_ICONS = {
  [CALL_DIRECTIONS.INCOMING]: ArrowDownLeft,
  [CALL_DIRECTIONS.OUTGOING]: ArrowUpRight,
  [CALL_DIRECTIONS.MISSED]: ArrowDownLeft,
};

export default function CallsPanel() {
  const { calls, loading } = useCalls();
  const safeCalls = Array.isArray(calls) ? calls : [];
  const [activeTab, setActiveTab] = useState('all');
  const [expandedContactId, setExpandedContactId] = useState(null);

  if (loading) {
    return <div className="sidebar__loading">Loading...</div>;
  }

  const filteredGroups = safeCalls.filter((group) => {
    if (activeTab === 'missed') {
      return group.calls?.some((call) => call.direction === CALL_DIRECTIONS.MISSED);
    }
    return true;
  });

  if (filteredGroups.length === 0) {
    return (
      <div className="sidebar__list">
        <div className="calls-panel__tabs">
          <button 
            type="button"
            className={`calls-panel__tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            type="button"
            className={`calls-panel__tab-btn ${activeTab === 'missed' ? 'active' : ''}`}
            onClick={() => setActiveTab('missed')}
          >
            Missed
          </button>
        </div>
        <div className="sidebar__empty">
          {activeTab === 'missed' ? 'No missed calls found.' : 'No calls yet. Your call history will appear here.'}
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar__list">
      <div className="calls-panel__tabs">
        <button 
          type="button"
          className={`calls-panel__tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          type="button"
          className={`calls-panel__tab-btn ${activeTab === 'missed' ? 'active' : ''}`}
          onClick={() => setActiveTab('missed')}
        >
          Missed
        </button>
      </div>

      <div className="calls-panel__log-list">
        {filteredGroups.map((group) => {
          const isExpanded = expandedContactId === group.userId;
          const nestedListId = `nested-list-${group.userId}`;

          const displayCall = activeTab === 'missed'
            ? (group.calls?.find((call) => call.direction === CALL_DIRECTIONS.MISSED) || group.latestCall)
            : group.latestCall;

          return (
            <div key={group.userId} className="calls-panel__log-group">
              <div 
                className={`calls-panel__item ${isExpanded ? 'calls-panel__item--expanded' : ''}`}
                onClick={() => setExpandedContactId(isExpanded ? null : group.userId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setExpandedContactId(isExpanded ? null : group.userId);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={isExpanded ? nestedListId : undefined}
                style={{ cursor: 'pointer' }}
              >
                <Avatar name={group.name} size="md" />

                <div className="calls-panel__item-content">
                  <div className="calls-panel__item-top">
                    <span className="calls-panel__item-name">
                      {group.name}
                      {group.calls?.length > 1 && (
                        <span className="calls-panel__item-count">{group.calls.length}</span>
                      )}
                    </span>
                    <span className="calls-panel__item-time">
                      {formatTime(displayCall.timestamp)}
                    </span>
                  </div>

                  <div className="calls-panel__item-bottom">
                    <div className="calls-panel__item-meta">
                      {(() => {
                        const { direction } = displayCall;
                        const DirectionIcon = DIRECTION_ICONS[direction] ?? ArrowRight;
                        const isMissed = direction === CALL_DIRECTIONS.MISSED;
                        return (
                          <DirectionIcon
                            size={14}
                            className={`calls-panel__icon ${isMissed ? 'calls-panel__icon--missed' : ''}`}
                            aria-hidden="true"
                          />
                        );
                      })()}

                      <span className={`calls-panel__item-type ${displayCall.direction === CALL_DIRECTIONS.MISSED ? 'calls-panel__item-type--missed' : ''}`}>
                        {displayCall.type === 'video' ? 'Video call' : 'Voice call'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && group.calls && (
                <div id={nestedListId} className="calls-panel__nested-list">
                  {group.calls.map((sub, idx) => {
                    const SubIcon = DIRECTION_ICONS[sub.direction] ?? ArrowRight;
                    const isSubMissed = sub.direction === CALL_DIRECTIONS.MISSED;

                    return (
                      <div key={sub.id || idx} className="calls-panel__nested-item">
                        <div className="calls-panel__nested-left">
                          <SubIcon 
                            size={12} 
                            className={`calls-panel__icon ${isSubMissed ? 'calls-panel__icon--missed' : ''}`} 
                          />
                          <span className={isSubMissed ? "calls-panel__item-type--missed" : "calls-panel__nested-text"}>
                            {sub.type === CALL_TYPES.VIDEO ? "Video call" : "Voice call"}
                          </span>
                        </div>
                        <span className="calls-panel__nested-time">{formatTime(sub.timestamp)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
