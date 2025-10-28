import React from "react";

const DeleteConfirmModal = ({ product, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 mb-4">
            <span className="text-red-600 text-2xl">🗑️</span>
          </div>
          <h2 className="text-lg font-bold mb-2">Delete Confirmation</h2>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the product{" "}
            <strong>{product.name}</strong>?
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
