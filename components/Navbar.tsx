import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Sun, Moon, Sparkles, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path 
    ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50/50 dark:bg-primary-900/20' 
    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50';

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-800/50 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:-rotate-3">
                F
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
              Fetan<span className="text-primary-600 dark:text-primary-400">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/')}`}>{t('nav.home')}</Link>
            <Link to="/services" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${isActive('/services')}`}>{t('nav.services')}</Link>
            
            <Link to="/ai-assistant" className={`px-4 py-2 rounded-full text-sm transition-all duration-200 group flex items-center gap-2 ${isActive('/ai-assistant')}`}>
              <Sparkles size={14} className="group-hover:text-amber-400 transition-colors" />
              <span>{t('nav.ai_assistant')}</span>
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200 font-bold text-xs w-10 h-10 flex items-center justify-center"
              title="Switch Language"
            >
              {language === 'en' ? 'EN' : 'አማ'}
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            {user ? (
              <div className="flex items-center gap-3 pl-2">
                 <Link 
                   to="/messages" 
                   className="p-2.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-all duration-200 relative"
                   title={t('nav.messages')}
                 >
                   <MessageSquare size={20} />
                   {/* Simplified unread dot for now */}
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                 </Link>

                <Link to="/dashboard" className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold overflow-hidden border border-white dark:border-gray-700 shadow-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{user.role === 'PROVIDER' ? 'Expert' : 'User'}</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                  title={t('nav.logout')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-white px-4 py-2 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-full hover:bg-primary-600 dark:hover:bg-primary-100 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleLanguage}
              className="text-gray-900 dark:text-white font-bold"
            >
              {language === 'en' ? 'EN' : 'አማ'}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0'}`}>
        <div className="px-4 pt-4 pb-8 space-y-2">
          <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">{t('nav.home')}</Link>
          <Link to="/services" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">{t('nav.services')}</Link>
          <Link to="/ai-assistant" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">
             {t('nav.ai_assistant')}
          </Link>
          
          <div className="border-t border-gray-100 dark:border-gray-800 my-2 pt-2"></div>
          
          {user ? (
            <>
              <Link to="/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                   <MessageSquare size={16} className="text-primary-600" />
                </div>
                <span>{t('nav.messages')}</span>
              </Link>
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                   {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon size={16} className="text-primary-600"/>}
                </div>
                <span>{t('nav.dashboard')}</span>
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <LogOut size={18} /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 mt-4 px-2">
              <Link to="/login" className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800">{t('nav.login')}</Link>
              <Link to="/register" className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-primary-600">{t('nav.signup')}</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;