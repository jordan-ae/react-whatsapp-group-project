import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import Avatar from "../components/common/Avatar";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { currentUser } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h2 className="profile-page__title">Profile</h2>
      </div>

      <div className="profile-page__avatar-section">
        <div className="profile-page__avatar-wrapper">
          <Avatar name={currentUser.name} size="xl" />
          <button className="profile-page__avatar-edit">
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <span>{currentUser.name}</span>
            )}

            <button
              className="profile-page__edit-btn"
              onClick={() => setIsEditing(true)}
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
          </div>
        </div>

        <div className="profile-page__field">
          <label className="profile-page__field-label">About</label>

          <div className="profile-page__field-value">
            <span>
              {currentUser.about || "Hey there! I am using WhatsApp Clone"}
            </span>

            <button className="profile-page__edit-btn">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
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
    </div>
  );
}
