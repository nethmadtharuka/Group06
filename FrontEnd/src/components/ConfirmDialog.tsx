import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-500',
    },
    warning: {
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      border: 'border-yellow-500',
    },
    info: {
      confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-500',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-lg shadow-xl max-w-md w-full border-2 ${styles.border} animate-slide-in`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${styles.confirmButton} rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

