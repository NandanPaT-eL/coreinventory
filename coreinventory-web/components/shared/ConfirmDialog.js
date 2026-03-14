'use client';

import { AlertCircle, X } from 'lucide-react';
import Button from '../ui/Button';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) {
  if (!isOpen) return null;

  const typeConfig = {
    warning: {
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      buttonVariant: 'primary'
    },
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      buttonVariant: 'primary'
    },
    info: {
      icon: AlertCircle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      buttonVariant: 'primary'
    }
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#7C3AED] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${config.bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
                <Icon className={`h-6 w-6 ${config.iconColor}`} />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="display-font text-lg font-bold text-[#1a1a2e]">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-[#6B7280]">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              variant={type === 'danger' ? 'primary' : 'primary'}
            >
              {confirmText}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
