import Avatar from '../common/Avatar';
import './CallScreen.css';

export default function CallScreen({ call, onEnd }) {
  if (!call) return null;
  const { user, type } = call;

  return (
    <div className="call-screen">
      <div className="call-screen__header">
        <Avatar name={user.name} size="lg" />
        <div className="call-screen__info">
          <span className="call-screen__title">In call with {user.name}</span>
          <span className="call-screen__subtitle">{type === 'video' ? 'Video call' : 'Voice call'} in progress</span>
        </div>
      </div>

      <button type="button" className="call-screen__end-btn" onClick={onEnd}>
        End
      </button>
    </div>
  );
}
import Avatar from '../common/Avatar';
import './CallScreen.css';

export default function CallScreen({ call, onEnd }) {
  if (!call) return null;
  const { user, type } = call;

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

      <button type="button" className="call-screen__end-btn" onClick={onEnd}>
        End
      </button>
    </div>
  );
}
