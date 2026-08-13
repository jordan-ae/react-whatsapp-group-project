import React, { useEffect, useRef } from "react";
import "./MessageActions.css";

export default function MessageActions({ onReply, onClose, anchorRef }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        onClose();
        anchorRef.current?.focus();
      }
    }
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
        anchorRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose, anchorRef]);

  return (
    <div className="message-actions" ref={menuRef}>
      <button onClick={onReply}>Reply</button>
    </div>
  );
}
