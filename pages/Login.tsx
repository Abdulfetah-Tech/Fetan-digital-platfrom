import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

interface LoginProps {
  initialMode?: 'login' | 'register';
}

const Login: React.FC<LoginProps> = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState<UserRole>(UserRole.HOMEOWNER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        addToast(`Welcome back!`, 'success');
      } else {
        if (!formData.name) throw new Error("Name is required");
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role
        });
        addToast(`Welcome to Fetan, ${formData.name}!`, 'success');
      }
      navigate('/dashboard');
    } catch (err: any) {
      addToast(err.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex transition-colors duration-300">
      <SEO title={isLogin ? 'Login' : 'Register'} />
      
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        <div className="relative z-10 w-full flex flex-col justify-between p-16">
           <div>
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                   <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-white font-display font-bold text-2xl tracking-tight">Fetan.</span>
             </div>
           </div>
           
           <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                {t('hero.title_start')} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{t('hero.title_end')}</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                {t('footer.desc')}
              </p>
              
              <div className="flex items-center gap-8 pt-4">
                 <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                       <img key={i} src={`https://ui-avatars.com/api/?name=${i}&background=random`} className="w-10 h-10 rounded-full border-2 border-gray-900" alt=""/>
                    ))}
                 </div>
                 <div className="text-white">
                    <div className="flex items-center gap-1 text-yellow-400">
                       <span className="font-bold">4.9/5</span>
                       <div className="flex text-xs">★★★★★</div>
                    </div>
                    <p className="text-xs text-gray-400">from 2k+ reviews</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-10">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              {isLogin ? t('auth.welcome_back') : t('auth.create_account')}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {isLogin ? t('auth.enter_details') : t('auth.get_started')}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Role Switcher */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.HOMEOWNER)}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    role === UserRole.HOMEOWNER 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-600' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {t('auth.i_need_service')}
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PROVIDER)}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    role === UserRole.PROVIDER 
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-600' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {t('auth.im_expert')}
                </button>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.full_name')}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('auth.password')}</label>
                  {isLogin && (
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500">
                      {t('auth.forgot_password')}
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 pr-10"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> 
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                   {isLogin ? t('nav.login') : t('nav.signup')} <ArrowRight size={18}/>
                </span>
              )}
            </button>
            
            {!isLogin && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                 {t('auth.agree_terms')}
              </p>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-medium">
                {isLogin ? t('auth.new_to_fetan') : t('auth.already_have_account')}
              </span>
            </div>
          </div>
          
          <div className="text-center">
             <button
                onClick={handleModeSwitch}
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
             >
                {isLogin ? t('auth.signup_link') : t('auth.login_link')}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;