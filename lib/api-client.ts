// Client-side API utility functions

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    cache: 'no-store', // prevent stale data after profile/case updates
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed`);
  }

  return data;
}

export const authAPI = {
  userLogin: (email: string, password: string) =>
    apiRequest('/api/auth/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  userSignup: (email: string, password: string) =>
    apiRequest('/api/auth/user/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  advisorLogin: (email: string, password: string) =>
    apiRequest('/api/auth/advisor/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  advisorSignup: (email: string, password: string, name?: string, firm?: string, bio?: string) =>
    apiRequest('/api/auth/advisor/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, firm, bio }),
    }),

  adminLogin: (email: string, password: string) =>
    apiRequest('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    apiRequest('/api/auth/me'),
};

