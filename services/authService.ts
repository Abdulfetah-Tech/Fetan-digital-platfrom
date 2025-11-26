import { User, LoginCredentials, RegisterData, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';

const USERS_KEY = 'fetan_users';
const SESSION_KEY = 'fetan_current_user';

// --- MOCK HELPERS (Fallback) ---
const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

interface StoredUser extends User {
  passwordHash: string;
}

const initializeMockData = async () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultPasswordHash = await hashPassword('password123');
    const mockUsers: StoredUser[] = [
      {
        id: 'u1',
        name: 'Abdulfetah Sultan',
        email: 'user@fetan.com',
        role: UserRole.HOMEOWNER,
        passwordHash: defaultPasswordHash,
        avatar: 'https://ui-avatars.com/api/?name=Abdulfetah+Sultan&background=0D8ABC&color=fff'
      },
      {
        id: 'p1',
        name: 'Nigat Geletu',
        email: 'nigat@fetan.com',
        role: UserRole.PROVIDER,
        passwordHash: defaultPasswordHash,
        avatar: 'https://picsum.photos/seed/nigat/150/150'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

initializeMockData();

// --- SERVICE IMPLEMENTATION ---

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password || '',
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error('Login failed');

      // Fetch additional profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn("Profile fetch error:", profileError);
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.email || 'User',
        role: profile?.role as UserRole || UserRole.HOMEOWNER,
        avatar: profile?.avatar
      };

      return user;
    }

    // 2. MOCK STRATEGY (Fallback)
    await new Promise(resolve => setTimeout(resolve, 800));
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find(u => u.email === credentials.email);
    if (!user) throw new Error('Invalid email or password');

    if (credentials.password) {
      const hash = await hashPassword(credentials.password);
      if (hash !== user.passwordHash) throw new Error('Invalid email or password');
    }

    const sessionUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async register(data: RegisterData): Promise<User> {
    
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error('Registration failed');

      // Create Profile Record
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: avatarUrl,
          hourly_rate: 0,
          verified: false
        });

      if (profileError) {
        console.error("Profile creation error", profileError);
        // Clean up auth user if profile fails? For now, we leave it.
      }

      return {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: avatarUrl
      };
    }

    // 2. MOCK STRATEGY
    await new Promise(resolve => setTimeout(resolve, 800));
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email === data.email)) throw new Error('User already exists');

    const passwordHash = await hashPassword(data.password);
    const newUser: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      passwordHash,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    
    // 1. SUPABASE STRATEGY
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      // We have a session, get the profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.name || 'User',
        role: profile?.role as UserRole || UserRole.HOMEOWNER,
        avatar: profile?.avatar
      };
    }

    // 2. MOCK STRATEGY
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  },

  async resetPassword(email: string): Promise<void> {
    if (supabase) {
       const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: window.location.origin + '/reset-password',
       });
       if (error) throw new Error(error.message);
    } else {
       await new Promise(resolve => setTimeout(resolve, 1000));
       console.log(`Mock reset link sent to ${email}`);
    }
  }
};
