import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { MOCK_PROVIDERS } from '../constants';
import ProviderCard from '../components/ProviderCard';
import { ServiceCategory } from '../types';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Services: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter(provider => {
      const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            provider.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? provider.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 pt-20 transition-colors duration-300">
      <SEO 
        title="Find Services" 
        description="Search for trusted professionals in Ethiopia. Plumbers, Electricians, Painters, and more available for hire."
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('services.available')}</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24 border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-semibold">
                <Filter size={20} />
                <h2>{t('services.filters')}</h2>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('services.categories')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="text-primary-600 focus:ring-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{t('services.all_categories')}</span>
                  </label>
                  {Object.values(ServiceCategory).map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)} 
                        className="text-primary-600 focus:ring-primary-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 flex gap-2 border border-gray-100 dark:border-gray-700 transition-colors">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors"
                  placeholder={t('services.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Results Grid */}
            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProviders.map(provider => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('services.no_results')}</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedCategory('');}}
                  className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  {t('services.clear_filters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;