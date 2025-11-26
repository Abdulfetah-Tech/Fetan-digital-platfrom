import React, { useEffect, useState, useMemo } from 'react';
import { UserRole, Job } from '../types';
import { Calendar, CheckCircle, Clock, AlertCircle, Plus, X, Loader2, Briefcase, ShoppingBag, Filter, RotateCcw, ArrowUpDown, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobService } from '../services/jobService';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';
import PaymentGateway from '../components/PaymentGateway';
import { PaymentMethod } from '../services/paymentService';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const { t } = useLanguage();
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Provider View State
  const [activeTab, setActiveTab] = useState<'my-jobs' | 'marketplace'>('my-jobs');
  
  // Filter & Sort State
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [sortOption, setSortOption] = useState<'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC'>('DATE_DESC');
  
  // Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Details, 2: Payment
  const [newJobData, setNewJobData] = useState({
    title: '',
    description: '',
    amount: ''
  });

  const fetchData = async () => {
    if (user) {
      try {
        setLoading(true);
        // Fetch My Jobs
        const userJobs = await jobService.getJobsForUser(user.id, user.role);
        setMyJobs(userJobs);

        // If Provider, fetch marketplace jobs
        if (user.role === UserRole.PROVIDER) {
          const marketJobs = await jobService.getAvailableJobs();
          setAvailableJobs(marketJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        addToast("Failed to load dashboard data", 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, activeTab]); 

  // Handle URL query params for booking actions
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'book') {
      const providerName = params.get('provider');
      
      // Open the modal
      setShowPostModal(true);
      setModalStep(1);
      
      // Pre-fill data if provider exists
      if (providerName) {
        setNewJobData(prev => ({
          ...prev,
          title: `Request for ${providerName}`,
          description: `I would like to hire ${providerName} for a service. \n\nDetails:\n`
        }));
      }
    }
  }, [location.search]);

  // Reset filters when tab changes
  useEffect(() => {
    setStatusFilter('ALL');
    setDateStart('');
    setDateEnd('');
    setSortOption('DATE_DESC');
    setShowFilters(false);
  }, [activeTab]);

  const activeFiltersCount = [
    statusFilter !== 'ALL',
    dateStart !== '',
    dateEnd !== '',
    sortOption !== 'DATE_DESC'
  ].filter(Boolean).length;

  const filteredJobs = useMemo(() => {
    if (!user) return [];
    
    let jobs = user.role === UserRole.PROVIDER && activeTab === 'marketplace' ? availableJobs : myJobs;

    // Filter by Status
    if (statusFilter !== 'ALL') {
      jobs = jobs.filter(job => job.status === statusFilter);
    }

    // Filter by Date Start
    if (dateStart) {
      jobs = jobs.filter(job => job.date >= dateStart);
    }

    // Filter by Date End
    if (dateEnd) {
      jobs = jobs.filter(job => job.date <= dateEnd);
    }

    // Sorting
    return [...jobs].sort((a, b) => {
      switch (sortOption) {
        case 'DATE_DESC':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'DATE_ASC':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'AMOUNT_DESC':
          return b.amount - a.amount;
        case 'AMOUNT_ASC':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [user, activeTab, availableJobs, myJobs, statusFilter, dateStart, dateEnd, sortOption]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobData.title || !newJobData.description || !newJobData.amount) {
      addToast("Please fill in all fields", 'error');
      return;
    }
    setModalStep(2);
  };

  const handlePaymentSuccess = async (transactionId: string, method: PaymentMethod) => {
    if (!user) return;

    try {
      await jobService.createJob({
        title: newJobData.title,
        description: newJobData.description,
        amount: Number(newJobData.amount),
        customerName: user.name,
        customerId: user.id,
        // Payment Info
        paymentStatus: 'PAID',
        paymentMethod: method,
        transactionId: transactionId
      });
      
      await fetchData();
      
      setNewJobData({ title: '', description: '', amount: '' });
      setShowPostModal(false);
      setModalStep(1);
      addToast(`Payment Verified! Job Posted. Ref: ${transactionId}`, 'success');
    } catch (error) {
      console.error("Failed to create job after payment", error);
      addToast("Payment successful but failed to create job. Contact support.", 'error');
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    if (!user || user.role !== UserRole.PROVIDER) return;
    
    try {
      await jobService.acceptJob(jobId, user.id, user.name);
      await fetchData(); 
      setActiveTab('my-jobs'); 
      addToast("You accepted the job!", 'success');
    } catch (error) {
      console.error("Failed to accept job", error);
      addToast("Failed to accept job", 'error');
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    try {
      await jobService.completeJob(jobId);
      await fetchData();
      addToast("Job marked as completed", 'success');
    } catch (error) {
      console.error("Failed to complete job", error);
      addToast("Failed to complete job", 'error');
    }
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setDateStart('');
    setDateEnd('');
    setSortOption('DATE_DESC');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-8 pt-20 transition-colors duration-300">
      <SEO title="Dashboard" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Info */}
          <div className="w-full md:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600 dark:text-primary-300 mb-4 overflow-hidden border-2 border-primary-50 dark:border-primary-800">
                   {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.role === UserRole.PROVIDER ? 'Service Expert' : 'Homeowner'}</p>
                
                {/* Connection Status Indicator */}
                <div className="mb-4 w-full">
                  <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    supabase 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                      : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                  }`}>
                     {supabase ? <Wifi size={14} /> : <WifiOff size={14} />}
                     {supabase ? 'Connected to DB' : 'Demo Mode (Mock)'}
                  </div>
                </div>

                <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200 text-xs truncate max-w-[150px]" title={user.email}>{user.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Member ID:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200 text-xs">#{user.id.substring(0, 6)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-primary-100 mb-4">Our support team is available 24/7 to assist you.</p>
                <button className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {user.role === UserRole.HOMEOWNER ? (
                  <>{t('dashboard.my_requests')}</>
                ) : (
                  <>{t('dashboard.provider_dashboard')}</>
                )}
              </h1>
              
              {user.role === UserRole.HOMEOWNER && (
                <button 
                  onClick={() => { setShowPostModal(true); setModalStep(1); }}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  {t('dashboard.post_job')}
                </button>
              )}
            </div>

            {/* Provider Tabs */}
            {user.role === UserRole.PROVIDER && (
              <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('my-jobs')}
                  className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium transition-colors relative ${
                    activeTab === 'my-jobs' 
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Briefcase size={18} />
                  {t('dashboard.my_active_jobs')}
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs py-0.5 px-2 rounded-full">{myJobs.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`pb-3 px-1 flex items-center gap-2 text-sm font-medium transition-colors relative ${
                    activeTab === 'marketplace' 
                      ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {t('dashboard.find_work')}
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs py-0.5 px-2 rounded-full">{availableJobs.length}</span>
                </button>
              </div>
            )}

            {/* Stats - Only show for Homeowner or Provider "My Jobs" tab */}
            {(!user || (user.role === UserRole.PROVIDER && activeTab === 'my-jobs') || user.role === UserRole.HOMEOWNER) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg"><Clock size={20} /></div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.pending')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '-' : myJobs.filter(j => j.status === 'PENDING').length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg"><AlertCircle size={20} /></div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.in_progress')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '-' : myJobs.filter(j => j.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg"><CheckCircle size={20} /></div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.completed')}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '-' : myJobs.filter(j => j.status === 'COMPLETED').length}
                  </p>
                </div>
              </div>
            )}

            {/* Jobs List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {user.role === UserRole.PROVIDER && activeTab === 'marketplace' ? t('dashboard.available_jobs') : t('dashboard.job_activity')}
                </h3>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800' 
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter size={16} />
                  {t('dashboard.filters')}
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center -mr-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters Section (Same as before) */}
              {showFilters && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('dashboard.sort')}</label>
                      <div className="relative">
                        <select 
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value as any)}
                          className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                        >
                          <option value="DATE_DESC">{t('dashboard.sort_date_desc')}</option>
                          <option value="DATE_ASC">{t('dashboard.sort_date_asc')}</option>
                          <option value="AMOUNT_DESC">{t('dashboard.sort_amount_desc')}</option>
                          <option value="AMOUNT_ASC">{t('dashboard.sort_amount_asc')}</option>
                        </select>
                        <ArrowUpDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('dashboard.status')}</label>
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="ALL">{t('dashboard.status_all')}</option>
                        <option value="PENDING">{t('dashboard.pending')}</option>
                        <option value="IN_PROGRESS">{t('dashboard.in_progress')}</option>
                        <option value="COMPLETED">{t('dashboard.completed')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('dashboard.from_date')}</label>
                      <input 
                        type="date"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('dashboard.to_date')}</label>
                      <input 
                        type="date"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <button 
                        onClick={clearFilters}
                        disabled={activeFiltersCount === 0}
                        className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
                          activeFiltersCount > 0 
                            ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' 
                            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <RotateCcw size={14} /> {t('dashboard.reset')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div key={job.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{job.title}</h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(job.status)}`}>
                                {job.status.replace('_', ' ')}
                              </span>
                              {job.paymentStatus === 'PAID' && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                                  <CheckCircle size={10} /> {t('dashboard.paid')}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{job.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" /> 
                                {job.date}
                              </span>
                              
                              {job.customerName && (
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                  Customer: <span className="font-medium text-gray-700 dark:text-gray-300">{job.customerName}</span>
                                </span>
                              )}
                              
                              {job.providerName && (
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                  Expert: <span className="font-medium text-primary-600 dark:text-primary-400">{job.providerName}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between gap-4 min-w-[120px]">
                            <div className="text-right">
                              <span className="block text-2xl font-bold text-gray-900 dark:text-white">{job.amount} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ETB</span></span>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2 w-full md:w-auto">
                              {user.role === UserRole.PROVIDER && activeTab === 'marketplace' && (
                                <button 
                                  onClick={() => handleAcceptJob(job.id)}
                                  className="flex-1 md:flex-none bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                  {t('dashboard.accept_job')}
                                </button>
                              )}
                              
                              {user.role === UserRole.PROVIDER && activeTab === 'my-jobs' && job.status === 'IN_PROGRESS' && (
                                <button 
                                  onClick={() => handleCompleteJob(job.id)}
                                  className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                  {t('dashboard.mark_complete')}
                                </button>
                              )}

                              {user.role === UserRole.HOMEOWNER && job.status === 'PENDING' && (
                                <span className="text-sm text-gray-500 italic bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">{t('dashboard.wait_expert')}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                      <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        {statusFilter !== 'ALL' || dateStart || dateEnd ? (
                           <Filter className="text-gray-300 dark:text-gray-500" size={32} />
                        ) : (
                           <Briefcase className="text-gray-300 dark:text-gray-500" size={32} />
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t('dashboard.no_jobs')}</h3>
                      <p className="max-w-sm mx-auto mb-4">
                         {statusFilter !== 'ALL' || dateStart || dateEnd
                          ? "No jobs match your current filters. Try adjusting them."
                          : (user.role === UserRole.HOMEOWNER 
                              ? "You haven't posted any job requests yet." 
                              : (activeTab === 'marketplace' ? "There are currently no open jobs available." : "You haven't accepted any jobs yet.")
                            )
                          }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalStep === 1 ? 'Post New Job Request' : 'Complete Payment'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Step {modalStep} of 2</p>
              </div>
              <button 
                onClick={() => { setShowPostModal(false); setModalStep(1); }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              
              {/* Step 1: Job Details */}
              {modalStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4 animate-fade-in">
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-2">
                      <Briefcase size={16} className="flex-shrink-0 mt-0.5" />
                      Experts will see this request immediately.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                    <input
                      type="text"
                      required
                      value={newJobData.title}
                      onChange={(e) => setNewJobData({...newJobData, title: e.target.value})}
                      placeholder="e.g., Fix Leaking Kitchen Sink"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={newJobData.description}
                      onChange={(e) => setNewJobData({...newJobData, description: e.target.value})}
                      placeholder="Describe the issue in detail..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Budget (ETB)</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        value={newJobData.amount}
                        onChange={(e) => setNewJobData({...newJobData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 text-sm">ETB</span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button
                      type="button"
                      onClick={() => setShowPostModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Next: Payment
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Payment Gateway */}
              {modalStep === 2 && (
                <div className="animate-fade-in">
                  <PaymentGateway 
                    amount={Number(newJobData.amount)} 
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setModalStep(1)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;