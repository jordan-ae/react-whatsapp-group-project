import './Avatar.css';

export default function Avatar({ src, name, size = 'md', online, status, onClick , ring}) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

    const ringClass = ring ? `avatar--ring-${ring}` : '';
    
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9',
  ];
  const colorIndex = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  const isColorHex = src && src.startsWith('#');
  const isEmoji = src && !isColorHex && /\p{Emoji}/u.test(src);
  const isImageUrl = src && !isColorHex && !isEmoji;
  
  return (
    <div className={`avatar avatar--${size} ${ring ? 'avatar--has-ring' : ''} ${ring === 'viewed' ? 'avatar--viewed' : ''}`} onClick={onClick}>
      {isImageUrl ? (
        <img src={src} alt={name} className="avatar__img" />
      ) : isColorHex ? (
        <div className="avatar__fallback" style={{ backgroundColor: src }} />
      ) : isEmoji ? (
        <div className="avatar__fallback" style={{ backgroundColor: bgColor }}>
          {src}
        </div>
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
      )}
    </div>
  );
}
