import Avatar from '../common/Avatar';
import { Link } from "react-router-dom";
import './SidebarHeader.css';
import React from 'react';
import { useState } from 'react';
import Modal from '../common/Modal';

export default function SidebarHeader() {
  const[ menuOpen , setmenuOpen] = useState(false)
  const [isModalOpen , setisModalOpen] = useState(false)

  const OpenNewChat = () => {
    setisModalOpen(true)
    setmenuOpen(false)
  }

  return (
    <div className="sidebar-header">
      
      <Avatar name="Alex Rivera" size="md" online />
      
      <div className="sidebar-header__actions">
        <button className="sidebar-header__btn" title="Status">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </button>
        <button 
        className="sidebar-header__btn" title="New chat"
        onClick={OpenNewChat}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19.005 3.175c-.53-.354-1.162-.44-1.73-.335-.958.178-1.488 1.156-1.488 2.177v9.706a3.997 3.997 0 01-1.066 2.745 3.996 3.996 0 01-2.717 1.312c-1.12.105-2.238-.256-3.01-1.007-.773-.75-1.096-1.802-1.017-2.867.079-1.065.554-2.05 1.247-2.756.693-.706 1.653-1.152 2.71-1.212 1.064-.06 2.12.255 2.85.984.222.221.39.485.506.772V5.017a4.72 4.72 0 01.126-1.18c.026-.107.06-.21.11-.304l.018-.034c.195-.395.52-.71.945-.878.214-.085.445-.12.68-.1.501.04.984.34 1.278.76.29.414.33.947.27 1.427-.05.395-.162.801-.274 1.177l-.05.163c-.44 1.433-.952 3.096-2.095 3.934a.5.5 0 01-.56-.828c.838-.565 1.28-1.958 1.68-3.29l.052-.168c.117-.392.226-.76.276-1.11.048-.337.005-.66-.169-.91z" />
          </svg>
        </button>

        {isModalOpen && (
          <Modal isOpen={isModalOpen}
          onClose={() => setisModalOpen(false)}
          />
        )}

        <button className="sidebar-header__btn" title="Menu" onClick={() => setmenuOpen(!menuOpen)}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
         <div className="menu-container">
          {menuOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item" onClick={() => setmenu(false)}>View Profile</Link>
              <button className="dropdown-item">New group</button>
              <button className="dropdown-item">New chat</button>
              <button className="dropdown-item">Setting</button>
              <button className="dropdown-item">lock conversation</button>
              <button className="dropdown-item">Important message</button>
              <button className="dropdown-item">Deconnect</button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
