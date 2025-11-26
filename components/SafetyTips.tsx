import React from 'react';
import { Shield, AlertTriangle, CreditCard, MessageCircle, X } from 'lucide-react';

interface SafetyTipsProps {
  onClose: () => void;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white relative overflow-hidden">
          <Shield className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 rotate-12" />
          <h2 className="text-3xl font-bold mb-2 relative z-10">Trust & Safety</h2>
          <p className="text-green-100 relative z-10 max-w-md">Your safety is our top priority. Please read these guidelines to ensure a secure experience on Fetan.</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex gap-4">
             <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
               <AlertTriangle size={24} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Never Pay Outside the Platform</h3>
               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                 Do not transfer money directly to personal bank accounts via Telegram or phone calls before work is done. Use our built-in <b>Telebirr/Chapa</b> gateway which holds funds securely until the job is verified.
               </p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
               <MessageCircle size={24} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Keep Communication on Fetan</h3>
               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                 Use our official chat or messaging system. This provides a record of your agreement in case of disputes. Be wary of users asking to move to WhatsApp immediately.
               </p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
               <CreditCard size={24} />
             </div>
             <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Verify Expert Credentials</h3>
               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                 Look for the <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">Verified</span> badge. Ask to see physical ID upon arrival for home services.
               </p>
             </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
             <h4 className="font-bold text-gray-900 dark:text-white mb-2">Emergency Contact</h4>
             <p className="text-sm text-gray-600 dark:text-gray-300">If you feel in immediate danger, contact local authorities immediately. For platform disputes, email <a href="mailto:safety@fetan.com" className="text-primary-600 hover:underline">safety@fetan.com</a>.</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:shadow-lg transition-all"
           >
             I Understand
           </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyTips;