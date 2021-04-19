import { io } from 'socket.io-client/dist/socket.io';
import { loadStripe } from '@stripe/stripe-js';

export const APP_VERSION = '3.1.0';

export const ENABLE_REDUX_DEV_TOOLS = true;

export const SEVER_URL = 'https://dankstocks.com';

export const LOCAL_URL = 'http://127.0.0.1:8080';

export const STRIPE_KEY =
  'pk_test_51IYaKXKVBO5q0qZPSZy6q6RSvHnlvipZlfSINADXImc4Uv4oXCtQFm8aoSL4o3fQmz4tLDZAm5c6gWT0xKkXYnim00jfnFsmRv';

export const stripePromise = loadStripe(STRIPE_KEY);

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? SEVER_URL + '/api'
    : LOCAL_URL + '/api';

export const BASE_SOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.dankstocks.com'
    : LOCAL_URL;

export const socket = io(BASE_SOCKET_URL, {
  transports: ['websocket', 'polling', 'flashsocket'],
  secure: true
});

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
