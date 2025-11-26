import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                F
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">Fetan.</span>
            </div>
            <p className="text-sm mb-6 leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Youtube size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.company')}</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/> {t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/> {t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/> {t('footer.blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/> {t('footer.privacy')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('services.plumbing')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('services.electrical')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('services.painting')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('services.carpentry')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-500 mt-0.5" />
                <span>Bole Road, Addis Ababa,<br/>Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500" />
                <span>support@fetan.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2025 Fetan Digital Platform. {t('footer.rights')}</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white">Terms</a>
             <a href="#" className="hover:text-white">Privacy</a>
             <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;