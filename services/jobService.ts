import { Job, UserRole } from '../types';
import { MOCK_JOBS } from '../constants';
import { supabase } from '../lib/supabaseClient';

const JOBS_KEY = 'fetan_jobs';

if (!localStorage.getItem(JOBS_KEY)) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
}

export const jobService = {
  async getJobsForUser(userId: string, role: UserRole): Promise<Job[]> {
    
    // 1. SUPABASE STRATEGY
    if (supabase) {
      let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
      
      if (role === UserRole.HOMEOWNER) {
        query = query.eq('customer_id', userId);
      } else {
        query = query.eq('provider_id', userId);
      }
      
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      
      return data.map((j: any) => ({
         id: j.id,
         title: j.title,
         description: j.description,
         status: j.status,
         date: j.date || j.created_at.split('T')[0],
         customerId: j.customer_id,
         customerName: j.customer_name,
         providerId: j.provider_id,
         providerName: j.provider_name,
         amount: j.amount,
         paymentStatus: j.payment_status || 'PENDING',
         paymentMethod: j.payment_method,
         transactionId: j.transaction_id
      }));
    }

    // 2. MOCK STRATEGY
    await new Promise(resolve => setTimeout(resolve, 500));
    const jobsStr = localStorage.getItem(JOBS_KEY);
    const allJobs: Job[] = jobsStr ? JSON.parse(jobsStr) : [];
    
    if (role === UserRole.HOMEOWNER) {
      return allJobs.filter(job => 
        job.customerId === userId || 
        (!job.customerId && userId === 'u1' && job.customerName === 'Abdulfetah Sultan')
      );
    } else {
      return allJobs.filter(job => job.providerId === userId); 
    }
  },

  async getAvailableJobs(): Promise<Job[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'PENDING')
        .is('provider_id', null)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      
      return data.map((j: any) => ({
         id: j.id,
         title: j.title,
         description: j.description,
         status: j.status,
         date: j.date || j.created_at.split('T')[0],
         customerId: j.customer_id,
         customerName: j.customer_name,
         providerId: j.provider_id,
         providerName: j.provider_name,
         amount: j.amount,
         paymentStatus: j.payment_status,
         paymentMethod: j.payment_method,
         transactionId: j.transaction_id
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    const jobsStr = localStorage.getItem(JOBS_KEY);
    const allJobs: Job[] = jobsStr ? JSON.parse(jobsStr) : [];
    return allJobs.filter(job => job.status === 'PENDING' && !job.providerId);
  },

  async createJob(jobData: Omit<Job, 'id' | 'date' | 'status'>): Promise<Job> {
    if (supabase) {
       const { data, error } = await supabase.from('jobs').insert({
          title: jobData.title,
          description: jobData.description,
          amount: jobData.amount,
          customer_id: jobData.customerId,
          customer_name: jobData.customerName,
          status: 'PENDING',
          date: new Date().toISOString().split('T')[0],
          // Map camelCase to snake_case for DB
          payment_status: jobData.paymentStatus,
          payment_method: jobData.paymentMethod,
          transaction_id: jobData.transactionId
       }).select().single();

       if (error) throw new Error(error.message);
       
       return {
         ...jobData,
         id: data.id,
         date: data.date,
         status: 'PENDING'
       };
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    const jobsStr = localStorage.getItem(JOBS_KEY);
    const allJobs: Job[] = jobsStr ? JSON.parse(jobsStr) : [];
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      ...jobData
    };
    allJobs.unshift(newJob);
    localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
    return newJob;
  },

  async acceptJob(jobId: string, providerId: string, providerName: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'IN_PROGRESS',
          provider_id: providerId,
          provider_name: providerName
        })
        .eq('id', jobId);
      
      if (error) throw new Error(error.message);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    const jobsStr = localStorage.getItem(JOBS_KEY);
    let allJobs: Job[] = jobsStr ? JSON.parse(jobsStr) : [];
    allJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'IN_PROGRESS', providerId, providerName };
      }
      return job;
    });
    localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
  },

  async completeJob(jobId: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'COMPLETED' })
        .eq('id', jobId);
      if (error) throw new Error(error.message);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    const jobsStr = localStorage.getItem(JOBS_KEY);
    let allJobs: Job[] = jobsStr ? JSON.parse(jobsStr) : [];
    allJobs = allJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: 'COMPLETED' };
      }
      return job;
    });
    localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
  }
};