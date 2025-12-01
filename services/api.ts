
import { API_BASE_URL } from '../constants';
import { User } from '../types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  endpoint: string,
  method: HttpMethod,
  body?: unknown,
  auth = true
): Promise<T> {
  // --- START OF MOCKS ---
  
  // MOCK: Password Reset Flow (Optional helper, though not strictly in spec, keeps UI functional)
  if (method === 'POST' && endpoint === '/auth/forgot-password') {
      return Promise.resolve({ message: 'Reset link sent' } as T);
  }
  if (method === 'POST' && endpoint === '/auth/reset-password') {
      return Promise.resolve({ message: 'Password reset successful' } as T);
  }

  const apiKey = localStorage.getItem('apiKey');

  // Dummy User Mock (requires a specific apiKey for testing without backend)
  if (apiKey === 'dummy-api-key-for-testing') {
    // if (method === 'GET' && endpoint === '/users/me') {
    //   const dummyUser: User = {
    //     id: 'usr_dummy123',
    //     email: 'demo@rainos.com',
    //     apiKey: 'dummy-api-key-for-testing',
    //     subscriptionStatus: 'active', // or 'cancelled', 'past_due'
    //     usage: {
    //       count: 12,
    //       limit: 100, // Set to 5 to test "Free" view, 100 to test "Business" view
    //     },
    //   };
    //   return Promise.resolve(dummyUser as T);
    // }

    // Mock Regenerate Key
    // if (method === 'POST' && endpoint === '/users/me/regenerate-key') {
    //     return Promise.resolve({ apiKey: 'new-dummy-key-' + Date.now() } as T);
    // }

    // Mock Stripe
    if (endpoint.includes('/stripe/')) {
      // Return a promise that resolves with a value that won't break the UI
      if (endpoint.includes('/stripe/')) {
          return Promise.resolve({ url: '#' } as T);
      }
      return Promise.resolve({} as T);
    }
  }
  // --- END OF MOCKS ---

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    if (!apiKey) {
      // Redirect to login or handle unauthorized access
      window.location.hash = '/login';
      throw new Error('Unauthorized: No API Key found.');
    }
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, auth = true) => request<T>(endpoint, 'GET', undefined, auth),
  post: <T>(endpoint: string, body: unknown, auth = true) => request<T>(endpoint, 'POST', body, auth),
  put: <T>(endpoint: string, body: unknown, auth = true) => request<T>(endpoint, 'PUT', body, auth),
  delete: <T>(endpoint: string, auth = true) => request<T>(endpoint, 'DELETE', undefined, auth),
};
