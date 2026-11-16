import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { BASE_URL, toOrderItems, authHeaders } from '../utils/checkout';

const STORAGE_KEY = 'cart';
const COUPON_KEY = 'cartCoupon';

// Bu hatalarda kod sepetten kalkar; diğerlerinde (ör. minimum tutar) sepet değişince yeniden denenir
const PERMANENT_COUPON_ERRORS = ['NOT_FOUND', 'INACTIVE', 'EXPIRED', 'EXHAUSTED', 'USER_LIMIT', 'NOT_ELIGIBLE', 'SEGMENT', 'EMAIL_DOMAIN', 'FIRST_ORDER_ONLY', 'NEW_USER_ONLY', 'PLATFORM'];

// ───────────────────────── YARDIMCILAR ─────────────────────────

// Aynı ürünün farklı model/renkleri ayrı satırdır
const buildCartKey = (item) => [item.id ?? item._id, item.selectedModel ?? '', item.selectedColor ?? ''].join('::');

const maxQuantityFor = (item) => (Number.isFinite(Number(item.stock)) && Number(item.stock) > 0 ? Number(item.stock) : Infinity);

// Bozuk kayıt uygulamayı çökertmesin; eski sepetler yeni anahtar yapısına çevrilsin
const fetchFromLocalStorage = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(parsed)) return [];

        const merged = new Map();

        parsed.forEach((raw) => {
            if (!raw || (raw.id == null && raw._id == null)) return;

            const item = { ...raw, id: raw.id ?? raw._id, quantity: Math.max(1, Number(raw.quantity) || 1) };
            item.cartKey = raw.cartKey ?? buildCartKey(item);

            const existing = merged.get(item.cartKey);
            if (existing) existing.quantity += item.quantity;
            else merged.set(item.cartKey, item);
        });

        return [...merged.values()];
    } catch {
        return [];
    }
};

const storeInLocalStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
};

const readCoupon = () => {
    try {
        return localStorage.getItem(COUPON_KEY) || null;
    } catch {
        return null;
    }
};

const storeCoupon = (code) => {
    try {
        if (code) localStorage.setItem(COUPON_KEY, code);
        else localStorage.removeItem(COUPON_KEY);
    } catch {}
};

// Stokta olmayan / kaldırılan ürünler toplama katılmaz
const calculateTotal = (carts) => carts.reduce((sum, item) => (item.unavailable ? sum : sum + item.price * item.quantity), 0);

// Sepet değişince sunucu hesabı eskir; ekran yeni hesap gelene kadar yerel toplamı gösterir
const syncTotals = (state) => {
    state.totalAmount = calculateTotal(state.carts);
    state.quoteStale = true;
    storeInLocalStorage(state.carts);
};

const hasToken = () => {
    try {
        return !!localStorage.getItem('token');
    } catch {
        return false;
    }
};

const toError = (error, fallback) => ({
    message: error.response?.data?.message || fallback,
    code: error.response?.data?.code || null,
    status: error.response?.status || null,
});

// ───────────────────────── THUNK'LAR ─────────────────────────

// Sepetteki ürünlerin güncel fiyat ve stoğunu backend'den alır (giriş gerekmez)
export const validateCart = createAsyncThunk(
    'cart/validateCart',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { carts } = getState().cart;
            if (carts.length === 0) return { items: [] };

            const items = carts.map((item) => ({
                key: item.cartKey,
                productId: item.id ?? item._id,
                model: item.selectedModel ?? null,
                color: item.selectedColor ?? null,
            }));

            const { data } = await axios.post(`${BASE_URL}/cart/validate`, { items });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Sepet güncellenemedi');
        }
    }
);

/**
 * Sunucu hesabı: kupon, otomatik indirim, kargo ve KDV. Sadece giriş yapmış kullanıcı için.
 * paymentMethod ve city ödeme sayfasında gönderilir (ödeme yöntemine/şehre özel kuponlar için).
 */
export const fetchQuote = createAsyncThunk(
    'cart/fetchQuote',
    async ({ paymentMethod, city } = {}, { getState, rejectWithValue }) => {
        try {
            const { carts, couponCode } = getState().cart;
            const items = toOrderItems(carts);
            if (!items.length) return null;

            const { data } = await axios.post(
                `${BASE_URL}/coupons/quote`,
                { items, code: couponCode || undefined, paymentMethod, city, platform: 'web' },
                { headers: authHeaders() }
            );
            return data;
        } catch (error) {
            return rejectWithValue(toError(error, 'Sepet tutarı hesaplanamadı.'));
        }
    },
    { condition: () => hasToken() }
);

// "Uygula" butonu: kod geçerliyse kaydedilir ve yeni toplam döner
export const applyCoupon = createAsyncThunk(
    'cart/applyCoupon',
    async ({ code, paymentMethod, city }, { getState, rejectWithValue }) => {
        try {
            const items = toOrderItems(getState().cart.carts);
            const { data } = await axios.post(
                `${BASE_URL}/coupons/validate`,
                { code, items, paymentMethod, city, platform: 'web' },
                { headers: authHeaders() }
            );
            return { code: data.applied?.find((a) => !a.auto)?.coupon?.code || code.trim().toUpperCase(), quote: data };
        } catch (error) {
            return rejectWithValue(toError(error, 'Kupon uygulanamadı.'));
        }
    }
);

// Kullanıcının görebileceği kuponlar; sepete göre uygulanabilirlik ve indirim tutarıyla
export const fetchAvailableCoupons = createAsyncThunk(
    'cart/fetchAvailableCoupons',
    async (_, { getState, rejectWithValue }) => {
        try {
            const items = toOrderItems(getState().cart.carts);
            const { data } = await axios.post(`${BASE_URL}/coupons/available`, { items, platform: 'web' }, { headers: authHeaders() });
            return data.coupons ?? [];
        } catch (error) {
            return rejectWithValue(toError(error, 'Kuponlar alınamadı.'));
        }
    },
    { condition: () => hasToken() }
);

// ───────────────────────── SLICE ─────────────────────────

const initialCarts = fetchFromLocalStorage();

const initialState = {
    carts: initialCarts,
    totalAmount: calculateTotal(initialCarts),
    validating: false,
    validationError: null,
    lastValidatedAt: null,

    couponCode: readCoupon(),
    couponApplying: false,
    couponMessage: null, // son "Uygula" denemesinin hata mesajı

    quote: null,         // sunucu hesabı: { totals, applied, couponError, hints, issues, gifts, perks }
    quoting: false,
    quoteStale: true,
    quoteError: null,
    quoteRequestId: null,

    availableCoupons: [],
    availableLoading: false,
};

const acceptQuote = (state, quote) => {
    state.quote = quote;
    state.quoteStale = false;
    state.quoteError = null;

    const err = quote?.couponError;
    if (err && state.couponCode && PERMANENT_COUPON_ERRORS.includes(err.code)) {
        state.couponCode = null;
        storeCoupon(null);
    }
};

export const cartSlice = createSlice({

    name: 'cart',
    initialState,
    reducers: {

        addToCart: (state, action) => {

            const payload = { ...action.payload, id: action.payload.id ?? action.payload._id };
            const key = buildCartKey(payload);
            const addQuantity = Math.max(1, Number(payload.quantity) || 1);
            const existing = state.carts.find((item) => item.cartKey === key);

            if (existing) {
                existing.quantity = Math.min(existing.quantity + addQuantity, maxQuantityFor({ ...existing, stock: payload.stock ?? existing.stock }));
                existing.price = payload.price ?? existing.price;
                existing.stock = payload.stock ?? existing.stock;
                existing.unavailable = null;
            } else {
                const item = { ...payload, cartKey: key, quantity: addQuantity };
                item.quantity = Math.min(item.quantity, maxQuantityFor(item));
                state.carts.push(item);
            }

            syncTotals(state);
        },

        // payload: cartKey (eski kullanım için ürün id'si de kabul edilir)
        removeFromCart: (state, action) => {

            const target = action.payload;
            state.carts = state.carts.filter((item) => item.cartKey !== target && !(item.id === target && !String(target).includes('::')));
            syncTotals(state);
        },

        // payload: { key, quantity } (eski kullanım için { id, quantity } de kabul edilir)
        updateQuantity: (state, action) => {

            const { key, id, quantity } = action.payload;
            const item = state.carts.find((i) => (key ? i.cartKey === key : i.id === id));

            if (item && quantity > 0) {
                item.quantity = Math.min(quantity, maxQuantityFor(item));
            }

            syncTotals(state);
        },

        clearCart: (state) => {

            state.carts = [];
            state.couponCode = null;
            state.couponMessage = null;
            state.quote = null;
            state.availableCoupons = [];
            storeCoupon(null);
            syncTotals(state);
        },

        removeCoupon: (state) => {

            state.couponCode = null;
            state.couponMessage = null;
            state.quoteStale = true;
            storeCoupon(null);
        },

        clearCouponMessage: (state) => {

            state.couponMessage = null;
        },

        // Çıkış yapınca kullanıcıya özel hesaplar temizlenir
        resetQuote: (state) => {

            state.quote = null;
            state.quoteStale = true;
            state.availableCoupons = [];
        },

        // Fiyat değişikliği uyarılarını kapat
        acknowledgeCartChanges: (state) => {

            state.carts.forEach((item) => {
                item.priceChanged = null;
                item.quantityAdjusted = false;
            });
            storeInLocalStorage(state.carts);
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(validateCart.pending, (state) => {
                state.validating = true;
                state.validationError = null;
            })
            .addCase(validateCart.fulfilled, (state, action) => {

                state.validating = false;
                state.lastValidatedAt = Date.now();

                const results = new Map((action.payload.items ?? []).map((r) => [r.key, r]));

                state.carts.forEach((item) => {

                    const result = results.get(item.cartKey);
                    if (!result) return;

                    if (!result.available) {
                        item.unavailable = result.reason || 'unavailable';
                        return;
                    }

                    item.unavailable = null;

                    if (Number(result.price) !== Number(item.price)) {
                        item.priceChanged = { from: item.price, to: result.price };
                        item.price = result.price;
                    }

                    item.oldPrice = result.oldPrice ?? null;
                    item.stock = result.stock;
                    item.name = result.name ?? item.name;
                    item.slug = result.slug ?? item.slug;
                    item.category = result.category ?? item.category;
                    item.image = result.image ?? item.image;

                    if (item.quantity > result.stock) {
                        item.quantity = result.stock;
                        item.quantityAdjusted = true;
                    }
                });

                syncTotals(state);
            })
            .addCase(validateCart.rejected, (state, action) => {
                state.validating = false;
                state.validationError = action.payload;
            })

            .addCase(fetchQuote.pending, (state, action) => {
                state.quoting = true;
                state.quoteRequestId = action.meta.requestId;
            })
            .addCase(fetchQuote.fulfilled, (state, action) => {
                // Arka arkaya gelen isteklerde sadece sonuncusu geçerli
                if (action.meta.requestId !== state.quoteRequestId) return;
                state.quoting = false;
                if (action.payload) acceptQuote(state, action.payload);
                else state.quote = null;
            })
            .addCase(fetchQuote.rejected, (state, action) => {
                if (action.meta.requestId !== state.quoteRequestId) return;
                state.quoting = false;
                state.quoteError = action.payload?.message || null;
            })

            .addCase(applyCoupon.pending, (state) => {
                state.couponApplying = true;
                state.couponMessage = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.couponApplying = false;
                state.couponCode = action.payload.code;
                storeCoupon(action.payload.code);
                acceptQuote(state, action.payload.quote);
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.couponApplying = false;
                state.couponMessage = action.payload?.message || 'Kupon uygulanamadı.';
            })

            .addCase(fetchAvailableCoupons.pending, (state) => {
                state.availableLoading = true;
            })
            .addCase(fetchAvailableCoupons.fulfilled, (state, action) => {
                state.availableLoading = false;
                state.availableCoupons = action.payload;
            })
            .addCase(fetchAvailableCoupons.rejected, (state) => {
                state.availableLoading = false;
            });
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, acknowledgeCartChanges, removeCoupon, clearCouponMessage, resetQuote } = cartSlice.actions;
export default cartSlice.reducer;
