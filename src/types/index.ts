// Clayton Art House — Domain Types

export type WorkshopCategory =
  | 'Ceramics & Pottery'
  | 'Painting & Drawing'
  | 'Botanical & Flora'
  | 'Glass & Mosaic'
  | 'Textile & Fiber'
  | 'Culinary & Sensory'
  | 'Jewelry & Craft'
  | 'Leather & Bookbinding'
  | 'Candle Craft'
  | 'Fiber & Textiles'
  | 'Arts & Crafts'
  | 'Pottery & Ceramics'
  | 'Floral & Botanical'
  | 'Cake Decorating'
  | 'Private & Seasonal';

export type SessionStatus = 'scheduled' | 'full' | 'cancelled' | 'completed';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded' | 'failed';

export type PaymentProvider = 'paymob' | 'fawry' | 'instapay' | 'cash' | 'mock';

export type EventInquiryStatus = 'new' | 'contacted' | 'quoted' | 'confirmed' | 'archived';

export type PrivateEventType =
  | 'Private Workshop'
  | 'Birthday Celebration'
  | 'Corporate Retreat'
  | 'Bridal Gathering'
  | 'Photo / Film Shoot'
  | 'Custom Experience';

export type GalleryCategory =
  | 'Pottery'
  | 'Painting'
  | 'Garden & Villa'
  | 'Sensory & Tea'
  | 'Private Events';

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  category: WorkshopCategory;
  shortDescription: string;
  description: string;
  priceEgp: number;
  durationMinutes: number;
  capacityPerSession: number;
  difficulty: string;
  whatIsIncluded: string[];
  requirements?: string;
  coverImage: string;
  additionalImages?: string[];
  serviceId?: number;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkshopImage {
  id: string;
  workshopId: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

export interface Session {
  id: string;
  workshopId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  capacity: number;
  bookedSeats: number;
  status: SessionStatus;
  instructorName?: string;
  roomOrSpace?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // Computed / joined helper
  workshop?: Workshop;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  totalBookings: number;
  totalSpentEgp: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  sessionId: string;
  workshopId: string;
  customerId: string;
  attendeesCount: number;
  totalAmountEgp: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  confirmationCode: string;
  createdAt: string;
  updatedAt?: string;
  
  // Joined relation fields
  session?: Session;
  workshop?: Workshop;
  customer?: Customer;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  amountEgp: number;
  currency: string;
  provider: PaymentProvider;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PrivateEventInquiry {
  id: string;
  eventType: PrivateEventType;
  preferredDate: string;
  guestCount: number;
  budgetRange?: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  status: EventInquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  caption?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  venueName: string;
  tagline: string;
  addressLine1: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  instagram: string;
  facebook?: string;
  openingHours: string;
  bookingLeadHours: number;
  cancellationPolicy: string;
  updatedAt?: string;
}

export interface BookingCreationInput {
  sessionId: string;
  attendeesCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
  paymentProvider?: PaymentProvider;
  paymentMethod?: string;
}

export interface BookingCreationResult {
  success: boolean;
  bookingId?: string;
  bookingNumber?: string;
  confirmationCode?: string;
  workshopTitle?: string;
  startTime?: string;
  endTime?: string;
  attendeesCount?: number;
  totalAmountEgp?: number;
  customerName?: string;
  customerEmail?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  error?: string;
}

export type AdminRole = 'super_admin' | 'admin';
export type AdminStatus = 'active' | 'disabled';

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  fullName?: string;
  avatarUrl?: string;
  lastSignInAt?: string;
  createdAt: string;
}
