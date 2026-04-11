import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./userSlice";
import devicesSlice from "./devicesSlice";


export const  store = configureStore({

    reducer:{

        user: userSlice,
        devices: devicesSlice,
    },
});