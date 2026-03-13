const USERS_API_BASE = '/users-api';

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
  planId: number;
}

export interface RegisterResponse {
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  error: boolean;
  errorMessage: string;
}


export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${USERS_API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Invalid credentials');
  }

  return response.text();
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${USERS_API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Registration failed');
  }

  return response.json();
}
