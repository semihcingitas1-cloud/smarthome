import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://ornekciceksitesi.com";

// ───────────────────────── YARDIMCILAR ─────────────────────────

const getToken = () => localStorage.getItem("token");

// Token yoksa "Bearer null" gönderme
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonAuthHeaders = () => ({ ...authHeaders(), "Content-Type": "application/json" });

const errMsg = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

// Boş değerleri atlayarak query string oluşturur
const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.append(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : "";
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// File nesnelerini base64'e çevirir, URL/base64 string'leri olduğu gibi bırakır
const normalizeImages = async (images = []) =>
  Promise.all(
    images.map((img) => {
      if (typeof img === "string") return img;
      if (img?.file instanceof Blob) return fileToBase64(img.file);
      if (img instanceof Blob) return fileToBase64(img);
      return img?.url || img?.file || img?.preview || null;
    })
  ).then((list) => list.filter(Boolean));

// ───────────────────────── MAĞAZA ─────────────────────────

/**
 * params: { search, category, subcategory, minPrice, maxPrice, inStock, discounted, sort, page, limit, append }
 * sort: new | popular | rating | price_asc | price_desc
 * append: true → mevcut listeye ekler ("daha fazla yükle")
 */
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { append, ...query } = params;
      const { data } = await axios.get(`${BASE_URL}/products${buildQuery(query)}`);
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürünler yüklenemedi"));
    }
  }
);

export const getHomeProducts = createAsyncThunk(
  "products/getHomeProducts",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/products/home${buildQuery({ limit })}`);
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Vitrin yüklenemedi"));
    }
  }
);

export const getProductCategories = createAsyncThunk(
  "products/getProductCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/products/categories`);
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Kategoriler yüklenemedi"));
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün bulunamadı"));
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  "products/getProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/product/slug/${encodeURIComponent(slug)}`);
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün bulunamadı"));
    }
  }
);

// ───────────────────────── ADMİN ─────────────────────────

export const getAdminProducts = createAsyncThunk(
  "products/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/products`, { headers: authHeaders() });
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Bir hata oluştu"));
    }
  }
);

// Taslaklar dahil, görüntülenme saymaz — düzenleme ekranı bunu kullanmalı
export const getAdminProductDetail = createAsyncThunk(
  "products/getAdminProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/product/${id}`, { headers: authHeaders() });
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün bulunamadı"));
    }
  }
);

export const createProductWithImages = createAsyncThunk(
  "products/createProductWithImages",
  async (productData, { rejectWithValue }) => {
    try {
      const images = await normalizeImages(productData.images);
      const { data } = await axios.post(
        `${BASE_URL}/admin/product/new`,
        { ...productData, images },
        { headers: jsonAuthHeaders() }
      );
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün oluşturulamadı"));
    }
  }
);

/**
 * productData.images gönderilirse: listedeki mevcut URL'ler korunur, yeni dosyalar yüklenir,
 * listede olmayan eski görseller silinir. Görselleri değiştirmeyeceksen images'ı hiç gönderme.
 */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const body = { ...productData };
      if (body.images !== undefined) body.images = await normalizeImages(body.images);

      const { data } = await axios.put(`${BASE_URL}/admin/product/${id}`, body, { headers: jsonAuthHeaders() });
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün güncellenemedi"));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/admin/product/${id}`, { headers: authHeaders() });
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(errMsg(error, "Ürün silinemedi"));
    }
  }
);

export const updateStock = createAsyncThunk(
  "products/updateStock",
  async ({ id, quantity, modelName }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/product/${id}/stock`,
        { quantity, modelName },
        { headers: jsonAuthHeaders() }
      );
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "Stok güncellenemedi"));
    }
  }
);

export const getProductStats = createAsyncThunk(
  "products/getProductStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/products/stats`, { headers: authHeaders() });
      return data;
    } catch (error) {
      return rejectWithValue(errMsg(error, "İstatistikler alınamadı"));
    }
  }
);

// ───────────────────────── YORUMLAR ─────────────────────────

// reviewData: { productId, comment, rating, images? }
export const createReview = createAsyncThunk(
  "products/createReview",
  async ({ productId, images, ...rest }, { rejectWithValue }) => {
    try {
      const body = { ...rest };
      if (images !== undefined) body.images = await normalizeImages(images);

      const { data } = await axios.post(`${BASE_URL}/product/${productId}/review`, body, { headers: jsonAuthHeaders() });
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(errMsg(error, "Yorum eklenemedi"));
    }
  }
);

// { productId, reviewId } — eski çağrılar için { productId, id } de kabul edilir
export const deleteReview = createAsyncThunk(
  "products/deleteReview",
  async ({ productId, reviewId, id }, { rejectWithValue }) => {
    const targetId = reviewId ?? id;
    try {
      const { data } = await axios.delete(`${BASE_URL}/product/${productId}/review/${targetId}`, { headers: authHeaders() });
      return { productId, reviewId: targetId, ...data };
    } catch (error) {
      return rejectWithValue(errMsg(error, "Yorum silinemedi"));
    }
  }
);

export const markReviewHelpful = createAsyncThunk(
  "products/markReviewHelpful",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/product/${productId}/review/${reviewId}/helpful`,
        {},
        { headers: authHeaders() }
      );
      return { productId, reviewId, ...data };
    } catch (error) {
      return rejectWithValue(errMsg(error, "İşlem başarısız"));
    }
  }
);

// ───────────────────────── SLICE ─────────────────────────

const isCurrentProduct = (state, productId) =>
  state.product && String(state.product._id ?? state.product.id) === String(productId);

const initialState = {
  // Mağaza listesi
  products: [],
  filteredProducts: [],
  productCount: 0,
  page: 1,
  totalPages: 1,
  hasMore: false,
  lastQuery: {},
  listLoading: false,
  listRequestId: null,

  // Vitrin ve kategoriler
  home: { featured: [], newest: [], bestSellers: [], discounted: [] },
  homeLoading: false,
  categories: [],
  categoriesTotal: 0,
  categoriesLoading: false,

  // Detay
  product: null,
  detailLoading: false,

  // Admin
  adminProducts: [],
  stats: null,
  newProductId: null,
  createStatus: "idle", // idle | loading | succeeded | failed
  createError: null,

  // Yorumlar
  reviewStatus: "idle", // idle | loading | succeeded | failed
  reviewError: null,

  // Geriye dönük uyumluluk (mevcut sayfalar bunları kullanıyor)
  loading: false,
  error: null,
  success: false,
  message: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.reviewError = null;
      state.createError = null;
    },
    resetStatus: (state) => {
      state.success = false;
      state.message = null;
      state.error = null;
      state.newProductId = null;
      state.createStatus = "idle";
      state.createError = null;
      state.reviewStatus = "idle";
      state.reviewError = null;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {

    // ── Mağaza listesi ──
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.listLoading = true;
        state.loading = true;
        state.error = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        // Hızlı aramada eski bir cevap yenisini ezmesin
        if (state.listRequestId !== action.meta.requestId) return;

        const { products = [], productCount = 0, page = 1, totalPages = 1, hasMore = false } = action.payload;
        const append = action.meta.arg?.append && page > 1;

        state.products = append ? [...state.products, ...products] : products;
        state.filteredProducts = state.products;
        state.productCount = productCount;
        state.page = page;
        state.totalPages = totalPages;
        state.hasMore = hasMore;

        const { append: _ignored, page: _page, ...query } = action.meta.arg ?? {};
        state.lastQuery = query;

        state.listLoading = false;
        state.loading = false;
        state.listRequestId = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listLoading = false;
        state.loading = false;
        state.listRequestId = null;
        state.error = action.payload;
      });

    // ── Vitrin ──
    builder
      .addCase(getHomeProducts.pending, (state) => {
        state.homeLoading = true;
      })
      .addCase(getHomeProducts.fulfilled, (state, action) => {
        state.homeLoading = false;
        const { featured = [], newest = [], bestSellers = [], discounted = [] } = action.payload;
        state.home = { featured, newest, bestSellers, discounted };
      })
      .addCase(getHomeProducts.rejected, (state, action) => {
        state.homeLoading = false;
        state.error = action.payload;
      });

    // ── Kategoriler ──
    builder
      .addCase(getProductCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(getProductCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.categories ?? [];
        state.categoriesTotal = action.payload.total ?? 0;
      })
      .addCase(getProductCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload;
      });

    // ── Detay (herkese açık, slug ve admin aynı alanı doldurur) ──
    [getProductDetail, getProductBySlug, getAdminProductDetail].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.detailLoading = true;
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.detailLoading = false;
          state.loading = false;
          state.product = action.payload.product;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.detailLoading = false;
          state.loading = false;
          state.error = action.payload;
        });
    });

    // ── Admin liste ──
    builder
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload.products ?? [];
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Ürün oluştur ──
    builder
      .addCase(createProductWithImages.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createProductWithImages.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.message = action.payload.message ?? "Ürün oluşturuldu.";
        state.newProductId = action.payload.product?._id ?? null;
        if (action.payload.product) state.adminProducts.unshift(action.payload.product);
      })
      .addCase(createProductWithImages.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      });

    // ── Ürün güncelle / stok güncelle ──
    [updateProduct, updateStock].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.message = action.payload.message ?? "Ürün güncellendi.";

          const updated = action.payload.product;
          if (!updated) return;

          state.adminProducts = state.adminProducts.map((p) => (p._id === updated._id ? updated : p));
          if (isCurrentProduct(state, updated._id)) state.product = updated;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });

    // ── Ürün sil ──
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.adminProducts = state.adminProducts.filter((p) => p._id !== action.payload.id);
        state.products = state.products.filter((p) => p._id !== action.payload.id);
        state.filteredProducts = state.products;
        if (isCurrentProduct(state, action.payload.id)) state.product = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── İstatistikler ──
    builder
      .addCase(getProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Yorum ekle / güncelle ──
    builder
      .addCase(createReview.pending, (state) => {
        state.reviewStatus = "loading";
        state.reviewError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewStatus = "succeeded";
        state.success = true;
        state.message = action.payload.message;

        if (isCurrentProduct(state, action.payload.productId)) {
          state.product.ratingsAverage = action.payload.ratingsAverage ?? state.product.ratingsAverage;
          state.product.ratingsQuantity = action.payload.ratingsQuantity ?? state.product.ratingsQuantity;
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload;
      });

    // ── Yorum sil ──
    builder
      .addCase(deleteReview.pending, (state) => {
        state.reviewStatus = "loading";
        state.reviewError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviewStatus = "succeeded";
        state.success = true;
        state.message = action.payload.message;

        if (isCurrentProduct(state, action.payload.productId)) {
          state.product.reviews = (state.product.reviews ?? []).filter((r) => String(r._id) !== String(action.payload.reviewId));
          state.product.ratingsAverage = action.payload.ratingsAverage ?? state.product.ratingsAverage;
          state.product.ratingsQuantity = action.payload.ratingsQuantity ?? state.product.reviews.length;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.reviewError = action.payload;
      });

    // ── Faydalı işaretle (sayfa yükleme durumuna girmez) ──
    builder
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        state.message = action.payload.message;

        if (isCurrentProduct(state, action.payload.productId)) {
          const review = state.product.reviews?.find((r) => String(r._id) === String(action.payload.reviewId));
          if (review && action.payload.helpfulCount != null) review.helpfulCount = action.payload.helpfulCount;
        }
      })
      .addCase(markReviewHelpful.rejected, (state, action) => {
        state.reviewError = action.payload;
      });
  },
});

export const { clearErrors, resetStatus, setFilteredProducts, clearProduct } = productSlice.actions;

export default productSlice.reducer;
