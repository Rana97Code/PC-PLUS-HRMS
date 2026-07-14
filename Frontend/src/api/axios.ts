import axios from 'axios';
import store from '../store';
import { logout } from '../store/authSlice';

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());

            localStorage.clear();

            window.location.replace('/login');
        }

        return Promise.reject(error);
    }
);

export default api;