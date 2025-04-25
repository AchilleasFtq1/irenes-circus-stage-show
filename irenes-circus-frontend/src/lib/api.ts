// API client for connecting to the backend
import { ITrack, IEvent, IBandMember, IGalleryImage, IContact } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    headers
  });

  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
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

// Gallery API
export const galleryAPI = {
  getAll: () => fetchAPI<IGalleryImage[]>('/gallery'),
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