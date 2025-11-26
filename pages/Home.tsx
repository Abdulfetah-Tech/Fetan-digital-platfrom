import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenTool, Zap, Droplet, Hammer, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { MOCK_PROVIDERS } from '../constants';
import ProviderCard from '../components/ProviderCard';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?search=${searchTerm}`);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 overflow-x-hidden bg-white dark:bg-gray-950">
      <SEO />
      
      {/* Modern Gradient Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
           <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
           <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob" style={{animationDelay: '2s'}}></div>
           <div className="absolute -bottom-20 left-40 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
           
           {/* Trust Badge */}
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 backdrop-blur-md mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase text-[10px]">{t('hero.badge')}</span>
           </div>

           <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter text-gray-900 dark:text-white mb-6 leading-[1.1] animate-slide-up">
              {t('hero.title_start')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">{t('hero.title_end')}</span>
           </h1>

           <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay">
              {t('hero.subtitle')}
           </p>

           {/* Modern Search Input */}
           <div className="max-w-2xl mx-auto relative group animate-slide-up-delay" style={{animationDelay: '0.4s'}}>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
                 <div className="pl-4 text-gray-400"><Search size={24}/></div>
                 <input 
                    type="text" 
                    className="flex-1 p-4 bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-white placeholder-gray-500 outline-none"
                    placeholder={t('hero.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <button type="submit" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-md">
                    {t('hero.search_btn')}
                 </button>
              </form>
           </div>

           {/* Floating Avatars / Social Proof */}
           <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="flex -space-x-4">
                 {[1,2,3,4].map(i => (
                    <img key={i} src={`https://ui-avatars.com/api/?name=${i}&background=random`} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900" alt=""/>
                 ))}
              </div>
              <p>{t('hero.trusted_by')} <span className="font-bold text-gray-900 dark:text-white">{t('hero.homeowners')}</span></p>
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">{t('services.title')}</h2>
               <p className="text-gray-500 dark:text-gray-400">{t('services.subtitle')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                  { icon: Droplet, name: t('services.plumbing'), key: 'Plumbing', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                  { icon: Zap, name: t('services.electrical'), key: 'Electrical', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
                  { icon: PenTool, name: t('services.painting'), key: 'Painting', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                  { icon: Hammer, name: t('services.carpentry'), key: 'Carpentry', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
               ].map((cat) => (
                  <Link to={`/services?category=${cat.key}`} key={cat.key} className="group bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2">
                     <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <cat.icon size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                     <div className="flex items-center text-sm text-gray-400 font-medium gap-1 group-hover:text-primary-600 transition-colors">
                        {t('services.explore')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Featured Experts */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
             <div>
                <span className="text-primary-600 font-bold tracking-wider text-xs uppercase">{t('featured.top_rated')}</span>
                <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mt-2">{t('featured.verified_experts')}</h2>
             </div>
             <Link to="/services" className="hidden md:flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-primary-600 transition-colors">
                {t('featured.view_all')} <ArrowRight size={20} />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {MOCK_PROVIDERS.slice(0,4).map(provider => (
                <div key={provider.id} className="h-[400px]">
                   <ProviderCard provider={provider} />
                </div>
             ))}
          </div>

           <div className="mt-8 text-center md:hidden">
             <Link to="/services" className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-bold hover:text-primary-600 transition-colors">
                {t('featured.view_all')} <ArrowRight size={20} />
             </Link>
           </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
               <div className="text-center md:text-left">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('value.vetted_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('value.vetted_desc')}</p>
               </div>
               <div className="text-center md:text-left">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                     <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('value.price_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('value.price_desc')}</p>
               </div>
               <div className="text-center md:text-left">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                     <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('value.ai_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('value.ai_desc')}</p>
               </div>
            </div>
         </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24 px-4 bg-white dark:bg-gray-950">
         <div className="max-w-6xl mx-auto bg-gray-900 dark:bg-gray-800 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-600 to-purple-600 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                  {t('cta.title')}
               </h2>
               <p className="text-xl text-gray-300 mb-10">
                  {t('cta.subtitle')}
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                     {t('cta.get_started')}
                  </Link>
                  <Link to="/services" className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl border border-gray-700 hover:bg-gray-700 transition-all">
                     {t('cta.browse_services')}
                  </Link>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;