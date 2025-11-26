import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { trustService } from '../services/trustService';
import { useToast } from '../context/ToastContext';

interface ReportModalProps {
  reporterId: string;
  reportedId: string;
  reportedName: string;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ reporterId, reportedId, reportedName, onClose }) => {
  const [reason, setReason] = useState('Inappropriate Behavior');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await trustService.submitReport({
        reporterId,
        reportedId,
        reason,
        description
      });
      addToast("Report submitted securely. We will investigate.", "success");
      onClose();
    } catch (error) {
      console.error(error);
      addToast("Failed to submit report", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <ShieldAlert size={20} />
            <h3 className="font-bold">Report User</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            You are reporting <span className="font-bold">{reportedName}</span>. This report is anonymous and will be reviewed by our Trust & Safety team.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Inappropriate Behavior">Inappropriate Behavior</option>
              <option value="Scam/Fraud">Scam or Fraud Attempt</option>
              <option value="Poor Quality">Poor Service Quality</option>
              <option value="Fake Profile">Fake Profile</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the incident..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
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
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-70 transition-all"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;