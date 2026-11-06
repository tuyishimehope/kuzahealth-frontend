// Modal.js
import React from "react";

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card p-6 rounded-2xl shadow-soft relative border border-border">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg">
          &times; {/* Close button */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
