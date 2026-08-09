# Sidebar

The sidebar is a **shared shell** that every section reuses. The shell owns the
common chrome — the profile header, the tab bar, and the scrolling body. Each
team owns the **panel** that renders inside the body for their tab.

```
Sidebar (shell)
├── SidebarHeader        ← shared
├── tab bar              ← shared, built from sections.js
└── <ActivePanel />      ← YOUR team's component
```

## Add or change your section

1. Create `panels/<YourTeam>Panel.jsx`. It renders into the shared body, so
   return a `.sidebar__list` container (see the shared classes in `Sidebar.css`:
   `.sidebar__list`, `.sidebar__loading`, `.sidebar__empty`).
2. Register it in [`sections.js`](./sections.js):

   ```js
   { id: 'calls', label: 'Calls', path: '/calls', Panel: CallsPanel }
   ```

3. Design the panel however your team needs — your own data hooks, list items,
   search, empty states, and a `<YourTeam>Panel.css` for panel-specific styles.

That's it. You never edit the shell or another team's panel.

## Example

[`panels/ChatsPanel.jsx`](./panels/ChatsPanel.jsx) is a fully-worked reference.
`CallsPanel.jsx` and `StatusPanel.jsx` are skeletons for those teams to fill in.
