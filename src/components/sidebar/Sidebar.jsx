import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import SidebarHeader from './SidebarHeader';
import { SIDEBAR_SECTIONS, getActiveSection } from './sections';
import './Sidebar.css';

/**
 * Reusable sidebar shell: profile header + tab bar + the active section's panel.
 *
 * The shell owns the shared chrome only. The list body is owned by each
 * section's Panel (see `sections.js`), so teams manage their own content
 * independently and the shell stays generic. The active section is derived from
 * the current route, so it stays correct on deep-links and refreshes.
 */
export default function Sidebar() {
  const { setActiveTab, setSelectedChatId } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeSection = getActiveSection(pathname);
  const ActivePanel = activeSection.Panel;

  return (
    <aside className="sidebar">
      <SidebarHeader />

      <nav className="sidebar__tabs" aria-label="Sidebar sections">
        {SIDEBAR_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`sidebar__tab ${
              activeSection.id === section.id ? 'sidebar__tab--active' : ''
            }`}
            onClick={() => {
              setActiveTab(section.id);
              setSelectedChatId(null);
              navigate(section.path);
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <ActivePanel />
    </aside>
  );
}
