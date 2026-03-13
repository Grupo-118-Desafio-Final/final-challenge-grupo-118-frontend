import { tokenStorage } from './token';

const API_BASE_URL = '/api';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Called globally when any API response returns 401. Set by App on mount. */
export let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();

  if (!token) {
    onUnauthorized?.();
    throw new ApiError(401, { message: 'Not authenticated' });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type for requests that carry a JSON body
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    onUnauthorized?.();
    const error = await response.json().catch(() => ({}));
    throw new ApiError(401, error);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
