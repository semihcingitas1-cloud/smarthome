import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_GUIDES_CONTENT, GUIDE_SECTIONS } from '../data/guidesContent';

const BASE_URL = "https://ornekciceksitesi.com";

// Endpoint ve veri şeması: proje kökündeki GUIDES_API.md
//   GET    /guides                          → herkese açık, sadece yayındaki içerik
//   GET    /editor/guides                   → editör, yayında olmayanlar dahil
//   POST   /editor/guides/:section          → yeni kayıt   (section: catalogs | installs | videos)
//   PUT    /editor/guides/:section/:id      → güncelle
//   DELETE /editor/guides/:section/:id      → sil
//   POST   /editor/guides/catalogs/upload   → PDF yükle (multipart, alan adı: file) → { url }

const authConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const errMsg = (error, fallback) => error?.response?.data?.message || fallback;

const pickSections = (data) => {

  const src = data?.data ?? data ?? {};
  return GUIDE_SECTIONS.reduce((acc, s) => ({ ...acc, [s]: Array.isArray(src[s]) ? src[s] : [] }), {});
};

const idOf = (item) => item?._id ?? item?.id;

export const fetchGuides = createAsyncThunk('guides/fetchPublic', async (_, { rejectWithValue }) => {

  try {
    const { data } = await axios.get(`${BASE_URL}/guides`, { timeout: 10000 });
    return pickSections(data);
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Rehber içeriği alınamadı.'));
  }
});

export const fetchEditorGuides = createAsyncThunk('guides/fetchEditor', async (_, { rejectWithValue }) => {

  try {
    const { data } = await axios.get(`${BASE_URL}/editor/guides`, { ...authConfig(), timeout: 10000 });
    return pickSections(data);
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Rehber içeriği sunucudan alınamadı.'));
  }
});

export const createGuideItem = createAsyncThunk('guides/create', async ({ section, item }, { rejectWithValue }) => {

  try {
    const { data } = await axios.post(`${BASE_URL}/editor/guides/${section}`, item, authConfig());
    return { section, item: data?.data ?? data };
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Kayıt eklenemedi.'));
  }
});

export const updateGuideItem = createAsyncThunk('guides/update', async ({ section, id, item }, { rejectWithValue }) => {

  try {
    const { data } = await axios.put(`${BASE_URL}/editor/guides/${section}/${id}`, item, authConfig());
    return { section, id, item: data?.data ?? data };
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Kayıt güncellenemedi.'));
  }
});

export const deleteGuideItem = createAsyncThunk('guides/delete', async ({ section, id }, { rejectWithValue }) => {

  try {
    await axios.delete(`${BASE_URL}/editor/guides/${section}/${id}`, authConfig());
    return { section, id };
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Kayıt silinemedi.'));
  }
});

export const uploadCatalogFile = createAsyncThunk('guides/uploadCatalog', async (file, { rejectWithValue }) => {

  try {
    const form = new FormData();
    form.append('file', file);
    const { data } = await axios.post(`${BASE_URL}/editor/guides/catalogs/upload`, form, authConfig());
    return data?.url ?? data?.data?.url;
  } catch (error) {
    return rejectWithValue(errMsg(error, 'Dosya yüklenemedi.'));
  }
});

// Sunucudaki içerik boşken varsayılan içeriği sırayla gönderir
export const seedDefaultGuides = createAsyncThunk('guides/seed', async (_, { dispatch, rejectWithValue }) => {

  try {
    for (const section of GUIDE_SECTIONS) {
      for (const { _id, ...item } of DEFAULT_GUIDES_CONTENT[section]) {
        await dispatch(createGuideItem({ section, item })).unwrap();
      }
    }
    return true;
  } catch (error) {
    return rejectWithValue(typeof error === 'string' ? error : 'Varsayılan içerik yüklenemedi.');
  }
});

const initialState = {
  // Herkese açık sayfa: sunucuya ulaşılamazsa varsayılan içerik kullanılır (source: 'default')
  content: DEFAULT_GUIDES_CONTENT,
  source: 'default',
  loading: false,

  // Editör paneli
  editor: { catalogs: [], installs: [], videos: [] },
  editorLoaded: false,
  editorLoading: false,
  editorError: null,
  saving: false,
  saveError: null,
};

const guidesSlice = createSlice({

  name: 'guides',
  initialState,
  reducers: {
    clearGuidesError: (state) => {
      state.editorError = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchGuides.pending, (state) => { state.loading = true; })
      .addCase(fetchGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
        state.source = 'api';
      })
      .addCase(fetchGuides.rejected, (state) => {
        state.loading = false;
        state.content = DEFAULT_GUIDES_CONTENT;
        state.source = 'default';
      })

      .addCase(fetchEditorGuides.pending, (state) => { state.editorLoading = true; state.editorError = null; })
      .addCase(fetchEditorGuides.fulfilled, (state, action) => {
        state.editorLoading = false;
        state.editorLoaded = true;
        state.editor = action.payload;
      })
      .addCase(fetchEditorGuides.rejected, (state, action) => {
        state.editorLoading = false;
        state.editorLoaded = false;
        state.editorError = action.payload;
      })

      .addCase(createGuideItem.fulfilled, (state, action) => {
        const { section, item } = action.payload;
        if (item && typeof item === 'object') state.editor[section].push(item);
      })
      .addCase(updateGuideItem.fulfilled, (state, action) => {
        const { section, id, item } = action.payload;
        state.editor[section] = state.editor[section].map((x) => (String(idOf(x)) === String(id) ? { ...x, ...item } : x));
      })
      .addCase(deleteGuideItem.fulfilled, (state, action) => {
        const { section, id } = action.payload;
        state.editor[section] = state.editor[section].filter((x) => String(idOf(x)) !== String(id));
      })

      // Kaydetme durumları (ekle / güncelle / sil / yükle)
      .addMatcher(
        (a) => /^guides\/(create|update|delete|uploadCatalog|seed)\/pending$/.test(a.type),
        (state) => { state.saving = true; state.saveError = null; }
      )
      .addMatcher(
        (a) => /^guides\/(create|update|delete|uploadCatalog|seed)\/fulfilled$/.test(a.type),
        (state) => { state.saving = false; }
      )
      .addMatcher(
        (a) => /^guides\/(create|update|delete|uploadCatalog|seed)\/rejected$/.test(a.type),
        (state, action) => { state.saving = false; state.saveError = action.payload ?? 'İşlem başarısız.'; }
      );
  },
});

export const { clearGuidesError } = guidesSlice.actions;
export default guidesSlice.reducer;
