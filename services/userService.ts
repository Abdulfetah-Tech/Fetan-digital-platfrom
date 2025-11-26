import { User, Provider, Review, UserRole } from '../types';
import { MOCK_PROVIDERS, MOCK_REVIEWS } from '../constants';
import { supabase } from '../lib/supabaseClient';

const USERS_KEY = 'fetan_users';

export const userService = {
  async getUserById(id: string): Promise<User | Provider | null> {
    
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null; // Or handle better

      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatar: data.avatar,
        // Provider specific fields
        category: data.category,
        rating: data.rating,
        hourlyRate: data.hourly_rate,
        bio: data.bio,
        location: data.location,
        verified: data.verified,
        reviews: data.reviews_count,
        experience: '5 Years' // Placeholder as it might not be in DB Schema yet
      };
      return user as User | Provider;
    }

    // 2. MOCK STRATEGY
    await new Promise(resolve => setTimeout(resolve, 300));

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const localUser = users.find(u => u.id === id);
    if (localUser) return localUser;

    const mockProvider = MOCK_PROVIDERS.find(p => p.id === id);
    if (mockProvider) return mockProvider;

    return null;
  },

  async getReviews(userId: string): Promise<Review[]> {
    if (supabase) {
       // Assuming a reviews table exists, if not, returning empty or mock
       // const { data } = await supabase.from('reviews').select('*').eq('provider_id', userId);
       return MOCK_REVIEWS.filter(r => r.providerId === userId); // Fallback to mock for reviews if table not ready
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_REVIEWS.filter(r => r.providerId === userId);
  },

  async updateUserBio(userId: string, bio: string): Promise<void> {
    if (supabase) {
       const { error } = await supabase
         .from('profiles')
         .update({ bio })
         .eq('id', userId);
       
       if (error) throw new Error(error.message);
       return;
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    const usersStr = localStorage.getItem(USERS_KEY);
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const userIndex = users.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].bio = bio; 
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  }
};
