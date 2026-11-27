import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";

const getAuthConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            'Content-Type': 'application/json', 'authorization': `Bearer ${token?.trim()}`
        },
        withCredentials: true
    };
};

const publicConfig = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };

// Yeni token geldiyse kaydet (giriş, 2FA doğrulama, açma ve kapatma sonrası)
const saveToken = (data) => {
    if (data?.token) localStorage.setItem("token", data.token);
};

const apiError = (error, fallback) => error.response?.data || { message: fallback };

const initialState = {

    user: {},
    isAuth: false,
    loading: true,
    error: null,
    twoFactorChallenge: null, // { challengeToken, methods, emailHint, expiresAt }
};

// ───────────────────────── KAYIT / GİRİŞ ─────────────────────────

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

            const { data } = await axios.post(
                `${BASE_URL}/login`,
                { email: userData.email, password: userData.password },
                publicConfig
            );

            // 2FA adımında token yok; "undefined" yazılmasın
            saveToken(data);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, "Giriş başarısız."));
        }
    }
);

export const socialExchange = createAsyncThunk(

    'socialExchange',

    async (code, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/auth/social/exchange`, { code }, publicConfig);
            saveToken(data);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Sosyal giriş tamamlanamadı.'));
        }
    }
);

// ───────────────────────── 2FA: GİRİŞ ADIMI ─────────────────────────

export const verifyLogin2FA = createAsyncThunk(

    'verifyLogin2FA',

    async ({ challengeToken, code, method }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/login/2fa/verify`, { challengeToken, code, method }, publicConfig);
            saveToken(data);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Kod doğrulanamadı.'));
        }
    }
);

export const sendLogin2FAEmail = createAsyncThunk(

    'sendLogin2FAEmail',

    async ({ challengeToken }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/login/2fa/email`, { challengeToken }, publicConfig);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Kod gönderilemedi.'));
        }
    }
);

// ───────────────────────── 2FA: AYARLAR ─────────────────────────

export const get2FAStatus = createAsyncThunk(

    'get2FAStatus',

    async (_, { rejectWithValue }) => {

        try {

            const { data } = await axios.get(`${BASE_URL}/2fa/status`, getAuthConfig());
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Durum alınamadı.'));
        }
    }
);

export const setup2FA = createAsyncThunk(

    'setup2FA',

    async (_, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/2fa/setup`, {}, getAuthConfig());
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Kurulum başlatılamadı.'));
        }
    }
);

export const enable2FA = createAsyncThunk(

    'enable2FA',

    async ({ code }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/2fa/enable`, { code }, getAuthConfig());
            saveToken(data);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Doğrulama açılamadı.'));
        }
    }
);

export const disable2FA = createAsyncThunk(

    'disable2FA',

    async ({ password, code }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/2fa/disable`, { password, code }, getAuthConfig());
            saveToken(data);
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Doğrulama kapatılamadı.'));
        }
    }
);

export const regenerateBackupCodes = createAsyncThunk(

    'regenerateBackupCodes',

    async ({ password, code }, { rejectWithValue }) => {

        try {

            const { data } = await axios.post(`${BASE_URL}/2fa/backup-codes`, { password, code }, getAuthConfig());
            return data;
        } catch (error) {

            return rejectWithValue(apiError(error, 'Yedek kodlar oluşturulamadı.'));
        }
    }
);

// ───────────────────────── ŞİFRE / E-POSTA ─────────────────────────

export const forgotPassword = createAsyncThunk(

    'forgot',

    async (email, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
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
            body: JSON.stringify({ password: params.password })
        }

        const response = await fetch(`${BASE_URL}/reset/${params.token}`, requestOptions);

        if (!response.ok) {

            let error = await response.json();
            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

// Doğrulama mailini yeniden gönderir (reducer'ı yok, global loading/error'a dokunmaz)
export const resendVerification = createAsyncThunk(

    'resendVerification',

    async (email, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        }

        const response = await fetch(`${BASE_URL}/resend-verification`, requestOptions);

        if (!response.ok) {

            let error = await response.json();
            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

// Maildeki linkteki token ile e-postayı doğrular (reducer'ı yok)
export const verifyEmail = createAsyncThunk(

    'verifyEmail',

    async (token, { rejectWithValue }) => {

        const requestOptions = {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }

        const response = await fetch(`${BASE_URL}/verify-email/${token}`, requestOptions);

        if (!response.ok) {

            let error = await response.json();
            return rejectWithValue(error);
        }

        return (await response.json());
    }
);

// ───────────────────────── PROFİL ─────────────────────────

export const profile = createAsyncThunk(

    'profile',

    async (_, { rejectWithValue }) => {

        const token = localStorage.getItem("token");

        if (!token) {

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

// ───────────────────────── EV / ODA ─────────────────────────

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

// Normal giriş ve sosyal giriş aynı cevabı döner
const applyLoginResult = (state, action) => {

    state.loading = false;
    state.error = null;

    if (action.payload?.requires2FA) {

        state.isAuth = false;
        state.twoFactorChallenge = {
            challengeToken: action.payload.challengeToken,
            methods: action.payload.methods ?? ['totp', 'email', 'backup'],
            emailHint: action.payload.emailHint,
            expiresAt: Date.now() + (action.payload.expiresIn ?? 600) * 1000,
        };
        return;
    }

    state.isAuth = true;
    state.user = action.payload;
    state.twoFactorChallenge = null;
};

// ───────────────────────── SLICE ─────────────────────────

export const userSlice = createSlice({

    name: 'user',
    initialState,
    reducers: {

        logoutUser: (state) => {

            state.isAuth = false;
            state.loading = false;
            state.user = {};
            state.error = null;
            state.twoFactorChallenge = null;
            localStorage.removeItem("token");
        },
        setLoading: (state, action) => {

            state.loading = action.payload;
        },
        // Giriş/Kayıt sekmesi değişince eski hatayı temizler
        clearError: (state) => {

            state.error = null;
        },
        cancelTwoFactor: (state) => {

            state.twoFactorChallenge = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {

        // ── Şifre ──
        builder.addCase(forgotPassword.pending, (state) => {

            state.loading = true;
            state.error = null;
        });
        builder.addCase(resetPassword.pending, (state) => {

            state.loading = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state) => {

            state.loading = false;
            state.error = null;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {

            state.loading = false;
            state.error = null;
        });

        // ── Kayıt ──
        builder.addCase(register.pending, (state) => {

            state.loading = true;
            state.isAuth = false;
            state.error = null;
        });
        // Kayıt sonrası giriş yapılmıyor (backend user/token dönmüyor, e-posta doğrulaması bekleniyor)
        builder.addCase(register.fulfilled, (state) => {

            state.loading = false;
            state.error = null;
        });

        // ── Giriş ──
        builder.addCase(login.pending, (state) => {

            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, applyLoginResult);
        builder.addCase(socialExchange.fulfilled, applyLoginResult);
        builder.addCase(socialExchange.pending, (state) => {

            state.loading = true;
            state.error = null;
        });

        // ── 2FA giriş ──
        builder.addCase(verifyLogin2FA.fulfilled, (state, action) => {

            const { success, user, token } = action.payload;
            state.isAuth = true;
            state.loading = false;
            state.user = { success, user, token };
            state.twoFactorChallenge = null;
            state.error = null;
        });

        // Süre doldu / hak bitti: giriş formuna dön ve sebebi göster
        [verifyLogin2FA.rejected, sendLogin2FAEmail.rejected].forEach((thunk) => {

            builder.addCase(thunk, (state, action) => {

                if (['CHALLENGE_EXPIRED', 'TOO_MANY_ATTEMPTS', 'TOO_MANY_EMAILS'].includes(action.payload?.code)) {

                    state.twoFactorChallenge = null;
                    state.error = action.payload;
                }
            });
        });

        // ── 2FA aç/kapat: yeni token ve güncel kullanıcı ──
        [enable2FA.fulfilled, disable2FA.fulfilled].forEach((thunk) => {

            builder.addCase(thunk, (state, action) => {

                state.user = { ...state.user, user: action.payload.user, token: action.payload.token };
            });
        });

        // ── Profil ──
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

        // ── Ev / oda ──
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

        // ── Hatalar ──
        [register.rejected, login.rejected, profile.rejected, socialExchange.rejected].forEach(action => {

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

export const { logoutUser, clearError, setLoading, cancelTwoFactor } = userSlice.actions;
export default userSlice.reducer;
