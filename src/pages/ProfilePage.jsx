import { useState, useEffect, useRef } from "react";
import { mockFetch } from "../utils/mockFetch";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";
import Avatar from "../components/common/Avatar";
import AvatarPicker from "../components/profile/AvatarPicker";
import Modal from "../components/common/Modal";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { currentUser, setCurrentUser, updateName, updateAbout, updateAvatar } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about, setAbout] = useState("");
  const [nameError, setNameError] = useState("");
  const { theme, toggleTheme } = useTheme();
  const errorTimeoutRef = useRef(null);

  const presetColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#bb8fce", "#f7dc6f", "#dda0dd", "#ffeaa7", "#96ceb4"];
  const presetEmojis = ["😀", "😎", "🐱", "🐶", "🦊", "🐼", "🐸", "🤖"];

  const presetAvatars = [
    ...presetColors.map((value) => ({ type: "color", value })),
    ...presetEmojis.map((value) => ({ type: "emoji", value })),
  ];
  const [newAvatarUrl, setNewAvatarUrl] = useState(
    presetAvatars.find((option) => option.value === currentUser?.avatar) || presetAvatars[0]
  );

  const settingsRows = [
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "theme", label: "Theme" },
  ];

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setAbout(currentUser.about || "");
    }
  }, [currentUser]);

  async function handleSave() {
    const trimmedName = name.trim();
    if (trimmedName === "") {
      setNameError("Name cannot be empty");
      errorTimeoutRef.current = setTimeout(() =>{
        handleCancelEdit();
      }, 2000);
      return "empty";
    }

    if (trimmedName.length > 20) {
      setNameError("Name cannot exceed 20 characters");
      errorTimeoutRef.current = setTimeout(() =>{
        handleCancelEdit();
      }, 2000);
      return "too_long";
    }

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    setNameError("");
    await updateName(trimmedName);
    setIsEditing(false);
    return "success";
  }

  function handleCancelEdit() {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
    setName(currentUser?.name || "");
    setNameError("");
    setIsEditing(false);
  }

  async function saveAbout() {
    await updateAbout(about);
    setIsEditingAbout(false);
  }

  function handleSelectAvatar(option) {
    setNewAvatarUrl(option);
  }

  async function handleApplyAvatar() {
    await updateAvatar(newAvatarUrl.value);
    setIsModalOpen(false);
  }

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="profile-page__header">
          <h2 className="profile-page__title">Profile</h2>
        </div>

        <div className="profile-page__avatar-section">
          <div className="skeleton skeleton--avatar-xl" />
        </div>

        <div className="profile-page__fields">
          <div className="profile-page__field">
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
          </div>
          <div className="profile-page__field">
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
          </div>
          <div className="profile-page__field">
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
          </div>
          <div className="profile-page__field">
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h2 className="profile-page__title">Profile</h2>
      </div>

      <div className="profile-page__avatar-section">
        <div className="profile-page__avatar-wrapper">
          <Avatar name={currentUser.name} src={currentUser?.avatar} size="xl" />
          <button
            className="profile-page__avatar-edit"
            onClick={() => {
              setNewAvatarUrl(
                presetAvatars.find((option) => option.value === currentUser?.avatar) || presetAvatars[0]
              );
              setIsModalOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        </div>

        <div className="profile-page__avatar-info">
          <span className="profile-page__label">Profile photo</span>
          <span className="profile-page__change-text">
            Change profile photo
          </span>
        </div>
      </div>

      <div className="profile-page__fields">
        <div className="profile-page__field">
          <label className="profile-page__field-label">Name</label>

          <div className="profile-page__field-value">
            {isEditing ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                    if (errorTimeoutRef.current) {
                      clearTimeout(errorTimeoutRef.current);
                      errorTimeoutRef.current = null;
                    }
                  }}
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  className={nameError ? "profile-page__input--error" : ""}
                />
                {nameError && <span className="profile-page__error-text">{nameError}</span>}
              </div>
            ) : (
              <span>{currentUser.name}</span>
            )}

            {!isEditing && (
              <button
                className="profile-page__edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="profile-page__field">
          <label className="profile-page__field-label">About</label>

          <div className="profile-page__field-value">
            {isEditingAbout ? (
              <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              onBlur={saveAbout}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') saveAbout();
                  if (e.key === 'Escape') {
                    setAbout(currentUser.about || "");
                    setIsEditingAbout(false);
                  }
                }}
              autoFocus
              />
            ) :(
            <span>
              {currentUser.about || "Hey there! I am using WhatsApp Clone"}
            </span>
            )}

          {!isEditingAbout && (
            <button
              className="profile-page__edit-btn"
              onClick={() => setIsEditingAbout(true)}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          )}
          </div>
        </div>

        <div className="profile-page__field">
          <label className="profile-page__field-label">Phone</label>

          <div className="profile-page__field-value">
            <span>{currentUser.phone}</span>
          </div>
        </div>

        <div className="profile-page__field">
          <label className="profile-page__field-label">Email</label>

          <div className="profile-page__field-value">
            <span>{currentUser.email}</span>
          </div>
        </div>
      </div>

      <div className="profile-page__settings">
        {settingsRows.map((row) => (
          <label className="profile-page__settings-row" key={row.id}>
            <span className="profile-page__settings-label">{row.label}</span>
            {row.id === "theme" ? (
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            ) :(
              <input type="checkbox" disabled aria-label={row.label} />
            )}
            </label>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change profile photo">
        <AvatarPicker
          presetAvatars={presetAvatars}
          newAvatarUrl={newAvatarUrl}
          onSelect={handleSelectAvatar}
          onApply={handleApplyAvatar}
        />
      </Modal>
    </div>
  );
}
