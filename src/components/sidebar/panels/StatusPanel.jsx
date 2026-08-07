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
export default function StatusPanel() {
  return (
    <div className="sidebar__list">
      <div className="sidebar__empty">Status panel — coming soon</div>
    </div>
  );
}
