import { configureStore } from '@reduxjs/toolkit';

import cartSlice from "./cartSlice";
import favoriteSlice from "./favoriteSlice";

import userSlice from "./userSlice";
import adminUserSlice from "./admin/adminUserSlice";
import devicesSlice from "./devicesSlice";
import firmwareSlice from "./admin/firmwareSlice";
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
        firmware: firmwareSlice,
        automation: automationSlice,
        products: productSlice,
        ai: aiSlice,
    },
});
