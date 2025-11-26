import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const styles = {
    success: 'bg-white dark:bg-gray-800 border-l-4 border-green-500 text-gray-800 dark:text-white',
    error: 'bg-white dark:bg-gray-800 border-l-4 border-red-500 text-gray-800 dark:text-white',
    info: 'bg-white dark:bg-gray-800 border-l-4 border-blue-500 text-gray-800 dark:text-white',
  };

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <div className={`flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-up hover:scale-[1.02] ${styles[type]}`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-grow text-sm font-medium">
        {message}
      </div>
      <button 
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;