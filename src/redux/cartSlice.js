import { createSlice } from '@reduxjs/toolkit'

const fetchFromLocalStorage = () => {

    let cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

const storeInLocalStorage = (data) => {

    localStorage.setItem('cart', JSON.stringify(data));
};

const calculateTotal = (carts) => {

    return carts.reduce((prev, item) => prev + (item.price * item.quantity), 0);
};

const initialState = {

    carts: fetchFromLocalStorage(),
    totalAmount: calculateTotal(fetchFromLocalStorage())
};

export const cartSlice = createSlice({

    name: 'cart',
    initialState,
    reducers: {

        addToCart: (state, action) => {

            const isItemCart = state.carts.find(cart => cart.id === action.payload.id);

            if (isItemCart) {

                state.carts = state.carts.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item );
            } else {

                state.carts.push(action.payload);
            }
            state.totalAmount = calculateTotal(state.carts);
            storeInLocalStorage(state.carts);
        },
        removeFromCart: (state, action) => {

            state.carts = state.carts.filter(item => item.id !== action.payload);
            state.totalAmount = calculateTotal(state.carts);
            storeInLocalStorage(state.carts);
        },
        updateQuantity: (state, action) => {

            const { id, quantity } = action.payload;
            const item = state.carts.find(i => i.id === id);
            if (item && quantity > 0) {

                item.quantity = quantity;
            }
            state.totalAmount = calculateTotal(state.carts);
            storeInLocalStorage(state.carts);
        },
        clearCart: (state) => {

            state.carts = [];
            state.totalAmount = 0;
            storeInLocalStorage(state.carts);
        },
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;