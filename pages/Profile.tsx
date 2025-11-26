import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Provider, UserRole, Review, Job } from '../types';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { trustService } from '../services/trustService';
import { chatService } from '../services/chatService';
import { MapPin, Star, Shield, Clock, Mail, Phone, Calendar, Briefcase, Award, ArrowLeft, MessageSquare, Share2, CheckCircle, Edit2, Save, X, Loader2, ShieldCheck, Flag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ReportModal from '../components/ReportModal';
import VerificationModal from '../components/VerificationModal';
import SafetyTips from '../components/SafetyTips';
import OptimizedImage from '../components/OptimizedImage';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  
  const [profileUser, setProfileUser] = useState<User | Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [history, setHistory] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  // Edit Bio State
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  // Trust & Safety State
  const [showReportModal, setShowReportModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE'>('NONE');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const user = await userService.getUserById(id);
        setProfileUser(user);

        if (user) {
          if (user.role === UserRole.PROVIDER) {
            setBio((user as Provider).bio || '');
            const userReviews = await userService.getReviews(user.id);
            setReviews(userReviews);
          }
          
          const userJobs = await jobService.getJobsForUser(user.id, user.role);
          const displayJobs = user.role === UserRole.PROVIDER 
            ? userJobs.filter(j => j.status === 'COMPLETED')
            : userJobs;
          setHistory(displayJobs);

          // Check verification status if it's the current user
          if (currentUser?.id === user.id) {
            const status = await trustService.getVerificationStatus(user.id);
            setVerificationStatus(status);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        addToast("Failed to fetch profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, addToast, currentUser?.id]);

  const handleShare = async () => {
    const shareData = {
      title: `Fetan Profile: ${profileUser?.name}`,
      text: `Check out ${profileUser?.name}'s profile on Fetan Digital Platform.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Profile link copied to clipboard!", "success");
    }
  };

  const handleEditBioClick = () => {
    setEditedBio(bio);
    setIsEditingBio(true);
  };

  const handleCancelEditBio = () => {
    setIsEditingBio(false);
    setEditedBio('');
  };

  const handleSaveBio = async () => {
    if (!profileUser) return;
    setIsSavingBio(true);
    try {
      await userService.updateUserBio(profileUser.id, editedBio);
      setBio(editedBio);
      setIsEditingBio(false);
      if (profileUser.role === UserRole.PROVIDER) {
         setProfileUser({ ...profileUser, bio: editedBio } as Provider);
      }
      addToast("Bio updated successfully", "success");
    } catch (error) {
      console.error("Failed to save bio", error);
      addToast("Failed to save bio", "error");
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleMessage = async () => {
    if (!currentUser || !profileUser) return;
    try {
      const conversationId = await chatService.startConversation(currentUser.id, profileUser.id);
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error(error);
      addToast("Failed to start conversation", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <SEO title="User Not Found" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The user profile you are looking for doesn't exist.</p>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  const isProvider = profileUser.role === UserRole.PROVIDER;
  const providerData = isProvider ? (profileUser as Provider) : null;
  const isOwner = currentUser?.id === profileUser.id;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-12 pt-16 transition-colors duration-300">
      <SEO 
        title={profileUser.name} 
        description={isProvider ? `${profileUser.name} is a ${providerData?.category} in ${providerData?.location}. Book now on Fetan.` : `Check out ${profileUser.name}'s profile on Fetan.`}
        image={profileUser.avatar}
      />

      {/* Header Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all z-10"
        >
          <ArrowLeft size={20} />
        </button>
        {/* Safety Tips Trigger */}
        <button
          onClick={() => setShowSafetyTips(true)}
          className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all z-10 text-sm font-medium border border-white/20"
        >
           <Shield size={16} /> {t('profile.safety_tip')}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-end">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-700 transition-colors">
                <OptimizedImage 
                  src={profileUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=random`} 
                  alt={profileUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {isProvider && providerData?.verified && (
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-0.5 border-2 border-white dark:border-gray-800 shadow-sm" title="Verified Expert">
                  <CheckCircle size={22} className="text-white fill-green-500" />
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 flex-wrap">
                    {profileUser.name}
                    {isProvider && providerData?.verified && (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm px-3 py-1 rounded-full border border-green-200 dark:border-green-800 align-middle font-semibold shadow-sm">
                        <CheckCircle size={14} className="text-white fill-green-500" />
                        {t('profile.verified')}
                      </span>
                    )}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                     {isProvider && (
                      <span className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2.5 py-0.5 rounded-md font-medium border border-primary-100 dark:border-primary-800">
                        <Briefcase size={14} />
                        {providerData?.category}
                      </span>
                     )}
                     <span className="flex items-center gap-1.5">
                       <MapPin size={16} className="text-gray-400" />
                       {isProvider ? providerData?.location : 'Ethiopia'}
                     </span>
                     <span className="flex items-center gap-1.5">
                       <Mail size={16} className="text-gray-400" />
                       {profileUser.email}
                     </span>
                  </div>
                </div>

                {isProvider && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {providerData?.hourlyRate} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ETB/hr</span>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('reviews');
                        document.getElementById('profile-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="flex items-center gap-1 text-sm group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded-lg transition-all -mr-1"
                      title="View all reviews"
                    >
                      <Star size={16} className="text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-gray-900 dark:text-white">{providerData?.rating}</span>
                      <span className="text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors decoration-dotted underline offset-2 ml-0.5">
                        ({providerData?.reviews} {t('profile.reviews').toLowerCase()})
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[220px]">
              {!isOwner ? (
                <>
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={handleMessage}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                       <MessageSquare size={18} />
                       {t('profile.message')}
                    </button>
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="px-3 py-2.5 border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                      title={t('profile.report')}
                    >
                      <Flag size={20} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="px-3 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" 
                      title={t('profile.share')}
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                  
                   {isProvider && (
                     <button 
                       onClick={() => navigate(`/dashboard?action=book&provider=${encodeURIComponent(profileUser.name)}`)}
                       className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md flex justify-center items-center gap-2"
                     >
                       <Calendar size={20} />
                       {t('profile.book_now')}
                     </button>
                   )}
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleShare}
                    className="w-full md:w-auto px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} /> {t('profile.share')}
                  </button>

                  {isProvider && !providerData?.verified && verificationStatus !== 'APPROVED' && (
                    <button 
                      onClick={() => setShowVerificationModal(true)}
                      disabled={verificationStatus === 'PENDING'}
                      className={`w-full md:w-auto px-6 py-2.5 font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${
                        verificationStatus === 'PENDING'
                         ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                         : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ShieldCheck size={18} /> 
                      {verificationStatus === 'PENDING' ? t('profile.verification_pending') : t('profile.get_verified')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div id="profile-tabs" className="px-6 sm:px-8 border-t border-gray-100 dark:border-gray-700 flex gap-6 overflow-x-auto no-scrollbar scroll-mt-24">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview' ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {t('profile.overview')}
            </button>
            {isProvider && (
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'reviews' ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t('profile.reviews')} ({reviews.length})
              </button>
            )}
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'history' ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {isProvider ? t('profile.completed_jobs') : t('profile.history')}
            </button>
          </div>
        </div>

        {/* Content Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-fade-in transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('profile.about')}</h3>
                   {isOwner && isProvider && !isEditingBio && (
                     <button onClick={handleEditBioClick} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Edit Bio">
                        <Edit2 size={16} />
                     </button>
                   )}
                </div>
                
                {isEditingBio ? (
                  <div className="mb-6 animate-fade-in">
                    <textarea
                      autoFocus
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full min-h-[150px] p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm leading-relaxed mb-3 outline-none"
                      placeholder="Write something about your experience and services..."
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveBio}
                        disabled={isSavingBio}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70"
                      >
                         {isSavingBio ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                         {t('profile.save_bio')}
                      </button>
                      <button
                        onClick={handleCancelEditBio}
                        disabled={isSavingBio}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                         <X size={14} /> {t('profile.cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={isOwner && isProvider ? handleEditBioClick : undefined}
                    className={`text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line ${isOwner && isProvider ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 -ml-2 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700' : ''}`}
                    title={isOwner && isProvider ? "Click to edit your bio" : ""}
                  >
                    {isProvider 
                      ? (bio || <span className="text-gray-400 italic">No bio provided. Click to add one.</span>)
                      : "This user hasn't provided a bio yet."}
                  </div>
                )}

                {isProvider && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('profile.skills')}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Residential', 'Commercial', 'Repairs', 'Maintenance'].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('profile.contact_info')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail size={18} className="text-gray-400" />
                    <span>{profileUser.email}</span>
                  </div>
                   {/* Mock Phone for display */}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Phone size={18} className="text-gray-400" />
                    <span>{profileUser.phone || '+251 91 234 5678'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fade-in">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                              {review.reviewerName.charAt(0)}
                           </div>
                           <span className="font-bold text-gray-900 dark:text-white">{review.reviewerName}</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={`${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400 transition-colors">
                    No reviews yet.
                  </div>
                )}
              </div>
            )}

            {/* Job History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4 animate-fade-in">
                 {history.length > 0 ? (
                  history.map((job) => (
                    <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-colors">
                       <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{job.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{job.date}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                            {job.status}
                          </span>
                       </div>
                       <div className="text-right">
                          <span className="block font-bold text-gray-900 dark:text-white">{job.amount} ETB</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400 transition-colors">
                    No job history available.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Stats (Only for provider) */}
          <div className="lg:col-span-1">
             {isProvider ? (
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24 transition-colors">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('profile.performance')}</h3>
                 
                 <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{providerData?.rating}</div>
                      <div className="text-xs text-blue-800 dark:text-blue-300 font-medium">{t('profile.rating')}</div>
                   </div>
                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{providerData?.experience.split(' ')[0]}+</div>
                      <div className="text-xs text-green-800 dark:text-green-300 font-medium">{t('profile.years_exp')}</div>
                   </div>
                   <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{providerData?.reviews}</div>
                      <div className="text-xs text-purple-800 dark:text-purple-300 font-medium">{t('profile.jobs_done')}</div>
                   </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
                      <div className="text-xs text-orange-800 dark:text-orange-300 font-medium">{t('profile.response')}</div>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="text-primary-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('profile.certified_pro')}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Vetted by Fetan Platform</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="text-primary-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('profile.insurance')}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Covered up to 10k ETB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="text-primary-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('profile.member_since')}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">September 2023</p>
                      </div>
                    </div>
                 </div>
               </div>
             ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24 transition-colors">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('profile.user_status')}</h3>
                   <div className="flex items-center gap-3 text-sm mb-4">
                      <Shield className="text-green-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t('profile.verified_homeowner')}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">Identity confirmed</p>
                      </div>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                      User has posted {history.length} jobs on the platform.
                   </div>
                   
                   <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30 rounded-lg">
                      <div className="flex items-start gap-2">
                         <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-500 mt-0.5" />
                         <div>
                            <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400">{t('profile.safety_tip')}</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{t('profile.safety_tip_desc')}</p>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Trust & Safety Modals */}
      {showReportModal && currentUser && profileUser && (
        <ReportModal 
          reporterId={currentUser.id}
          reportedId={profileUser.id}
          reportedName={profileUser.name}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showVerificationModal && currentUser && (
        <VerificationModal 
          userId={currentUser.id}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      {showSafetyTips && (
        <SafetyTips onClose={() => setShowSafetyTips(false)} />
      )}
    </div>
  );
};

export default Profile;