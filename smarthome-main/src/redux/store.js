import { configureStore } from '@reduxjs/toolkit';

import cartSlice from "./cartSlice";
import favoriteSlice from "./favoriteSlice";

import userSlice from "./userSlice";
import notificationSlice from "./notificationSlice";
import adminUserSlice from "./admin/adminUserSlice";
import serverMetricsSlice from "./admin/adminCloudeSettings";

import devicesSlice from "./devicesSlice";
import firmwareSlice from "./admin/firmwareSlice";
import automationSlice from "./automationSlice";
import productSlice from "./productSlice";
import orderSlice from "./orderSlice";
import aiSlice from "./aiSlice";


export const  store = configureStore({

    reducer:{

        cart: cartSlice,
        favorites: favoriteSlice,

        user: userSlice,
        adminUser: adminUserSlice,
        notifications: notificationSlice,
        serverMetrics: serverMetricsSlice,
        devices: devicesSlice,
        firmware: firmwareSlice,
        automation: automationSlice,
        products: productSlice,
        orders: orderSlice,
        ai: aiSlice,
    },
});
