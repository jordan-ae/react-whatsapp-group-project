import { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import './CallScreen.css';

export default function CallScreen({ call, onEnd }) {
  if (!call) return null;
  const { user, type } = call;

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="call-screen">
      <div className="call-screen__header">
        <Avatar name={user.name} size="lg" />
        <div className="call-screen__info">
          <span className="call-screen__title">In call with {user.name}</span>
          <span className="call-screen__subtitle">
            {type === 'video' ? 'Video call' : 'Voice call'} in progress
          </span>
        </div>
      </div>

      <div className="call-screen__meta">
        <span className="call-screen__timer" aria-live="polite">
          {formatTime(seconds)}
        </span>
      </div>

      <div className="call-screen__controls">
        <button
          type="button"
          className={`call-screen__control-btn call-screen__mute ${muted ? 'is-muted' : ''}`}
          onClick={() => setMuted((value) => !value)}
          aria-pressed={muted}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>

        <button type="button" className="call-screen__control-btn call-screen__end-btn" onClick={onEnd}>
          End
        </button>
      </div>
    </div>
  );
}

