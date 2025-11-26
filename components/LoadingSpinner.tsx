import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading Fetan...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;