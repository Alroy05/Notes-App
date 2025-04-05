import { X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName = 'item' }) {
  const { theme } = useThemeStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
         style={{ backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}>
      <div className={`rounded-lg p-6 max-w-md w-full shadow-lg
                      ${theme === 'dark' 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Confirm Deletion
          </h2>
          <button onClick={onClose} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
            <X size={20} />
          </button>
        </div>
        
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Are you sure you want to delete this {itemName}? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark' 
                ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}