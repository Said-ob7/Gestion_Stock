// components/Modal.tsx
import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
  onConfirm?: () => void; // Optional prop for confirmation action
}

const Modal: React.FC<ModalProps> = ({ show, onClose, message, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-[500px]">
        <h3 className="text-lg font-bold mb-4">Notice</h3>
        <p className="text-sm mb-4">{message}</p>
        {onConfirm ? (
          <div className="flex justify-end">
            <button
              className="bg-red-500 text-white py-1 px-4 rounded mr-2"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 text-black py-1 px-4 rounded"
              onClick={onClose}
            >
              No
            </button>
          </div>
        ) : (
          <button
            className="bg-red-500 text-white py-1 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
