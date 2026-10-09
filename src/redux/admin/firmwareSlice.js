import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";

const initialState = {
  latestByType: {},        // { relay: { version, url, releaseNotes, publishedAt }, ... }
  latestLoading: false,
  latestError: null,
  publishedFirmware: null, // Son yayınlanan kayıt
  publishLoading: false,
  publishError: null,
  publishSuccess: false,
};

// GET /firmware/latest?type=relay
export const getLatestFirmware = createAsyncThunk(

  'firmware/getLatest',

  async (type, { rejectWithValue }) => {

    try {

      const token = localStorage.getItem('token');

      const { data } = await axios.get(

        `${BASE_URL}/firmware/latest`,
        {
          params: { type },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data;
    } catch (error) {

      return rejectWithValue(error.response?.data?.message || "Firmware bilgisi alınamadı.");
    }
  }
);

// POST /firmware (admin)
export const publishFirmware = createAsyncThunk(

  'firmware/publish',

  async ({ deviceType, version, url, releaseNotes }, { rejectWithValue }) => {

    try {

      const token = localStorage.getItem('token');

      const { data } = await axios.post(

        `${BASE_URL}/api/firmware`,
        { deviceType, version, url, releaseNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data;
    } catch (error) {

      return rejectWithValue(error.response?.data?.message || "Firmware yayınlanamadı.");
    }
  }
);

export const firmwareSlice = createSlice({

  name: 'firmware',
  initialState,
  reducers: {
    clearFirmwareError: (state) => {
      state.latestError = null;
      state.publishError = null;
    },
    resetPublishStatus: (state) => {
      state.publishedFirmware = null;
      state.publishLoading = false;
      state.publishError = null;
      state.publishSuccess = false;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(getLatestFirmware.pending, (state) => {
      state.latestLoading = true;
      state.latestError = null;
    });
    builder.addCase(getLatestFirmware.fulfilled, (state, action) => {
      state.latestLoading = false;
      const { deviceType, version, url, releaseNotes, publishedAt } = action.payload;
      state.latestByType[deviceType] = { version, url, releaseNotes, publishedAt };
    });
    builder.addCase(getLatestFirmware.rejected, (state, action) => {
      state.latestLoading = false;
      state.latestError = action.payload;
    });

    builder.addCase(publishFirmware.pending, (state) => {
      state.publishLoading = true;
      state.publishError = null;
      state.publishSuccess = false;
    });
    builder.addCase(publishFirmware.fulfilled, (state, action) => {
      state.publishLoading = false;
      state.publishSuccess = true;
      const firmware = action.payload.firmware;
      state.publishedFirmware = firmware;
      if (firmware) {
        state.latestByType[firmware.deviceType] = {
          version: firmware.version,
          url: firmware.url,
          releaseNotes: firmware.releaseNotes,
          publishedAt: firmware.createdAt,
        };
      }
    });
    builder.addCase(publishFirmware.rejected, (state, action) => {
      state.publishLoading = false;
      state.publishError = action.payload;
      state.publishSuccess = false;
    });
  },
});

export const { clearFirmwareError, resetPublishStatus } = firmwareSlice.actions;
export default firmwareSlice.reducer;
