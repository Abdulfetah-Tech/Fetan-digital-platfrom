import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building2, Smartphone, CheckCircle, Lock, Loader2, QrCode, ArrowRight } from 'lucide-react';
import { paymentService, PaymentMethod } from '../services/paymentService';
import { useLanguage } from '../context/LanguageContext';

interface PaymentGatewayProps {
  amount: number;
  onSuccess: (transactionId: string, method: PaymentMethod) => void;
  onCancel: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'process'>('select');
  const { t } = useLanguage();

  // Simulated Card Data
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  const handlePayment = async () => {
    if (!method) return;
    
    setProcessing(true);
    try {
      const result = await paymentService.processPayment(amount, method);
      if (result.success && result.transactionId) {
        onSuccess(result.transactionId, method);
      }
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setProcessing(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t('payment.total_amount')}</span>
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-1">
          {amount.toLocaleString()} <span className="text-lg font-bold text-gray-500">ETB</span>
        </h2>
      </div>

      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('payment.select_method')}:</p>
      
      <div className="space-y-3">
        <button
          onClick={() => { setMethod('telebirr'); setStep('process'); }}
          className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <Smartphone size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-900 dark:text-white group-hover:text-yellow-700 dark:group-hover:text-yellow-400">Telebirr</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('payment.mobile_money')}</span>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-yellow-500" />
        </button>

        <button
          onClick={() => { setMethod('chapa'); setStep('process'); }}
          className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <CreditCard size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400">{t('payment.card')}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Visa, Mastercard</span>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-green-500" />
        </button>

        <button
          onClick={() => { setMethod('cbe'); setStep('process'); }}
          className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400">CBE Birr</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('payment.bank_transfer')}</span>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-purple-500" />
        </button>
      </div>
    </div>
  );

  const renderProcess = () => {
    if (processing) {
      return (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
             <div className="w-20 h-20 border-4 border-primary-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <Lock className="text-gray-400" size={24} />
             </div>
          </div>
          <h3 className="mt-6 font-bold text-lg text-gray-900 dark:text-white">{t('payment.processing')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t('payment.dont_close')}</p>
        </div>
      );
    }

    if (method === 'telebirr') {
      return (
        <div className="animate-fade-in text-center">
          <div className="bg-yellow-400 text-white p-4 rounded-xl mb-6 shadow-lg shadow-yellow-500/20">
             <h3 className="font-bold text-lg flex items-center justify-center gap-2"><Smartphone/> Telebirr Payment</h3>
          </div>
          
          <div className="flex justify-center mb-6">
             <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
               <QrCode size={150} className="text-gray-900" />
             </div>
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('payment.scan_qr')}</p>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg font-mono text-lg font-bold text-gray-900 dark:text-white tracking-widest mb-6">
            *127*456*1#
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-all hover:shadow-primary-500/30 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} /> {t('payment.complete_payment')}
          </button>
        </div>
      );
    }

    if (method === 'chapa') {
      return (
        <div className="animate-fade-in">
          <div className="bg-green-600 text-white p-4 rounded-xl mb-6 shadow-lg shadow-green-600/20 flex justify-between items-center">
             <div className="flex items-center gap-2 font-bold"><CreditCard size={20}/> {t('payment.secured_by')}</div>
             <Lock size={16} className="opacity-80"/>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('payment.card_number')}</label>
              <div className="relative">
                <input 
                   type="text" 
                   placeholder="0000 0000 0000 0000"
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono"
                   value={cardData.number}
                   onChange={e => setCardData({...cardData, number: e.target.value})}
                />
                <CreditCard size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('payment.expiry')}</label>
                <input 
                   type="text" 
                   placeholder="MM/YY"
                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-center"
                   value={cardData.expiry}
                   onChange={e => setCardData({...cardData, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase">{t('payment.cvc')}</label>
                <input 
                   type="password" 
                   placeholder="123"
                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono text-center"
                   value={cardData.cvc}
                   onChange={e => setCardData({...cardData, cvc: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all hover:shadow-green-500/30 flex items-center justify-center gap-2"
          >
            {t('payment.pay')} {amount} ETB
          </button>
        </div>
      );
    }

    if (method === 'cbe') {
      return (
         <div className="animate-fade-in text-center">
          <div className="bg-purple-600 text-white p-4 rounded-xl mb-6 shadow-lg shadow-purple-600/20">
             <h3 className="font-bold text-lg flex items-center justify-center gap-2"><Building2/> CBE Mobile Banking</h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('payment.transfer_to')}</p>
            <div className="mb-4">
               <p className="text-xs text-gray-400 uppercase font-bold">{t('payment.account_number')}</p>
               <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">100023456789</p>
            </div>
            <div>
               <p className="text-xs text-gray-400 uppercase font-bold">{t('payment.account_name')}</p>
               <p className="text-lg font-bold text-gray-900 dark:text-white">Fetan Platform Services</p>
            </div>
          </div>

          <div className="text-left bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-6 flex gap-3 items-start">
             <div className="bg-blue-100 dark:bg-blue-900/50 p-1 rounded text-blue-600"><CheckCircle size={16}/></div>
             <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
               Use your phone number as reference. The system will automatically verify the transfer within 2 minutes.
             </p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-all hover:shadow-primary-500/30 flex items-center justify-center gap-2"
          >
            {t('payment.transferred')}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      {step === 'process' && (
        <button 
          onClick={() => setStep('select')}
          className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← {t('payment.change_method')}
        </button>
      )}

      {step === 'select' ? renderMethodSelection() : renderProcess()}
      
      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-6 text-gray-400">
         <div className="flex items-center gap-1 text-xs"><Lock size={12}/> 256-bit SSL Encrypted</div>
         <div className="flex items-center gap-1 text-xs"><CheckCircle size={12}/> Verified Merchant</div>
      </div>
    </div>
  );
};

export default PaymentGateway;