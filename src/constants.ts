export const APP_VERSION = '3.1.0';

export const ENABLE_REDUX_DEV_TOOLS = true;

export const SEVER_URL = 'https://dankstocks.com/api';

export const LOCAL_URL = 'http://127.0.0.1:8080/api';

export const BASE_URL =
  process.env.NODE_ENV === 'production' ? SEVER_URL : LOCAL_URL;

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN'
};

export const LOGOS = {
  LIGHT: '/static/light-logo.svg',
  ONE_DARK: '/static/dark-logo.svg'
};

export const FLAG_OPTIONS = [
  { name: 'market', label: 'Market Manipulation' },
  { name: 'abuse', label: 'Abuse' },
  { name: 'other', label: 'Other' }
];
