import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 001.256-3.386 5.207 5.207 0 10-5.207 5.207 5.184 5.184 0 003.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.006zm-4.808 0a3.605 3.605 0 110-7.21 3.605 3.605 0 010 7.21z" />
        </svg>
      </span>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      )}
    </div>
  );
}
