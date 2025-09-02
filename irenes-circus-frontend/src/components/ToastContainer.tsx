import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast, Toast, ToastType } from '@/hooks/useToast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    const baseStyles = "border-l-4 shadow-lg";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${getToastStyles(toast.type)}
            p-4 rounded-r-lg backdrop-blur-sm
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
          `}
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="font-semibold text-sm mb-1 truncate">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm leading-relaxed">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Progress bar for timed toasts */}
          {!toast.persistent && toast.duration && toast.duration > 0 && (
            <div className="mt-2 h-1 bg-black/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-current opacity-50 rounded-full animate-toast-progress"
                style={{
                  animationDuration: `${toast.duration}ms`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
