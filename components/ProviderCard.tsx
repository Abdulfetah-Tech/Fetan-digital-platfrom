import React from 'react';
import { Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Provider } from '../types';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <div className="h-full group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl h-full flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-2 relative overflow-hidden">
        
        {/* Top Gradient Banner */}
        <div className="h-24 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 relative">
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-600">
               {provider.hourlyRate} ETB/hr
            </div>
        </div>

        <div className="px-6 relative flex-grow">
           {/* Avatar */}
           <div className="-mt-12 mb-4 relative inline-block">
              <OptimizedImage 
                src={provider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}`}
                alt={provider.name} 
                className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              {provider.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                  <CheckCircle size={18} className="text-blue-500 fill-blue-50 dark:fill-blue-900" />
                </div>
              )}
           </div>

           <div className="mb-4">
             <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {provider.name}
                </h3>
             </div>
             <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20 inline-block px-2.5 py-0.5 rounded-md">
               {provider.category}
             </p>
           </div>

           <div className="flex items-center gap-4 mb-4 text-sm">
             <div className="flex items-center gap-1.5">
               <Star size={16} className="text-yellow-400 fill-yellow-400" />
               <span className="font-bold text-gray-900 dark:text-white">{provider.rating}</span>
               <span className="text-gray-400 text-xs">({provider.reviews})</span>
             </div>
             <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
             <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Clock size={14} />
                <span className="text-xs">{provider.experience}</span>
             </div>
           </div>

           <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
             {provider.bio}
           </p>

           <div className="flex items-center text-gray-400 text-xs mb-6">
             <MapPin size={14} className="mr-1" />
             {provider.location}
           </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <Link to={`/profile/${provider.id}`} className="block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all duration-200 bg-gray-900 text-white hover:bg-primary-600 dark:bg-white dark:text-gray-900 dark:hover:bg-primary-500 dark:hover:text-white">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;