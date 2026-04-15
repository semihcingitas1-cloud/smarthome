import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";

const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { 
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token?.trim()}`
        },
        withCredentials: true
    };
};

const initialState = {
    user: {},
    isAuth: false,
    loading: false,
    error: null
};

export const register = createAsyncThunk(

    'register',

    async (data, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }

        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        
        if (!response.ok) {

            let error = await response.json();
            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

export const login = createAsyncThunk(
    'login',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };

            const { data } = await axios.post(
                `${BASE_URL}/login`, 
                { email: userData.email, password: userData.password }, 
                config
            );

            localStorage.setItem("token", data?.token);
            return data;
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
);

export const forgotPassword = createAsyncThunk(

    'forgot',
    async (email, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email})
        }

        const response = await fetch(`${BASE_URL}/forgotPassword`, requestOptions);
        
        if (!response.ok) {

            let error = await response.json();
            return rejectWithValue(error);
        }
        
        return (await response.json());
    }
);

export const resetPassword = createAsyncThunk(

    'reset',

    async (params, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({password: params.password})
        }

        const response = await fetch(`${BASE_URL}/reset/${params.token}`, requestOptions);

        if (!response.ok) {
            let error = await response.json();
            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

export const profile = createAsyncThunk(

    'profile',

    async (_, { rejectWithValue }) => {

        const token = localStorage.getItem("token"); 
        
        if(!token){

            return rejectWithValue({ message: "Oturum açılmamış. Token bulunamadı." });
        }

        const response = await fetch(`${BASE_URL}/profile`, { headers: {

            authorization: `Bearer ${token.trim()}` 
        }});

        if (!response.ok) {

            let error = await response.json();

            if (response.status === 401) {

                localStorage.removeItem("token");
            }

            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

export const addHome = createAsyncThunk(

    'addHome',

    async (homeData, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/add-home`, homeData, getAuthConfig());
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteHome = createAsyncThunk(

    'deleteHome',

    async (homeId, { rejectWithValue }) => {

        try {

            const { data } = await axios.delete(`${BASE_URL}/delete-home/${homeId}`, getAuthConfig());
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
);

export const addRoom = createAsyncThunk(

    'addRoom',

    async ({ homeId, roomName }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/add-room`, { homeId, roomName }, getAuthConfig());
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteRoom = createAsyncThunk(

    'deleteRoom',

    async ({ homeId, roomId }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/delete-room`, { homeId, roomId }, getAuthConfig());
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response.data);
        }
    }
);

export const userSlice = createSlice({

    name: 'user',
    initialState,
    reducers: {

        logoutUser: (state) => {

            state.isAuth = false;
            state.loading = false;
            state.user = {};
            state.error = null;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {

        builder.addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(resetPassword.pending, (state) => { 
            state.loading = true; 
            state.error = null; 
        });
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.isAuth = false;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.isAuth = true;
            state.loading = false;
            state.user = action.payload;
            state.error = null;

            if (action.payload?.token) {
                localStorage.setItem('token', action.payload.token);
            }
        });

        builder.addCase(login.pending, (state) => {
            state.loading = true; state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuth = true;
            state.loading = false;
            state.user = action.payload;
            state.error = null;


            if (action.payload?.token) {

                localStorage.setItem('token', action.payload.token);
            }
        });

        builder.addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(profile.fulfilled, (state, action) => {
            state.isAuth = true;
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {
            state.loading = false; state.error = null;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.loading = false; state.error = null;
        });

        const managementActions = [addHome, deleteHome, addRoom, deleteRoom];

        managementActions.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(action.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            });
            builder.addCase(action.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        });

        [register.rejected, login.rejected, profile.rejected].forEach(action => {
            builder.addCase(action, (state, action) => {
                state.loading = false;
                state.isAuth = false;
                state.error = action.payload; 
                if (action.type === profile.rejected.type) {
                    state.user = {};
                }
            });
        });

        [forgotPassword.rejected, resetPassword.rejected].forEach(action => {
            builder.addCase(action, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        });
    },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
