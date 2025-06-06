"use client"

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  departmentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  departmentName,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Department</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the <span className="font-medium">{departmentName}</span> department? 
            This action cannot be undone and will remove all associated data.
          </p>
        </div>
        
        {/* Modal Footer */}
        <div className="flex border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-bl-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-br-lg"
          >
            Delete Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;