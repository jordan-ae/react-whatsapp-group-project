// Calls section panel — SKELETON. Owned by the calls team.
//
// The sidebar shell renders this component in the sidebar body when the Calls
// tab is active (registered in ../sections.js). See ChatsPanel.jsx for a
// fully-worked example of the pattern.
//
// TODO(calls team): render the call history here.
//   1. const { calls, loading } = useCalls();  // from ../../../hooks/useCalls
//   2. Handle the loading / empty / list states. You can reuse the shared
//      body classes `.sidebar__list`, `.sidebar__loading`, `.sidebar__empty`
//      (defined in ../Sidebar.css).
//   3. Add a CallsPanel.css next to this file for any calls-specific styles.
export default function CallsPanel() {
  return (
    <div className="sidebar__list">
      <div className="sidebar__empty">Calls panel — coming soon</div>
    </div>
  );
}
