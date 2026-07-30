import './Badge.css';

export default function Badge({ count, variant = 'default' }) {
  if (!count || count <= 0) return null;

  const display = count > 99 ? '99+' : count;

  return (
    <span className={`badge badge--${variant}`}>
      {display}
    </span>
  );
}
