const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(
  /\/$/,
  ''
);

async function request(path, { token, ...options } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data;
}

export const apiClient = {
  getHealth: () => request('/health'),
  getLookups: () => request('/lookups'),
  getWorldStats: () => request('/stats/world'),
  getCareerPaths: ({ q = '' } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const queryString = params.toString();
    return request(`/careers/paths${queryString ? `?${queryString}` : ''}`);
  },
  getJobs: ({ limit = 8, q = '', careerId = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (q) params.set('q', q);
    if (careerId) params.set('careerId', String(careerId));
    return request(`/jobs?${params.toString()}`);
  },
  syncJobs: ({ limit = 40, search = '' } = {}) =>
    request('/jobs/sync', {
      method: 'POST',
      body: JSON.stringify({ limit, search })
    }),
  getRecommendations: ({ riasecCodes, mbtiCode, skillIds, token }) =>
    request('/analysis/recommendations', {
      method: 'POST',
      token,
      body: JSON.stringify({ riasecCodes, mbtiCode, skillIds })
    }),
  getAnalysisHistory: ({ token, limit = 20 } = {}) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    return request(`/tracking/history?${params.toString()}`, { token });
  },
  getChecklist: ({ token, careerId = null } = {}) => {
    const params = new URLSearchParams();
    if (careerId) params.set('careerId', String(careerId));
    const queryString = params.toString();
    return request(`/tracking/checklist${queryString ? `?${queryString}` : ''}`, { token });
  },
  bootstrapChecklist: ({ token, careerId }) =>
    request('/tracking/checklist/bootstrap', {
      method: 'POST',
      token,
      body: JSON.stringify({ careerId })
    }),
  updateChecklistItem: ({ token, itemId, completed }) =>
    request(`/tracking/checklist/${itemId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ completed })
    }),
  login: ({ email, password }) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: ({ fullName, email, password }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password })
    }),
  getMe: (token) => request('/auth/me', { token })
};
