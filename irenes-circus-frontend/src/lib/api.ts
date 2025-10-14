// API client for connecting to the backend
import { ITrack, IEvent, IBandMember, IGalleryImage, IContact, IProduct, IOrder } from './types';

const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const WITH_PROTOCOL = RAW_API_BASE.startsWith('http') ? RAW_API_BASE : `https://${RAW_API_BASE}`;
export const API_URL = WITH_PROTOCOL.endsWith('/api') ? WITH_PROTOCOL : `${WITH_PROTOCOL}/api`;

// Helper function for API requests
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include' // Include cookies for CORS
  });

  // Handle token expiration
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.message === 'Token expired' || errorData.message === 'Invalid token') {
      // Clear expired token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Redirect to login if we're in admin area
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }
  }

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      
      // Handle validation errors
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors.map((err: { msg?: string; message?: string }) => err.msg || err.message).join(', ');
      }
    } catch (e) {
      // If we can't parse JSON, use status text
      errorMessage = response.statusText;
    }
    
    throw new Error(errorMessage);
  }

  return await response.json();
}

// Tracks API
export const tracksAPI = {
  getAll: () => fetchAPI<ITrack[]>('/tracks'),
  getById: (id: string) => fetchAPI<ITrack>(`/tracks/${id}`),
  create: (data: Omit<ITrack, '_id'>) => 
    fetchAPI<ITrack>('/tracks', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: Partial<ITrack>) => 
    fetchAPI<ITrack>(`/tracks/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    fetchAPI<{ message: string }>(`/tracks/${id}`, { 
      method: 'DELETE' 
    })
};

// Events API
export const eventsAPI = {
  getAll: () => fetchAPI<IEvent[]>('/events'),
  getById: (id: string) => fetchAPI<IEvent>(`/events/${id}`),
  create: (data: Omit<IEvent, '_id'>) => 
    fetchAPI<IEvent>('/events', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: Partial<IEvent>) => 
    fetchAPI<IEvent>(`/events/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    fetchAPI<{ message: string }>(`/events/${id}`, { 
      method: 'DELETE' 
    })
};

// Band Members API
export const bandMembersAPI = {
  getAll: () => fetchAPI<IBandMember[]>('/band-members'),
  getById: (id: string) => fetchAPI<IBandMember>(`/band-members/${id}`),
  create: (data: Omit<IBandMember, '_id'>) => 
    fetchAPI<IBandMember>('/band-members', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: Partial<IBandMember>) => 
    fetchAPI<IBandMember>(`/band-members/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    fetchAPI<{ message: string }>(`/band-members/${id}`, { 
      method: 'DELETE' 
    })
};

// Upload API (images)
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const message = (await response.json().catch(() => ({}))).message || response.statusText;
      throw new Error(message);
    }

    return response.json();
  }
};

// Gallery API
export const galleryAPI = {
  getAll: (opts?: { eventId?: string }) => {
    const query = opts?.eventId ? `?eventId=${encodeURIComponent(opts.eventId)}` : '';
    return fetchAPI<IGalleryImage[]>(`/gallery${query}`);
  },
  getById: (id: string) => fetchAPI<IGalleryImage>(`/gallery/${id}`),
  create: (data: Omit<IGalleryImage, '_id'>) => 
    fetchAPI<IGalleryImage>('/gallery', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  update: (id: string, data: Partial<IGalleryImage>) => 
    fetchAPI<IGalleryImage>(`/gallery/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  delete: (id: string) => 
    fetchAPI<{ message: string }>(`/gallery/${id}`, { 
      method: 'DELETE' 
    })
};

// Contact API
export const contactAPI = {
  submitForm: (data: Omit<IContact, '_id' | 'isRead'>) => 
    fetchAPI<{ message: string, id: string }>('/contact', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  getAll: () => fetchAPI<IContact[]>('/contact'),
  getById: (id: string) => fetchAPI<IContact>(`/contact/${id}`),
  markAsRead: (id: string) => 
    fetchAPI<IContact>(`/contact/${id}/read`, { 
      method: 'PUT' 
    }),
  delete: (id: string) => 
    fetchAPI<{ message: string }>(`/contact/${id}`, { 
      method: 'DELETE' 
    })
};

// Auth API
interface IAuthResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token?: string;
}

export const authAPI = {
  login: (email: string, password: string) => 
    fetchAPI<IAuthResponse>('/auth/login', { 
      method: 'POST', 
      body: JSON.stringify({ email, password }) 
    }),
  register: (username: string, email: string, password: string) => 
    fetchAPI<IAuthResponse>('/auth/register', { 
      method: 'POST', 
      body: JSON.stringify({ username, email, password }) 
    }),
  getCurrentUser: () => fetchAPI<{ user: IAuthResponse['user'] }>('/auth/me')
}; 

// Products API
export const productsAPI = {
  getAll: (opts?: { active?: boolean }) => {
    const q = opts?.active !== undefined ? `?active=${opts.active}` : '';
    return fetchAPI<IProduct[]>(`/products${q}`);
  },
  getById: (id: string) => fetchAPI<IProduct>(`/products/${id}`),
  getBySlug: (slug: string) => fetchAPI<IProduct>(`/products/slug/${slug}`),
  getCategories: () => fetchAPI<string[]>('/products/categories'),
  create: (data: Partial<IProduct>) => fetchAPI<IProduct>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<IProduct>) => fetchAPI<IProduct>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/products/${id}`, { method: 'DELETE' })
};

// Orders API (admin + public draft)
export const ordersAPI = {
  list: () => fetchAPI<IOrder[]>('/orders'),
  getById: (id: string) => fetchAPI<IOrder>(`/orders/track/${id}`), // Public tracking endpoint
  fulfill: (id: string) => fetchAPI<IOrder>(`/orders/${id}/fulfill`, { method: 'PUT' }),
  createDraft: (items: Array<{ productId: string; quantity: number }>, currency?: string) =>
    fetchAPI<IOrder>('/orders/draft', { method: 'POST', body: JSON.stringify({ items, currency }) })
};

// Checkout APIs
export const checkoutAPI = {
  stripeCreateSession: (params: { items: Array<{ productId: string; quantity: number; variantIndex?: number | null }>; currency?: string; successUrl: string; cancelUrl: string; collectShipping?: boolean; shippingCountry?: string; shippingMethodId?: string; promoCode?: string; giftCardCode?: string; contact?: { email?: string; name?: string; phone?: string; address?: { line1: string; line2?: string; city: string; state?: string; postal_code: string; country: string } } }) =>
    fetchAPI<{ url: string; id: string }>(`/payments/checkout/session`, { method: 'POST', body: JSON.stringify(params) }),
  paypalCreateOrder: (params: { items: Array<{ productId: string; quantity: number; variantIndex?: number | null }>; currency?: string; returnUrl: string; cancelUrl: string; collectShipping?: boolean; shippingCountry?: string; promoCode?: string; giftCardCode?: string; contact?: { email?: string; name?: string; phone?: string; address?: { line1: string; line2?: string; city: string; state?: string; postal_code: string; country: string } } }) =>
    fetchAPI<{ url: string; id: string }>(`/paypal/order`, { method: 'POST', body: JSON.stringify(params) }),
  paypalCaptureOrder: (paypalOrderId: string) => fetchAPI<{ status: string }>(`/paypal/order/${paypalOrderId}/capture`, { method: 'POST' })
};

// Shipping API
export const shippingAPI = {
  publicGetOptions: (country: string) => fetchAPI<Array<{ id: string; name: string; description?: string; priceCents: number }>>(`/shipping/${encodeURIComponent(country)}`),
  listConfigs: () => fetchAPI<any[]>(`/shipping`),
  upsertConfig: (country: string, options: Array<{ id: string; name: string; description?: string; priceCents: number; active?: boolean }>) =>
    fetchAPI<any>(`/shipping`, { method: 'POST', body: JSON.stringify({ country, options }) }),
  deleteConfig: (country: string) => fetchAPI<{ message: string }>(`/shipping/${encodeURIComponent(country)}`, { method: 'DELETE' })
};

// Promotions API
export const promotionsAPI = {
  list: () => fetchAPI<any[]>('/promotions'),
  create: (data: any) => fetchAPI<any>('/promotions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI<any>(`/promotions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/promotions/${id}`, { method: 'DELETE' }),
  validate: (code: string) => fetchAPI<{ valid: boolean; promotion?: any; message?: string }>(`/promotions/validate`, { method: 'POST', body: JSON.stringify({ code }) })
};

// Gift Cards API
export const giftCardsAPI = {
  list: () => fetchAPI<any[]>('/gift-cards'),
  create: (amountCents: number, expiresAt?: string) => fetchAPI<any>('/gift-cards', { method: 'POST', body: JSON.stringify({ amountCents, expiresAt }) }),
  update: (id: string, data: any) => fetchAPI<any>(`/gift-cards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI<{ message: string }>(`/gift-cards/${id}`, { method: 'DELETE' }),
  validate: (code: string) => fetchAPI<{ valid: boolean; balanceCents?: number; message?: string }>(`/gift-cards/validate`, { method: 'POST', body: JSON.stringify({ code }) })
};