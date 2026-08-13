import { useState } from "react";
import { Pencil } from "lucide-react";
import "./StatusPage.css";
import Modal from "../components/common/Modal";
import TextStatusComposer from "../components/status/TextStatusComposer";

export default function StatusPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="status-page">
      <main className="status-page__main">
        <div className="status-page__welcome">
          <h2 className="status-page__welcome-title">
            Share a status
          </h2>

          <p className="status-page__welcome-text">
            Share a text update with your contacts.
          </p>

          <button
            type="button"
            className="status-page__text-btn"
            onClick={() => setShowModal(true)}
          >
            <Pencil size={20} strokeWidth={1.8} />
            <span>Write a text status</span>
          </button>
        </div>
      </main>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New status"
        fullScreen
      >
        <TextStatusComposer
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}