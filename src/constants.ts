export const APP_VERSION = '3.1.0';

export const ENABLE_REDUX_DEV_TOOLS = true;

export const THEMES = {
  LIGHT: 'LIGHT',
  ONE_DARK: 'ONE_DARK',
  UNICORN: 'UNICORN'
};

export const SEVER_URL = 'https://dankstocks.com/api';

export const LOCAL_URL = 'http://127.0.0.1:8080/api';

export const BASE_URL =
  process.env.NODE_ENV === 'production' ? SEVER_URL : LOCAL_URL;
