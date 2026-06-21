import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "https://backend-d72l.onrender.com";

const initialState = {

  automations: [],
  loading: false,
  error: null,
  actionLoading: false,
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getMyAutomations = createAsyncThunk(
  'automation/getMyAutomations',

  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/automation/my-automations`,
        getAuthHeader()
      );

      return data.automations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Otomasyonlar yüklenemedi."
      );
    }
  }
);

export const createAutomation = createAsyncThunk(
  'automation/createAutomation',

  async (automationData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/automation/create`,
        automationData,
        getAuthHeader()
      );

      return data.automation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Otomasyon oluşturulamadı."
      );
    }
  }
);

export const updateAutomation = createAsyncThunk(
  'automation/updateAutomation',

  async ({ id, automationData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${BASE_URL}/api/automation/${id}`,
        automationData,
        getAuthHeader()
      );

      return data.automation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Otomasyon güncellenemedi."
      );
    }
  }
);

export const deleteAutomation = createAsyncThunk(
  'automation/deleteAutomation',

  async (automationId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/automation/${automationId}`,
        getAuthHeader()
      );

      return automationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Otomasyon silinemedi."
      );
    }
  }
);

export const triggerAutomation = createAsyncThunk(
  'automation/triggerAutomation',

  async (automationId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/automation/trigger/${automationId}`,
        {},
        getAuthHeader()
      );

      return {
        automationId,
        result: data
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Otomasyon tetiklenemedi."
      );
    }
  }
);

export const automationSlice = createSlice({
  name: 'automation',
  initialState,

  reducers: {
    clearAutomationError: (state) => {
      state.error = null;
    },

    toggleAutomationLocally: (state, action) => {
      const automation = state.automations.find(
        a => a._id === action.payload
      );

      if (automation) {
        automation.isActive = !automation.isActive;
      }
    }
  },

  extraReducers: (builder) => {

    builder.addCase(getMyAutomations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(getMyAutomations.fulfilled, (state, action) => {
      state.loading = false;
      state.automations = action.payload;
    });

    builder.addCase(getMyAutomations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(createAutomation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });

    builder.addCase(createAutomation.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.automations.push(action.payload);
    });

    builder.addCase(createAutomation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload;
    });

    builder.addCase(updateAutomation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });

    builder.addCase(updateAutomation.fulfilled, (state, action) => {
      state.actionLoading = false;

      const index = state.automations.findIndex(
        a => a._id === action.payload._id
      );

      if (index !== -1) {
        state.automations[index] = action.payload;
      }
    });

    builder.addCase(updateAutomation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteAutomation.fulfilled, (state, action) => {
      state.automations = state.automations.filter(
        automation => automation._id !== action.payload
      );
    });

    builder.addCase(triggerAutomation.pending, (state) => {
      state.actionLoading = true;
    });

    builder.addCase(triggerAutomation.fulfilled, (state, action) => {
      state.actionLoading = false;

      const automation = state.automations.find(
        a => a._id === action.payload.automationId
      );

      if (automation) {
        automation.lastTriggeredAt = new Date().toISOString();
      }
    });

    builder.addCase(triggerAutomation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload;
    });
  }
});

export const {
  clearAutomationError,
  toggleAutomationLocally
} = automationSlice.actions;

export default automationSlice.reducer;