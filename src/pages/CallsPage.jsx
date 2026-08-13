import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import CallScreen from '../components/calls/CallScreen';
import { useApp } from '../contexts/AppContext';
import './CallsPage.css';

export default function CallsPage() {
  const { logCall } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [callLink, setCallLink] = useState('');

  const generateFallbackId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleOpenModal = () => {
    const randomId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID().slice(0, 8)
      : generateFallbackId();

    setCallLink(`https://call.whatsapp-clone.dev/${randomId}`);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setCopied(false); 
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(callLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      setCopied(false);
    }
  };

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  const { data: users, loading: usersLoading } = useApi('/users');
  const safeUsers = Array.isArray(users) ? users : [];

  const handleStartCall = (user, type) => {
    setSelectedCall({ user, type });
    setIsPickerOpen(false);
    logCall({
      userId: user.id,
      name: user.name,
      type: type,
      duration: 0,
    });
  };

  const handleEndCall = () => {
    setSelectedCall(null);
  };

  return (
    <div className="calls-page">
      <div className="calls-page__header">
        <h2 className="calls-page__title">Calls</h2>
      </div>

      {selectedCall ? (
        <CallScreen call={selectedCall} onEnd={handleEndCall} />
      ) : (
      <>
      <div className="calls-page__actions">
        <button className="calls-page__create"
         type="button" 
         onClick={handleOpenModal} 
         title="Create call link">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          Create call link
        </button>

        <button className="calls-page__new-call" 
        type="button"
         onClick={() => setIsPickerOpen(true)}
          title="New call">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
          </svg>
          New call
        </button>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModal} title="Create call link">
        <div className="create-link-modal-content">
          <p>Share a link to invite people to this WhatsApp call.</p>
          <div className="create-link-modal__link-box">
            <span className="create-link-modal__link-text">{callLink}</span>
            <button className="create-link-modal__copy-btn" 
            onClick={handleCopyLink}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} title="Select a contact">
        {usersLoading ? (
          <div className="calls-page__loading">Loading contacts...</div>
        ) : (
          <div className="calls-page__contacts">
            {safeUsers.map((user) => (
              <div key={user.id} className="calls-page__contact">
                <div className="calls-page__contact-info">
                  <Avatar
                    name={user.name}
                    size="md"
                  />
                  <span>{user.name}</span>
                </div>

                <div className="calls-page__contact-actions">
                  <button
                    type="button"
                    className="calls-page__contact-btn calls-page__contact-btn--voice"
                    onClick={() => handleStartCall(user, 'voice')}
                  >
                    Voice
                  </button>
                  <button
                    type="button"
                    className="calls-page__contact-btn calls-page__contact-btn--video"
                    onClick={() => handleStartCall(user, 'video')}
                  >
                    Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
      </>
      )}
    </div>
  );
}
