import ChatsPanel from './panels/ChatsPanel';
import CallsPanel from './panels/CallsPanel';
import StatusPanel from './panels/StatusPanel';

/**
 * Sidebar section registry.
 *
 * The sidebar is a shared shell (profile header + tab bar + scrolling body).
 * Each section owns one tab and the `Panel` rendered in the body when that tab
 * is active. A team manages its own section by editing its Panel component — no
 * team needs to touch the shell or another team's panel.
 *
 * To add a section: create `panels/<Name>Panel.jsx` and register it here.
 *
 *   id    - stable key, also written to AppContext.activeTab
 *   label - tab text
 *   path  - route the tab navigates to (also used to detect the active section)
 *   Panel - component rendered in the sidebar body for this section
 */
export const SIDEBAR_SECTIONS = [
  { id: 'chats', label: 'Chats', path: '/chat', Panel: ChatsPanel },
  { id: 'calls', label: 'Calls', path: '/calls', Panel: CallsPanel },
  { id: 'status', label: 'Status', path: '/status', Panel: StatusPanel },
];

/** Pick the section for the current route; falls back to the first section. */
export function getActiveSection(pathname) {
  return (
    SIDEBAR_SECTIONS.find((section) => pathname.startsWith(section.path)) ??
    SIDEBAR_SECTIONS[0]
  );
}
