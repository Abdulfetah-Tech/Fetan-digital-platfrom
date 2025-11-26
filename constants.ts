import { Provider, ServiceCategory, UserRole, Job, Review } from './types';

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Nigat Geletu',
    email: 'nigat@fetan.com',
    role: UserRole.PROVIDER,
    category: ServiceCategory.PLUMBING,
    rating: 4.8,
    hourlyRate: 200, // ETB
    bio: 'Expert plumber with 10 years of experience in leak detection and pipe installation.',
    location: 'Adama, Ethiopia',
    verified: true,
    reviews: 45,
    experience: '10 Years',
    avatar: 'https://picsum.photos/seed/nigat/150/150'
  },
  {
    id: 'p2',
    name: 'Abel Bekele',
    email: 'abel@fetan.com',
    role: UserRole.PROVIDER,
    category: ServiceCategory.ELECTRICAL,
    rating: 4.9,
    hourlyRate: 350,
    bio: 'Certified electrician specializing in home wiring and appliance installation.',
    location: 'Addis Ababa, Ethiopia',
    verified: true,
    reviews: 120,
    experience: '8 Years',
    avatar: 'https://picsum.photos/seed/abel/150/150'
  },
  {
    id: 'p3',
    name: 'Mahilet Dinku',
    email: 'mahilet@fetan.com',
    role: UserRole.PROVIDER,
    category: ServiceCategory.PAINTING,
    rating: 4.7,
    hourlyRate: 150,
    bio: 'Interior and exterior painting specialist. I bring color to your life.',
    location: 'Adama, Ethiopia',
    verified: true,
    reviews: 32,
    experience: '5 Years',
    avatar: 'https://picsum.photos/seed/mahilet/150/150'
  },
  {
    id: 'p4',
    name: 'Imamudin Johar',
    email: 'imamudin@fetan.com',
    role: UserRole.PROVIDER,
    category: ServiceCategory.CARPENTRY,
    rating: 4.6,
    hourlyRate: 250,
    bio: 'Custom furniture and woodwork repairs. Quality craftsmanship guaranteed.',
    location: 'Bishoftu, Ethiopia',
    verified: false,
    reviews: 18,
    experience: '4 Years',
    avatar: 'https://picsum.photos/seed/imamudin/150/150'
  },
  {
    id: 'p5',
    name: 'Edom Gurmecha',
    email: 'edom@fetan.com',
    role: UserRole.PROVIDER,
    category: ServiceCategory.INSTALLATION,
    rating: 5.0,
    hourlyRate: 300,
    bio: 'Satellite dish and home security system installation expert.',
    location: 'Adama, Ethiopia',
    verified: true,
    reviews: 60,
    experience: '7 Years',
    avatar: 'https://picsum.photos/seed/edom/150/150'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Fix Leaking Sink',
    description: 'Kitchen sink pipe is leaking heavily.',
    status: 'COMPLETED',
    date: '2025-05-15',
    customerId: 'u1',
    customerName: 'Abdulfetah Sultan',
    providerId: 'p1',
    providerName: 'Nigat Geletu',
    amount: 500
  },
  {
    id: 'j2',
    title: 'Install Ceiling Fan',
    description: 'Need installation of a new fan in the living room.',
    status: 'IN_PROGRESS',
    date: '2025-06-01',
    customerId: 'u1',
    customerName: 'Abdulfetah Sultan',
    providerId: 'p2',
    providerName: 'Abel Bekele',
    amount: 350
  },
  {
    id: 'j3',
    title: 'Paint Bedroom',
    description: '12x12 bedroom needs repainting. White color.',
    status: 'PENDING',
    date: '2025-06-02',
    customerId: 'u1',
    customerName: 'Abdulfetah Sultan',
    amount: 1200
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    providerId: 'p1',
    reviewerName: 'Alemu T.',
    rating: 5,
    date: '2024-05-16',
    comment: 'Excellent work! Fixed the leak very quickly and was very professional. Highly recommended.'
  },
  {
    id: 'r2',
    providerId: 'p1',
    reviewerName: 'Sara K.',
    rating: 4,
    date: '2024-04-20',
    comment: 'Good job, but arrived slightly late. The work itself was solid though.'
  },
  {
    id: 'r3',
    providerId: 'p2',
    reviewerName: 'Dawit M.',
    rating: 5,
    date: '2024-06-02',
    comment: 'Abel is a master electrician. Installed my complex lighting system perfectly.'
  },
  {
    id: 'r4',
    providerId: 'p3',
    reviewerName: 'Hana B.',
    rating: 5,
    date: '2024-03-15',
    comment: 'Loved the colors! Very clean work, no mess left behind.'
  }
];