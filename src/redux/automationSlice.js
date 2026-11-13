import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://ornekciceksitesi.com";
// Web istekleri /api önekiyle gidiyor (mobil öneksiz). Web'de liste şu an yükleniyorsa böyle kalsın.
const API_URL = `${BASE_URL}`;
const RUNS_PAGE_SIZE = 20;

const initialState = {
  automations: [],
  loading: false,
  error: null,
  actionLoading: false, // eski sayfalar için: oluşturma / güncelleme / tetikleme sürerken true
  createLoading: false,
  createError: null,
  updateLoading: false,
  triggerLoadingId: null,
  runs: {}, // automationId → { items, loading, error, hasMore, stale }
  health: {},
};

// ───────────────────────── YARDIMCILAR ─────────────────────────

const authConfig = (extra = {}) => ({
  ...extra,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// Sunucu alan bazında doğrulama hatası döndürdüyse ilkini mesaja ekler
const extractError = (error, fallback) => {
  const data = error.response?.data;
  const message = data?.message || fallback;
  const first = data?.errors && Object.entries(data.errors)[0];
  return first ? `${message} (${first[0]}: ${first[1]})` : message;
};

const upsertAutomation = (state, automation) => {
  if (!automation?._id) return;
  const index = state.automations.findIndex(a => a._id === automation._id);
  if (index === -1) state.automations.unshift(automation);
  else state.automations[index] = automation;
};

const runsEntry = (state, id) => {
  if (!state.runs[id]) {
    state.runs[id] = { items: [], loading: false, error: null, hasMore: false, stale: false };
  }
  return state.runs[id];
};

// ───────────────────────── THUNK'LAR ─────────────────────────

export const getMyAutomations = createAsyncThunk(

  'automation/getMyAutomations',

  async (_, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${API_URL}/automation/my-automations`, authConfig());
      return data.automations;
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyonlar yüklenemedi."));
    }
  }
);

// Tek otomasyonu tazeler (düzenleme sayfası ve manuel çalıştırma sonrası)
export const getAutomation = createAsyncThunk(

  'automation/getAutomation',

  async (id, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${API_URL}/automation/${id}`, authConfig());
      return data.automation;
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyon yüklenemedi."));
    }
  }
);

export const createAutomation = createAsyncThunk(

  'automation/createAutomation',

  // automationData: { name, triggers, conditions, actions, runMode, cooldownSeconds, ... }
  async (automationData, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/create`, automationData, authConfig());
      return data.automation;
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyon oluşturulamadı."));
    }
  }
);

export const updateAutomation = createAsyncThunk(

  'automation/updateAutomation',

  // { id, data } — eski sayfalar { id, automationData } gönderiyor, ikisi de çalışır
  async ({ id, data, automationData }, { rejectWithValue }) => {

    try {

      const response = await axios.patch(`${API_URL}/automation/${id}`, data ?? automationData, authConfig());
      return response.data.automation;
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyon güncellenemedi."));
    }
  }
);

export const deleteAutomation = createAsyncThunk(

  'automation/deleteAutomation',

  async (automationId, { rejectWithValue }) => {

    try {

      await axios.delete(`${API_URL}/automation/${automationId}`, authConfig());
      return automationId;
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyon silinemedi."));
    }
  }
);

export const triggerAutomation = createAsyncThunk(

  'automation/triggerAutomation',

  // Sunucu: 200 (bitti), 202 (arka planda sürüyor / sıraya alındı), 409 (zaten çalışıyor)
  async (automationId, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/trigger/${automationId}`, {}, authConfig());
      return { automationId, ...data, result: data }; // result: eski sayfalar için
    } catch (error) {

      return rejectWithValue(extractError(error, "Otomasyon çalıştırılamadı."));
    }
  }
);

// Mobildeki adla da kullanılabilsin
export const triggerAutomationManually = triggerAutomation;

// Sayfalı çalışma geçmişi: before verilirse o andan eskileri getirir
export const getAutomationRuns = createAsyncThunk(

  'automation/getRuns',

  async ({ id, before, limit = RUNS_PAGE_SIZE }, { rejectWithValue }) => {

    try {

      const params = { limit };
      if (before) params.before = before;

      const { data } = await axios.get(`${API_URL}/automation/${id}/runs`, authConfig({ params }));
      return { id, runs: data.runs ?? [], append: !!before, limit };
    } catch (error) {

      return rejectWithValue(extractError(error, "Çalışma geçmişi yüklenemedi."));
    }
  }
);

// Prova: taslağı geçmiş verilere karşı çalıştırır (store'a yazılmaz)
export const simulateAutomation = createAsyncThunk(

  'automation/simulate',

  async ({ automation, days = 7 }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/simulate`, { automation, days }, authConfig());
      return data.result;
    } catch (error) {

      return rejectWithValue(extractError(error, "Prova yapılamadı."));
    }
  }
);

// Şimdi test et: aksiyonları çalıştırmadan koşulları ve yetkileri kontrol eder
export const testAutomation = createAsyncThunk(

  'automation/test',

  async ({ automation, triggerIndex = 0, override }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/test`, { automation, triggerIndex, override }, authConfig());
      return data.result;
    } catch (error) {

      return rejectWithValue(extractError(error, "Test yapılamadı."));
    }
  }
);

export const getAutomationVersions = createAsyncThunk(

  'automation/getVersions',

  async ({ id, limit = 30 }, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${API_URL}/automation/${id}/versions`, authConfig({ params: { limit } }));
      return data.versions ?? [];
    } catch (error) {

      return rejectWithValue(extractError(error, "Sürüm geçmişi yüklenemedi."));
    }
  }
);

export const restoreAutomationVersion = createAsyncThunk(

  'automation/restoreVersion',

  async ({ id, version }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/${id}/versions/${version}/restore`, {}, authConfig());
      return data.automation;
    } catch (error) {

      return rejectWithValue(extractError(error, "Sürüme dönülemedi."));
    }
  }
);

export const getAutomationHealth = createAsyncThunk(

  'automation/getHealth',

  async (_, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${API_URL}/automation/health`, authConfig());
      return data.health ?? {};
    } catch (error) {

      return rejectWithValue(extractError(error, "Sağlık durumu yüklenemedi."));
    }
  }
);

export const getAnomalyBaseline = createAsyncThunk(

  'automation/anomalyBaseline',

  async ({ trigger }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/anomaly/baseline`, { trigger }, authConfig());
      return data.baseline;
    } catch (error) {

      return rejectWithValue(extractError(error, "Sensör geçmişi okunamadı."));
    }
  }
);

export const shareAutomation = createAsyncThunk(

  'automation/share',

  async (id, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/automation/${id}/share`, {}, authConfig());
      return data;
    } catch (error) {

      return rejectWithValue(extractError(error, "Paylaşım kodu oluşturulamadı."));
    }
  }
);

export const getTemplate = createAsyncThunk(

  'automation/getTemplate',

  async (code, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${API_URL}/templates/${code}`, authConfig());
      return data.template;
    } catch (error) {

      return rejectWithValue(extractError(error, "Şablon açılamadı."));
    }
  }
);

export const importTemplate = createAsyncThunk(

  'automation/importTemplate',

  async ({ code, mapping, name, homeId }, { rejectWithValue }) => {

    try {

      const { data } = await axios.post(`${API_URL}/templates/${code}/import`, { mapping, name, homeId }, authConfig());
      return data.automation;
    } catch (error) {

      return rejectWithValue(extractError(error, "Şablon içe aktarılamadı."));
    }
  }
);

// ───────────────────────── SLICE ─────────────────────────

export const automationSlice = createSlice({

  name: 'automation',
  initialState,
  reducers: {

    clearAutomationError: (state) => {
      state.error = null;
      state.createError = null;
    },

    toggleAutomationLocally: (state, action) => {
      const automation = state.automations.find(a => a._id === action.payload);
      if (automation) automation.isActive = !automation.isActive;
    },
  },
  extraReducers: (builder) => {

    // ── Listeleme ──
    builder.addCase(getMyAutomations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMyAutomations.fulfilled, (state, action) => {
      state.loading = false;
      state.automations = action.payload ?? [];
    });
    builder.addCase(getMyAutomations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ── Tek otomasyon (arka plan yenilemesi: hata global uyarıya gitmez) ──
    builder.addCase(getAutomation.fulfilled, (state, action) => {
      upsertAutomation(state, action.payload);
    });

    // ── Oluşturma ──
    builder.addCase(createAutomation.pending, (state) => {
      state.createLoading = true;
      state.actionLoading = true;
      state.createError = null;
      state.error = null;
    });
    builder.addCase(createAutomation.fulfilled, (state, action) => {
      state.createLoading = false;
      state.actionLoading = false;
      upsertAutomation(state, action.payload);
    });
    builder.addCase(createAutomation.rejected, (state, action) => {
      state.createLoading = false;
      state.actionLoading = false;
      state.createError = action.payload;
      state.error = action.payload; // eski sayfalar hatayı buradan okuyor
    });

    // ── Güncelleme (isActive toggle dahil) ──
    builder.addCase(updateAutomation.pending, (state) => {
      state.updateLoading = true;
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateAutomation.fulfilled, (state, action) => {
      state.updateLoading = false;
      state.actionLoading = false;
      upsertAutomation(state, action.payload);
    });
    builder.addCase(updateAutomation.rejected, (state, action) => {
      state.updateLoading = false;
      state.actionLoading = false;
      state.error = action.payload;
    });

    // ── Silme ──
    builder.addCase(deleteAutomation.fulfilled, (state, action) => {
      state.automations = state.automations.filter(a => a._id !== action.payload);
      delete state.runs[action.payload];
    });
    builder.addCase(deleteAutomation.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ── Sürüme dönme ──
    builder.addCase(restoreAutomationVersion.fulfilled, (state, action) => {
      upsertAutomation(state, action.payload);
    });
    builder.addCase(restoreAutomationVersion.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ── Manuel tetikleme ──
    builder.addCase(triggerAutomation.pending, (state, action) => {
      state.triggerLoadingId = action.meta.arg;
      state.actionLoading = true;
    });
    builder.addCase(triggerAutomation.fulfilled, (state, action) => {
      state.triggerLoadingId = null;
      state.actionLoading = false;

      const { automationId, status } = action.payload;
      const item = state.automations.find(a => a._id === automationId);

      if (item) {
        item.lastTriggeredAt = new Date().toISOString();
        if (['SUCCESS', 'PARTIAL', 'FAILED'].includes(status)) item.lastRunStatus = status;
      }

      // Açık olan geçmiş listesi kendini yenilesin
      if (state.runs[automationId]) state.runs[automationId].stale = true;
    });
    builder.addCase(triggerAutomation.rejected, (state, action) => {
      state.triggerLoadingId = null;
      state.actionLoading = false;
      state.error = action.payload;
    });

    // ── Çalışma geçmişi (hata yalnızca geçmiş kartında gösterilir) ──
    builder.addCase(getAutomationRuns.pending, (state, action) => {
      const entry = runsEntry(state, action.meta.arg.id);
      entry.loading = true;
      entry.error = null;
    });
    builder.addCase(getAutomationRuns.fulfilled, (state, action) => {
      const { id, runs, append, limit } = action.payload;
      const entry = runsEntry(state, id);

      entry.loading = false;
      entry.stale = false;
      entry.items = append ? [...entry.items, ...runs] : runs;
      entry.hasMore = runs.length === limit;
    });
    builder.addCase(getAutomationRuns.rejected, (state, action) => {
      const entry = runsEntry(state, action.meta.arg.id);
      entry.loading = false;
      entry.error = action.payload;
    });

    // ── Sağlık ──
    builder.addCase(getAutomationHealth.fulfilled, (state, action) => {
      state.health = action.payload;
    });

    // ── Paylaşım ve şablon ──
    builder.addCase(shareAutomation.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(importTemplate.fulfilled, (state, action) => {
      upsertAutomation(state, action.payload);
    });
  },
});

export const { clearAutomationError, toggleAutomationLocally } = automationSlice.actions;
export default automationSlice.reducer;
