import { useState } from "react";
import { useCalls } from "../hooks/useCalls";
import Avatar from "../components/common/Avatar";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal.jsx";
import { formatTime, formatDuration } from "../utils/formatDate";
import { CALL_DIRECTIONS } from "../utils/constants";
import "./CallsPage.css";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";


const DIRECTION_ICONS = {
  [CALL_DIRECTIONS.INCOMING]: ArrowLeft,
  [CALL_DIRECTIONS.OUTGOING]: ArrowUpRight,
  [CALL_DIRECTIONS.MISSED]: ArrowRight,
};

export default function CallsPage() {
  const { calls, loading } = useCalls();
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [activeTab, setActiveTab] = useState("all");      
  const [expandedId, setExpandedId] = useState(null);     

  
  const filteredCalls = calls.filter(g => activeTab !== "missed" || g?.latestCall?.direction === CALL_DIRECTIONS.MISSED);

  return (
    <div className="calls-page">
      <div className="calls-page__header"><h2 className="calls-page__title">Calls</h2></div>

      <div className="calls-page__tabs">
        {["all", "missed"].map(tab => (
          <button 
            key={tab}
            className={`calls-page__tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      
      <div className="calls-page__actions">
        <button className="calls-page__create" onClick={() => setIsModalOpen(true)} type="button">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          Create call link
        </button>
      </div>

      
      <div className="calls-page__list">
        {loading ? (
          <div className="calls-page__loading">Loading...</div>
        ) : filteredCalls.length === 0 ? (
          <EmptyState
            title={activeTab === "missed" ? "No missed calls" : "No calls yet"}
            subtitle={activeTab === "missed" ? "You have no missed calls" : "Your call history will appear here"}
          />
        ) : (
          filteredCalls.map((group) => {
            const isMissed = group?.latestCall?.direction === CALL_DIRECTIONS.MISSED;
            const Icon = DIRECTION_ICONS[group?.latestCall?.direction] || ArrowRight;
            const isExpanded = expandedId === group.userId;

            return (
              <div key={group.userId} className="calls-page__group-wrapper">
                
                
                <div 
                  className={`calls-page__item ${isExpanded ? "expanded-header" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : group.userId)}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar name={group.name} size="md" />
                  <div className="calls-page__item-content">
                    <div className="calls-page__item-top">
                      <span className="calls-page__item-name">{group.name}</span>
                      <span className="calls-page__item-time">{formatTime(group.latestCall.timestamp)}</span>
                    </div>
                    <div className="calls-page__item-bottom">
                      <div className="calls-page__item-type">
                        <Icon size={16} color={isMissed ? "#ef4444" : "currentColor"} />
                        <span className={isMissed ? "calls-page__missed-text" : ""}>
                          {group.latestCall.type === "video" ? "Video call" : "Voice call"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="calls-page__item-actions" onClick={e => e.stopPropagation()}>
                    <button className="calls-page__expand-indicator" onClick={() => setExpandedId(isExpanded ? null : group.userId)}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {isExpanded && group.calls && (
                  <div className="calls-page__nested-history-list">
                    {group.calls.map((sub, idx) => {
                      const SubIcon = DIRECTION_ICONS[sub.direction] || ArrowRight;
                      const isSubMissed = sub.direction === CALL_DIRECTIONS.MISSED;

                      return (
                        <div key={sub.id || idx} className="calls-page__nested-item">
                          <div className="calls-page__nested-left">
                            <SubIcon size={14} color={isSubMissed ? "#ef4444" : "#8696a0"} />
                            <span className={isSubMissed ? "calls-page__missed-text" : ""}>
                              {sub.type === "video" ? "Video call" : "Voice call"}
                            </span>
                          </div>
                          <span className="calls-page__nested-time">{formatTime(sub.timestamp)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Call Link">
        <div className="create-link-modal-body" style={{ padding: "8px 0", color: "#8696a0" }}>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>Share link configurations to invite people to join voice rooms.</p>
          <div style={{ background: "#202c33", padding: "12px", borderRadius: "8px", border: "1px dashed #00a884" }}>
            <span style={{ color: "#00a884", fontFamily: "monospace" }}>https://whatsapp.clone</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
