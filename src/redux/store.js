import { configureStore } from '@reduxjs/toolkit';

import cartSlice from "./cartSlice";
import favoriteSlice from "./favoriteSlice";

import userSlice from "./userSlice";
import adminUserSlice from "./admin/adminUserSlice";
import devicesSlice from "./devicesSlice";
import automationSlice from "./automationSlice";
import productSlice from "./productSlice";
import aiSlice from "./aiSlice";


export const  store = configureStore({

    reducer:{

        cart: cartSlice,
        favorites: favoriteSlice,

        user: userSlice,
        adminUser: adminUserSlice,
        devices: devicesSlice,
        automation: automationSlice,
        products: productSlice,
        ai: aiSlice,
    },
});