import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";
const STORAGE_KEY = 'cart';

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

// Stokta olmayan / kaldırılan ürünler toplama katılmaz
const calculateTotal = (carts) => carts.reduce((sum, item) => (item.unavailable ? sum : sum + item.price * item.quantity), 0);

const syncTotals = (state) => {
    state.totalAmount = calculateTotal(state.carts);
    storeInLocalStorage(state.carts);
};

// ───────────────────────── THUNK ─────────────────────────

// Sepetteki ürünlerin güncel fiyat ve stoğunu backend'den alır
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

// ───────────────────────── SLICE ─────────────────────────

const initialCarts = fetchFromLocalStorage();

const initialState = {
    carts: initialCarts,
    totalAmount: calculateTotal(initialCarts),
    validating: false,
    validationError: null,
    lastValidatedAt: null,
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
            syncTotals(state);
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
            });
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, acknowledgeCartChanges } = cartSlice.actions;
export default cartSlice.reducer;
