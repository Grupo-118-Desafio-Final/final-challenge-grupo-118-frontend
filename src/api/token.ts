const TOKEN_KEY = 'token';

export const tokenStorage = {
  get: (): string => localStorage.getItem(TOKEN_KEY) ?? '',
  set: (token: string): void => { localStorage.setItem(TOKEN_KEY, token); },
  remove: (): void => { localStorage.removeItem(TOKEN_KEY); },
};
