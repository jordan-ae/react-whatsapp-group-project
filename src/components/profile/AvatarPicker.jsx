import './AvatarPicker.css';

export default function AvatarPicker({ presetAvatars, newAvatarUrl, onSelect, onApply }) {
  return (
    <div className="photo-picker">
      <div className="photo-picker__preview">
        <div
          className="photo-picker__avatar"
          style={newAvatarUrl.type === "color" ? { backgroundColor: newAvatarUrl.value } : {}}
        >
          {newAvatarUrl.type === "emoji" ? newAvatarUrl.value : null}
        </div>
      </div>

      <div className="photo-picker__grid">
        {presetAvatars.map((option, index) => (
          <button
            key={index}
            type="button"
            className={
              newAvatarUrl.value === option.value
                ? "photo-picker__option photo-picker__option--selected"
                : "photo-picker__option"
            }
            style={option.type === "color" ? { backgroundColor: option.value } : {}}
            onClick={() => onSelect(option)}
          >
            {option.type === "emoji" ? option.value : null}
          </button>
        ))}
      </div>

      <button type="button" className="photo-picker__apply-btn" onClick={onApply}>
        Set as profile photo
      </button>
    </div>
  );
}
