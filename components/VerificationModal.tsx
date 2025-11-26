import React, { useState } from 'react';
import { X, ShieldCheck, Upload, FileText, CheckCircle } from 'lucide-react';
import { trustService } from '../services/trustService';
import { useToast } from '../context/ToastContext';

interface VerificationModalProps {
  userId: string;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ userId, onClose }) => {
  const [docType, setDocType] = useState('NATIONAL_ID');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
        addToast("Please select a document", "error");
        return;
    }
    
    setLoading(true);
    try {
      await trustService.requestVerification(userId, docType);
      addToast("Verification request submitted! We will review it shortly.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      addToast("Failed to submit request", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
          <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
            <ShieldCheck size={20} />
            <h3 className="font-bold">Get Verified</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Build Trust</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Verified profiles get 3x more jobs.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="NATIONAL_ID">National ID (Kebele ID)</option>
              <option value="PASSPORT">Passport</option>
              <option value="TRADE_LICENSE">Trade License</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Document</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors relative cursor-pointer">
              <input 
                 type="file" 
                 accept="image/*,.pdf"
                 onChange={handleFileChange}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex flex-col items-center text-primary-600 dark:text-primary-400">
                   <FileText size={32} className="mb-2"/>
                   <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                   <span className="text-xs text-green-500 flex items-center gap-1 mt-1"><CheckCircle size={10}/> Ready to upload</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                   <Upload size={32} className="mb-2"/>
                   <span className="text-sm">Click to upload or drag & drop</span>
                   <span className="text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 shadow-md hover:shadow-lg disabled:opacity-70 transition-all"
            >
              {loading ? 'Uploading...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;