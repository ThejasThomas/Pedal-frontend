// ConfirmModal.jsx
import React from "react";
import { Button } from "../components/UI/button";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-between">
          <Button onClick={onCancel} className="bg-gray-500 text-white">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-500 text-white">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
