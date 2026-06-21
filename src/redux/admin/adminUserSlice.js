import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://backend-d72l.onrender.com";

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
    users: [],
    selectedUser: null,
    loading: false,
    actionLoading: false,
    error: null,
    actionError: null,
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,
};

export const getAllUsers = createAsyncThunk(

    'adminUser/getAllUsers',

    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {

        try {

            const { data } = await axios.get( `${BASE_URL}/admin/users?page=${page}&limit=${limit}`, getAuthConfig() );
            return data;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Kullanıcılar alınamadı.' });
        }
    }
);

export const getUserById = createAsyncThunk(

    'adminUser/getUserById',

    async (userId, { rejectWithValue }) => {

        try {

            const { data } = await axios.get( `${BASE_URL}/admin/users/${userId}`, getAuthConfig() );
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Kullanıcı alınamadı.' });
        }
    }
);

export const updateUserRole = createAsyncThunk(

    'adminUser/updateUserRole',

    async ({ userId, role }, { rejectWithValue }) => {

        try {

            const { data } = await axios.patch( `${BASE_URL}/admin/users/${userId}/role`, { role }, getAuthConfig() );
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Rol güncellenemedi.' });
        }
    }
);

export const updateUserStatus = createAsyncThunk(

    'adminUser/updateUserStatus',

    async ({ userId, isActive }, { rejectWithValue }) => {

        try {

            const { data } = await axios.patch( `${BASE_URL}/admin/users/${userId}/status`, { isActive }, getAuthConfig() );
            return data.user;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Durum güncellenemedi.' });
        }
    }
);

export const deleteUser = createAsyncThunk(

    'adminUser/deleteUser',

    async (userId, { rejectWithValue }) => {

        try {

            await axios.delete(`${BASE_URL}/admin/users/${userId}`, getAuthConfig());
            return userId;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Kullanıcı silinemedi.' });
        }
    }
);

export const deleteManyUsers = createAsyncThunk(

    'adminUser/deleteManyUsers',

    async (userIds, { rejectWithValue }) => {

        try {

            await axios.post(`${BASE_URL}/admin/users/bulk-delete`, { ids: userIds }, getAuthConfig());
            return userIds;
        } catch (error) {

            return rejectWithValue(error.response?.data || { message: 'Toplu silme başarısız.' });
        }
    }
);

export const verifyUserEmail = createAsyncThunk(

    'adminUser/verifyUserEmail',

    async (userId, { rejectWithValue }) => {

        try {

            const { data } = await axios.patch(
                `${BASE_URL}/admin/users/${userId}/verify-email`,
                {},
                getAuthConfig()
            );
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Doğrulama başarısız.' });
        }
    }
);

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {
        clearActionError: (state) => {
            state.actionError = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {

        /* getAllUsers */
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                // Backend'den { users, total, page, pages } gibi bir yapı döneceğini varsayıyoruz
                // Eğer direkt dizi dönüyorsa: state.users = action.payload
                state.users      = action.payload.users      ?? action.payload;
                state.totalUsers = action.payload.total      ?? state.users.length;
                state.currentPage= action.payload.page       ?? 1;
                state.totalPages = action.payload.pages      ?? 1;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload?.message || 'Kullanıcılar alınamadı.';
            });

        /* getUserById */
        builder
            .addCase(getUserById.pending, (state) => { state.actionLoading = true; })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.actionLoading  = false;
                state.selectedUser   = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });

        /* updateUserRole */
        builder
            .addCase(updateUserRole.pending, (state) => { state.actionLoading = true; state.actionError = null; })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.actionLoading = false;
                const idx = state.users.findIndex(u => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
                if (state.selectedUser?._id === action.payload._id) state.selectedUser = action.payload;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });

        /* updateUserStatus */
        builder
            .addCase(updateUserStatus.pending, (state) => { state.actionLoading = true; state.actionError = null; })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                const idx = state.users.findIndex(u => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
                if (state.selectedUser?._id === action.payload._id) state.selectedUser = action.payload;
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });

        /* deleteUser */
        builder
            .addCase(deleteUser.pending, (state) => { state.actionLoading = true; state.actionError = null; })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.users         = state.users.filter(u => u._id !== action.payload);
                state.totalUsers    = Math.max(0, state.totalUsers - 1);
                if (state.selectedUser?._id === action.payload) state.selectedUser = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });

        /* deleteManyUsers */
        builder
            .addCase(deleteManyUsers.pending, (state) => { state.actionLoading = true; state.actionError = null; })
            .addCase(deleteManyUsers.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.users         = state.users.filter(u => !action.payload.includes(u._id));
                state.totalUsers    = Math.max(0, state.totalUsers - action.payload.length);
            })
            .addCase(deleteManyUsers.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });

        /* verifyUserEmail */
        builder
            .addCase(verifyUserEmail.pending, (state) => { state.actionLoading = true; state.actionError = null; })
            .addCase(verifyUserEmail.fulfilled, (state, action) => {
                state.actionLoading = false;
                const idx = state.users.findIndex(u => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
                if (state.selectedUser?._id === action.payload._id) state.selectedUser = action.payload;
            })
            .addCase(verifyUserEmail.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError   = action.payload?.message;
            });
    },
});

export const { clearActionError, clearSelectedUser, setCurrentPage } = adminUserSlice.actions;
export default adminUserSlice.reducer;