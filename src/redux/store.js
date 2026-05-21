import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./userSlice";
import devicesSlice from "./devicesSlice";
import automationSlice from "./automationSlice";
import productSlice from "./productSlice";


export const  store = configureStore({

    reducer:{

        user: userSlice,
        devices: devicesSlice,
        automation: automationSlice,
        products: productSlice,
    },
});