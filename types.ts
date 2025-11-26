export enum UserRole {
  HOMEOWNER = 'HOMEOWNER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum ServiceCategory {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  PAINTING = 'Painting',
  CARPENTRY = 'Carpentry',
  CLEANING = 'Cleaning',
  INSTALLATION = 'Installation'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Provider extends User {
  role: UserRole.PROVIDER;
  category: ServiceCategory;
  rating: number;
  hourlyRate: number;
  bio: string;
  location: string;
  verified: boolean;
  reviews: number;
  experience: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  date: string;
  customerId?: string;
  customerName: string;
  providerId?: string;
  providerName?: string;
  amount: number;
  // Payment Integration Fields
  paymentStatus?: 'PAID' | 'PENDING' | 'FAILED';
  paymentMethod?: 'telebirr' | 'chapa' | 'cbe';
  transactionId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestion?: string;
}

// Real-time User-to-User Chat Types
export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  otherUser?: { // Hydrated for UI
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
  };
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface Review {
  id: string;
  providerId: string;
  reviewerName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  documentType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}