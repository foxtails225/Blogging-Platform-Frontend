import axios from 'axios';
import { BASE_URL } from 'src/constants';
import { setSession } from 'src/contexts/JWTAuthContext';
import store from 'src/store';

const axiosConfig = {
  baseURL: BASE_URL,
  timeout: 30000
};

const axiosInstance = axios.create(axiosConfig);

const redirect = (redirectUrl: any) => {
  window.location = redirectUrl;
};

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        setSession(null);
        store.dispatch({ type: 'LOGOUT' });
        return redirect('/login');
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;
