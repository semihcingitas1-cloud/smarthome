import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://104.196.18.94:4000";

const initialState = {
  devices: [],
  loading: false,
  error: null,
  pairingStatus: null,
  pairingCode: null,
  pairingLoading: false,
  pairingError: null,
};

export const startPairingAction = createAsyncThunk(
  'device/startPairing',
  async (pairingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/generate-pairing-code`,
        pairingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data; // { success: true, code: "12345678" }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Eşleşme kodu alınamadı.");
    }
  }
);

export const completePairing = createAsyncThunk(
  'device/completePairing',
  async (pairingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/complete-pairing`,
        pairingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data; // { success: true, device: {...} }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihaz eşleştirilemedi.");
    }
  }
);

export const getMyDevices = createAsyncThunk(
  'device/getMyDevices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${BASE_URL}/api/devices/my-devices`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data.devices;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihazlar yüklenemedi.");
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/devices/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteDevice = createAsyncThunk(
  'device/deleteDevice',
  async (deviceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${BASE_URL}/api/devices/${deviceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return deviceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cihaz silinemedi.");
    }
  }
);

export const assignDeviceToRoom = createAsyncThunk(
  'device/assignToRoom',
  async ({ deviceId, homeId, roomId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/devices/${deviceId}/assign`,
        { homeId, roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { deviceId, homeId, roomId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const toggleRelay = createAsyncThunk(
  'device/toggleRelay',
  async ({ serialNumber, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}/api/devices/command`,
        { serialNumber, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Backend { success: true, action, serialNumber } döndürüyor
      // Eğer backend serialNumber döndürmüyorsa buradan ekliyoruz
      return { ...data, serialNumber };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Komut gönderilemedi.");
    }
  }
);

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
    resetPairingStatus: (state) => {
      state.pairingStatus = null;
      state.pairingCode = null;
      state.pairingLoading = false;
      state.pairingError = null;
    },
    // MQTT'den gelen gerçek zamanlı güncelleme için
    updateDeviceData: (state, action) => {
      const { serialNumber, data } = action.payload;
      const device = state.devices.find(d => d.serialNumber === serialNumber);
      if (device) {
        device.data = { ...device.data, ...data };
      }
    },
  },
  extraReducers: (builder) => {

    // startPairingAction
    builder.addCase(startPairingAction.pending, (state) => {
      state.pairingLoading = true;
      state.pairingCode = null;
      state.pairingError = null;
    });
    builder.addCase(startPairingAction.fulfilled, (state, action) => {
      state.pairingLoading = false;
      state.pairingCode = action.payload.code;
    });
    builder.addCase(startPairingAction.rejected, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = action.payload;
    });

    // completePairing
    builder.addCase(completePairing.pending, (state) => {
      state.pairingLoading = true;
      state.pairingError = null;
    });
    builder.addCase(completePairing.fulfilled, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = null;
      state.pairingCode = null;
      if (action.payload?.device) {
        state.devices.push(action.payload.device);
      }
    });
    builder.addCase(completePairing.rejected, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = action.payload;
    });

    // getMyDevices
    builder.addCase(getMyDevices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyDevices.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(getMyDevices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // updateDevice
    builder.addCase(updateDevice.fulfilled, (state, action) => {
      const index = state.devices.findIndex(d => d._id === action.payload._id);
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
    });

    // deleteDevice
    builder.addCase(deleteDevice.fulfilled, (state, action) => {
      state.devices = state.devices.filter(device => device._id !== action.payload);
    });

    // assignDeviceToRoom
    builder.addCase(assignDeviceToRoom.fulfilled, (state, action) => {
      const { deviceId, homeId, roomId } = action.payload;
      const device = state.devices.find(d => d._id === deviceId);
      if (device) {
        device.homeId = homeId;
        device.roomId = roomId;
      }
    });
    builder.addCase(toggleRelay.fulfilled, (state, action) => {
      const { serialNumber, action: relayAction } = action.payload;
      console.log("toggleRelay fulfilled:", serialNumber, relayAction);
      const device = state.devices.find(d => d.serialNumber === serialNumber);
      if (device) {
        if (!device.data) device.data = {};
        device.data.relayState = relayAction;
      }
    });
    builder.addCase(toggleRelay.rejected, (state, action) => {
      console.error("toggleRelay rejected:", action.payload);
    });
  },
});

export const { clearDeviceError, resetPairingStatus, updateDeviceData } = deviceSlice.actions;
export default deviceSlice.reducer;
