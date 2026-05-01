import type { AuthDomain } from '../../models/auth/auth';

interface LoginPreferences {
  email: string;
  rememberMe: boolean;
}

const LOGIN_PREFERENCES_KEY_BY_DOMAIN: Record<AuthDomain, string> = {
  client: 'client_login_preferences',
  platform: 'platform_login_preferences',
};

const defaultLoginPreferences: LoginPreferences = {
  email: '',
  rememberMe: false,
};

export const readLoginPreferences = (domain: AuthDomain): LoginPreferences => {
  if (typeof window === 'undefined') {
    return defaultLoginPreferences;
  }

  const key = LOGIN_PREFERENCES_KEY_BY_DOMAIN[domain];
  const rawValue = window.localStorage.getItem(key);
  if (rawValue === null) {
    return defaultLoginPreferences;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    if (
      typeof parsedValue === 'object' &&
      parsedValue !== null &&
      'email' in parsedValue &&
      'rememberMe' in parsedValue
    ) {
      const email = Reflect.get(parsedValue, 'email');
      const rememberMe = Reflect.get(parsedValue, 'rememberMe');
      if (typeof email === 'string' && typeof rememberMe === 'boolean') {
        return { email, rememberMe };
      }
    }
  } catch {
    window.localStorage.removeItem(key);
  }

  return defaultLoginPreferences;
};

export const writeLoginPreferences = (domain: AuthDomain, preferences: LoginPreferences): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const key = LOGIN_PREFERENCES_KEY_BY_DOMAIN[domain];
  if (!preferences.rememberMe) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(preferences));
};
