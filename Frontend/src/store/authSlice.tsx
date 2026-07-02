import { createSlice } from '@reduxjs/toolkit';

interface User {
    id: number;
    user_name: string;
    user_email: string;
    user_image: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    role_key: string | null;
    permissions: string[];
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    role_key: localStorage.getItem('role_key'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role_key = action.payload.role_key;
            state.permissions = action.payload.permissions;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role_key', action.payload.role_key);
            localStorage.setItem(
                'permissions',
                JSON.stringify(action.payload.permissions)
            );
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role_key = null;
            state.permissions = [];

            localStorage.clear();
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;