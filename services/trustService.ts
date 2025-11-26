import { supabase } from '../lib/supabaseClient';
import { Report, VerificationRequest } from '../types';

export const trustService = {
  async submitReport(data: Omit<Report, 'id' | 'status' | 'createdAt'>): Promise<void> {
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { error } = await supabase.from('reports').insert({
        reporter_id: data.reporterId,
        reported_id: data.reportedId,
        reason: data.reason,
        description: data.description
      });
      if (error) throw new Error(error.message);
      return;
    }

    // 2. MOCK STRATEGY
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Mock Report Submitted:", data);
  },

  async requestVerification(userId: string, documentType: string): Promise<void> {
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { error } = await supabase.from('verification_requests').insert({
        user_id: userId,
        document_type: documentType
      });
      if (error) throw new Error(error.message);
      return;
    }

    // 2. MOCK STRATEGY
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock Verification Requested:", { userId, documentType });
  },

  async getVerificationStatus(userId: string): Promise<'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE'> {
    if (supabase) {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) return 'NONE';
      return data.status as any;
    }
    
    return 'NONE';
  }
};