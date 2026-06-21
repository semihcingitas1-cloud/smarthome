import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://backend-d72l.onrender.com";

const getToken = () => localStorage.getItem("token");

export const getAdminProducts = createAsyncThunk(
  "products/getAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Bir hata oluştu");
    }
  }
);

export const getProducts = createAsyncThunk(

  "products/getProducts",
  async (_, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${BASE_URL}/products`);
      return data;
    } catch (error) {

      return rejectWithValue(error.response?.data?.message || "Bir hata oluştu");
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
      return rejectWithValue(error.response?.data?.message || "Ürün bulunamadı");
    }
  }
);

export const getProductBySlug = createAsyncThunk(

  "products/getProductBySlug",

  async (slug, { rejectWithValue }) => {

    try {

      const { data } = await axios.get(`${BASE_URL}/product/slug/${slug}`);
      return data;
    } catch (error) {

      return rejectWithValue(error.response?.data?.message || "Ürün bulunamadı");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/admin/product/new`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ürün oluşturulamadı");
    }
  }
);

export const createProductWithImages = createAsyncThunk(
  "products/createProductWithImages",

  async (productData, { rejectWithValue }) => {

    try {

      const base64Images = await Promise.all(

        productData.images.map((imageObj) => {

          return new Promise((resolve, reject) => {

            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(imageObj.file);
          });
        })
      );

      const { data } = await axios.post(
        `${BASE_URL}/admin/product/new`,
        {
          ...productData,
          images: base64Images,
          features: productData.features,
          specifications: productData.specifications,
          tags: productData.tags,
          colors: productData.colors,
          models: productData.models,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Ürün oluşturulamadı"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(

  "products/updateProduct",

  async ({ id, productData }, { rejectWithValue }) => {

    try {

      const { data } = await axios.put(
        `${BASE_URL}/admin/product/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ürün güncellenemedi");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/admin/product/${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ürün silinemedi");
    }
  }
);

// Admin - Stok güncelle
export const updateStock = createAsyncThunk(
  "products/updateStock",
  async ({ id, quantity, modelName }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/admin/product/${id}/stock`,
        { quantity, modelName },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Stok güncellenemedi");
    }
  }
);

// Admin - Ürün istatistikleri
export const getProductStats = createAsyncThunk(
  "products/getProductStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/products/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "İstatistikler alınamadı");
    }
  }
);

// User - Yorum ekle/güncelle
export const createReview = createAsyncThunk(
  "products/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/product/review`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Yorum eklenemedi");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "products/deleteReview",
  async ({ productId, id }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/product/review?productId=${productId}&id=${id}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Yorum silinemedi");
    }
  }
);

// User - Yorumu faydalı işaretle
export const markReviewHelpful = createAsyncThunk(
  "products/markReviewHelpful",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/product/${productId}/review/${reviewId}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "İşlem başarısız");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    newProductId: null,
    products: [],
    filteredProducts: [],
    adminProducts: [],
    product: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
    message: null,
    productCount: 0,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.success = false;
      state.message = null;
    },
    // Frontend filtreleme için
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    },
    // Ürün detayını temizle
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Admin Products
    builder
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProducts = action.payload.products;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Products
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.filteredProducts = action.payload.products;
        state.productCount = action.payload.count;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Product Detail
    builder
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Product By Slug
    builder
      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.adminProducts.unshift(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(createProductWithImages.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createProductWithImages.fulfilled, (state, action) => {

      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.newProductId = action.payload.product._id;
      state.adminProducts.unshift(action.payload.product);
    });
    builder.addCase(createProductWithImages.rejected, (state, action) => {

      state.loading = false;
      state.error = action.payload;
    });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.adminProducts = state.adminProducts.map((p) =>
          p._id === action.payload.product._id ? action.payload.product : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.adminProducts = state.adminProducts.filter(
          (p) => p._id !== action.payload.id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Stock
    builder
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.adminProducts = state.adminProducts.map((p) =>
          p._id === action.payload.product._id ? action.payload.product : p
        );
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Product Stats
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

    // Create Review
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Review
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Mark Review Helpful
    builder
      .addCase(markReviewHelpful.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(markReviewHelpful.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, resetStatus, setFilteredProducts, clearProduct } =
  productSlice.actions;

export default productSlice.reducer;