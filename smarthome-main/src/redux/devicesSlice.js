import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";

// Cihaz uçları web'de /api önekiyle çalışıyor; firmware ucu mobildeki adresle aynı bırakıldı
const DEVICES_URL = `${BASE_URL}/devices`;
const FIRMWARE_URL = `${BASE_URL}/firmware`;

const authConfig = (extra = {}) => ({
  ...extra,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, ...(extra.headers || {}) },
});

const messageOf = (error, fallback) => error.response?.data?.message || fallback;

const sameIndex = (a, b) => Number(a) === Number(b);

const initialState = {
  devices: [],
  loading: false,
  error: null,
  pairingStatus: null,
  pairingCode: null,
  pairingLoading: false,
  pairingError: null,
  acknowledging: false,
  // serialNumber -> { loading, status, detail, error }
  // status: 'downloading' | 'success' | 'failed' | 'no_update'
  otaBySerial: {},
  // deviceType -> { loading, version, url, releaseNotes, publishedAt, error }
  latestFirmwareByType: {},
};

// ───────────────────────── EŞLEŞTİRME ─────────────────────────

export const startPairingAction = createAsyncThunk(

  'device/startPairing',

  async (pairingData, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${BASE_URL}/devices/generate-pairing-code`, pairingData, authConfig());
      return data;
    } catch (error) {

      return rejectWithValue(messageOf(error, "Eşleşme kodu alınamadı."));
    }
  }
);

export const completePairing = createAsyncThunk(

  'device/completePairing',

  async (pairingData, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${DEVICES_URL}/pair`, pairingData, authConfig());
      return data;
    } catch (error) {

      return rejectWithValue(messageOf(error, "Cihaz eşleştirilemedi."));
    }
  }
);

// ───────────────────────── CİHAZLAR ─────────────────────────

// getMyDevices({ silent: true }) arka planda yeniler, yükleniyor durumunu açmaz
export const getMyDevices = createAsyncThunk(

  'device/getMyDevices',

  async (_arg, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${DEVICES_URL}/my-devices`, authConfig());
      return data.devices ?? [];
    } catch (error) {

      return rejectWithValue(messageOf(error, "Cihazlar yüklenemedi."));
    }
  }
);

// Mobildeki gibi: { id, name, data, image }. Sadece gönderilen alanlar sunucuya gider.
export const updateDevice = createAsyncThunk(

  'devices/updateDevice',

  async ({ id, name, data, image }, { rejectWithValue }) => {

    try {

      const body = {};
      if (name !== undefined) body.name = name;
      if (data !== undefined) body.data = data;
      if (image !== undefined) body.image = image;

      const response = await axios.put(`${DEVICES_URL}/${id}`, body, authConfig());
      return response.data;
    } catch (error) {

      return rejectWithValue({ message: messageOf(error, "Cihaz güncellenemedi."), status: error.response?.status ?? null });
    }
  }
);

export const deleteDevice = createAsyncThunk(

  'device/deleteDevice',

  async (deviceId, { rejectWithValue }) => {

    try {

      await axios.delete(`${DEVICES_URL}/${deviceId}`, authConfig());
      return deviceId;
    } catch (error) {

      return rejectWithValue(messageOf(error, "Cihaz silinemedi."));
    }
  }
);

export const assignDeviceToRoom = createAsyncThunk(

  'device/assignToRoom',

  async ({ deviceId, homeId, roomId }, { rejectWithValue }) => {

    try {

      await axios.post(`${DEVICES_URL}/${deviceId}/assign`, { homeId, roomId }, authConfig());
      return { deviceId, homeId, roomId };
    } catch (error) {

      return rejectWithValue(messageOf(error, "Oda değiştirilemedi."));
    }
  }
);

// ───────────────────────── KOMUTLAR ─────────────────────────

export const toggleRelay = createAsyncThunk(

  'device/toggleRelay',

  async ({ serialNumber, action, channel }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${DEVICES_URL}/command`, { serialNumber, action, channel }, authConfig());
      return { ...data, serialNumber };
    } catch (error) {

      // code: aile erişim kuralı gibi sunucunun döndürdüğü sebep
      return rejectWithValue({ message: messageOf(error, "Komut gönderilemedi."), code: error.response?.data?.code ?? null, status: error.response?.status ?? null });
    }
  }
);

export const acknowledgeWaterAlarm = createAsyncThunk(

  'device/acknowledgeWaterAlarm',

  async (deviceId, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${DEVICES_URL}/${deviceId}/acknowledge-water`, {}, authConfig());
      return { deviceId, ...data };
    } catch (error) {

      return rejectWithValue(messageOf(error, "Alarm onaylanamadı."));
    }
  }
);

// ───────────────────────── YAZILIM (OTA) ─────────────────────────

export const getLatestFirmware = createAsyncThunk(

  'device/getLatestFirmware',

  async ({ type }, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${FIRMWARE_URL}/latest`, authConfig({ params: { type } }));
      return { type, ...data };
    } catch (error) {

      // 404: bu tip için henüz yazılım yayınlanmamış
      return rejectWithValue({ type, status: error.response?.status, message: messageOf(error, "Yazılım bilgisi alınamadı.") });
    }
  }
);

// Sunucu komutu cihaza iletip hemen döner; asıl sonuç cihaz yeniden bağlanınca belli olur
export const sendOtaUpdate = createAsyncThunk(

  'device/sendOtaUpdate',

  async ({ serialNumber, firmwareUrl }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${DEVICES_URL}/ota`, { serialNumber, firmwareUrl }, authConfig());
      return { ...data, serialNumber };
    } catch (error) {

      return rejectWithValue({ serialNumber, message: messageOf(error, "Güncelleme başlatılamadı.") });
    }
  }
);

// ───────────────────────── SLICE ─────────────────────────

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

    updateDeviceData: (state, action) => {

      const { serialNumber, data } = action.payload;
      const device = state.devices.find(d => d.serialNumber === serialNumber);
      if (device) device.data = { ...device.data, ...data };
    },

    // Canlı güncelleme: { serialNumber | deviceId, data, firmwareVersion? }
    applyDeviceUpdate: (state, action) => {

      const { serialNumber, deviceId, data, firmwareVersion } = action.payload || {};
      const device = state.devices.find((d) => (serialNumber && d.serialNumber === serialNumber) || (deviceId && d._id === deviceId));

      if (!device) return;

      if (data) {

        const current = device.data || {};
        const next = { ...current, ...data };

        // Kanallar index'e göre birleşir; gelen veride olmayan etiket / buton tipi korunur
        if (Array.isArray(data.relayChannels) && Array.isArray(current.relayChannels)) {

          const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined));

          next.relayChannels = current.relayChannels.map((ch) => {
            const incoming = data.relayChannels.find((c) => sameIndex(c.index, ch.index));
            return incoming ? { ...ch, ...clean(incoming) } : ch;
          });

          data.relayChannels.forEach((c) => {
            if (!next.relayChannels.some((x) => sameIndex(x.index, c.index))) next.relayChannels.push(c);
          });
        }

        device.data = next;
      }

      if (firmwareVersion) device.firmwareVersion = firmwareVersion;
    },

    // { serialNumber, status, detail, firmwareVersion }
    updateOtaStatus: (state, action) => {

      const { serialNumber, status, detail, firmwareVersion } = action.payload;

      state.otaBySerial[serialNumber] = {
        loading: status === 'downloading',
        status,
        detail: detail ?? null,
        error: status === 'failed' ? detail : null,
      };

      if (status === 'success' && firmwareVersion) {
        const device = state.devices.find(d => d.serialNumber === serialNumber);
        if (device) device.firmwareVersion = firmwareVersion;
      }
    },

    clearOtaStatus: (state, action) => {
      delete state.otaBySerial[action.payload];
    },
  },

  extraReducers: (builder) => {

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

    builder.addCase(completePairing.pending, (state) => {
      state.pairingLoading = true;
      state.pairingError = null;
    });
    builder.addCase(completePairing.fulfilled, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = null;
      state.pairingCode = null;
      if (action.payload?.device) state.devices.push(action.payload.device);
    });
    builder.addCase(completePairing.rejected, (state, action) => {
      state.pairingLoading = false;
      state.pairingError = action.payload;
    });

    builder.addCase(getMyDevices.pending, (state, action) => {
      if (!action.meta.arg?.silent) state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyDevices.fulfilled, (state, action) => {
      state.loading = false;
      state.devices = action.payload;
    });
    builder.addCase(getMyDevices.rejected, (state, action) => {
      state.loading = false;
      // Arka plan yenilemesi düşerse eldeki liste ekranda kalır
      if (!action.meta.arg?.silent) state.error = action.payload;
    });

    builder.addCase(updateDevice.fulfilled, (state, action) => {
      const updated = action.payload?.device ?? action.payload;
      if (!updated?._id) return;
      const index = state.devices.findIndex(d => d._id === updated._id);
      if (index !== -1) state.devices[index] = { ...state.devices[index], ...updated };
    });

    builder.addCase(deleteDevice.fulfilled, (state, action) => {
      state.devices = state.devices.filter(device => device._id !== action.payload);
    });

    builder.addCase(assignDeviceToRoom.fulfilled, (state, action) => {
      const { deviceId, homeId, roomId } = action.payload;
      const device = state.devices.find(d => d._id === deviceId);
      if (device) {
        device.homeId = homeId;
        device.roomId = roomId;
      }
    });

    builder.addCase(toggleRelay.fulfilled, (state, action) => {

      // Gönderilen komut esas alınır; sunucu cevabında action / channel olmayabilir
      const { serialNumber, action: relayAction, channel } = action.meta.arg;
      const device = state.devices.find(d => d.serialNumber === serialNumber);
      if (!device) return;

      if (!device.data) device.data = {};
      const channelIndex = channel ?? 0;

      if (device.data.relayChannels?.length) {
        const ch = device.data.relayChannels.find(c => sameIndex(c.index, channelIndex));
        if (ch) ch.state = relayAction;
        else device.data.relayChannels.push({ index: channelIndex, label: null, state: relayAction });
      } else {
        // Tek kanallı eski cihazlar
        device.data.relayState = relayAction;
      }
    });

    builder.addCase(acknowledgeWaterAlarm.pending, (state) => {
      state.acknowledging = true;
    });
    builder.addCase(acknowledgeWaterAlarm.fulfilled, (state, action) => {
      state.acknowledging = false;
      const device = state.devices.find(d => d._id === action.payload.deviceId);
      if (device) device.data = { ...device.data, water: false, waterSource: null, lastClearedAt: new Date().toISOString() };
    });
    builder.addCase(acknowledgeWaterAlarm.rejected, (state) => {
      state.acknowledging = false;
    });

    builder.addCase(getLatestFirmware.pending, (state, action) => {
      const { type } = action.meta.arg;
      state.latestFirmwareByType[type] = { ...state.latestFirmwareByType[type], loading: true, error: null };
    });
    builder.addCase(getLatestFirmware.fulfilled, (state, action) => {
      const { type, version, url, releaseNotes, publishedAt } = action.payload;
      state.latestFirmwareByType[type] = { loading: false, version, url, releaseNotes: releaseNotes ?? null, publishedAt: publishedAt ?? null, error: null };
    });
    builder.addCase(getLatestFirmware.rejected, (state, action) => {
      const type = action.payload?.type || action.meta.arg?.type;
      if (!type) return;
      state.latestFirmwareByType[type] = {
        ...state.latestFirmwareByType[type],
        loading: false,
        // 404 hata değil: bu tip için yayınlanmış yazılım yok
        notFound: action.payload?.status === 404,
        error: action.payload?.status === 404 ? null : action.payload?.message,
      };
    });

    builder.addCase(sendOtaUpdate.pending, (state, action) => {
      const { serialNumber } = action.meta.arg;
      state.otaBySerial[serialNumber] = { loading: true, status: 'downloading', detail: null, error: null };
    });
    builder.addCase(sendOtaUpdate.fulfilled, (state, action) => {
      const { serialNumber } = action.payload;
      state.otaBySerial[serialNumber] = { ...state.otaBySerial[serialNumber], loading: true, status: 'downloading', error: null };
    });
    builder.addCase(sendOtaUpdate.rejected, (state, action) => {
      const serialNumber = action.payload?.serialNumber || action.meta.arg?.serialNumber;
      if (!serialNumber) return;
      state.otaBySerial[serialNumber] = { loading: false, status: 'failed', detail: null, error: action.payload?.message || "Güncelleme başlatılamadı." };
    });
  },
});

export const { clearDeviceError, resetPairingStatus, updateDeviceData, applyDeviceUpdate, updateOtaStatus, clearOtaStatus } = deviceSlice.actions;
export default deviceSlice.reducer;
