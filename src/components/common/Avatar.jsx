import './Avatar.css';
import { Link } from 'react-router-dom';

export default function Avatar({ src, name, size = 'md', online, status, onClick }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9',
  ];
  const colorIndex = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div className={`avatar avatar--${size}`} onClick={onClick}>
       <Link to="/profile">
       {src ? (
        <img src={src} alt={name} className="avatar__img" />
      ) : (
        <div className="avatar__fallback" style={{ backgroundColor: bgColor }}>
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className={`avatar__status ${online ? 'avatar__status--online' : ''}`} />
      )}
      {status && (
        <span className={`avatar__badge avatar__badge--${status}`} />
      )}</Link>
    </div>
  );
}
