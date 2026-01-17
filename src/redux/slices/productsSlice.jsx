import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

async function tryMultipleEndpoints(endpointsList, errorName) {
  let lastError = null;
  
  for (const endpoint of endpointsList) {
    try {
      console.log(`🔍 Trying endpoint: ${endpoint}`);
      const response = await axiosInstance.get(endpoint);
      console.log(`✅ Success with endpoint: ${endpoint}`);
      return response;
    } catch (err) {
      console.warn(`❌ Failed endpoint: ${endpoint}`, err.response?.status);
      lastError = err;
    }
  }
  
  console.error(`🚫 All ${errorName} endpoints failed`);
  throw lastError;
}

export const getProductsByCategory = createAsyncThunk(
  'products/getByCategory',
  async (slug, { rejectWithValue }) => {
    try {
      const endpointsToTry = [
        `/products/getbycat/${slug}`,           
        `/products/category/${slug}`,          
        `/products?category=${slug}`,           
        slug === 'all' ? '/products' : null,    
      ].filter(Boolean); 
      
      const res = await tryMultipleEndpoints(endpointsToTry, 'products by category');
      return res.data;
      
    } catch (err) {
      console.error('❌ Error loading products by category:', {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data
      });
      
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Failed to load products',
        status: err.response?.status,
        url: err.config?.url
      });
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  'products/getBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const endpointsToTry = [
        `/products/slug/${slug}`,  
        `/products/${slug}`,          
        `/product/${slug}`,           
      ];
      
      const res = await tryMultipleEndpoints(endpointsToTry, 'product details');
      return res.data;
      
    } catch (err) {
      console.error('❌ Error loading product:', {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        slug: slug
      });
      
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Product details failed',
        status: err.response?.status,
        url: err.config?.url
      });
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (name, { rejectWithValue }) => {
    try {
      // تشفير النص للتأكد من التعامل مع المسافات والأحرف الخاصة
      const encodedName = encodeURIComponent(name);
      
      const endpointsToTry = [
        `/products/getbyname?name=${encodedName}`,     
        `/products/search?q=${encodedName}`,           
        `/products?search=${encodedName}`,
        `/products?name=${encodedName}`,             
      ];
      
      console.log(`🔍 Searching for: "${name}"`);
      const res = await tryMultipleEndpoints(endpointsToTry, 'search products');
      
      // عرض عدد النتائج في الـ console
      const results = res.data?.data || res.data || [];
      console.log(`✅ Found ${Array.isArray(results) ? results.length : 0} products`);
      
      return res.data;
      
    } catch (err) {
      console.error('❌ Error searching products:', {
        query: name,
        message: err.message,
        status: err.response?.status,
        url: err.config?.url
      });
      
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Search failed',
        status: err.response?.status
      });
    }
  }
);

export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/categories');
      console.log('✅ Categories loaded successfully');
      return res.data;
    } catch (err) {
      console.error('❌ Error loading categories:', {
        status: err.response?.status,
        message: err.message
      });
      
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Failed to load categories',
        status: err.response?.status
      });
    }
  }
);

export const getBrands = createAsyncThunk(
  'products/getBrands',
  async (_, { rejectWithValue }) => {
    try {
      const endpointsToTry = [
        '/brands/get',      
        '/brands',         
      ];
      
      const res = await tryMultipleEndpoints(endpointsToTry, 'brands');
      console.log('✅ Brands loaded successfully');
      return res.data;
      
    } catch (err) {
      console.error('❌ Error loading brands:', err);
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Failed to load brands',
        status: err.response?.status
      });
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  brands: [],
  searchResults: [],
  loading: false,
  error: null,
  lastSuccessfulEndpoint: null, 
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data || action.payload || [];
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.categories = [];
        state.error = action.payload?.message || 'Failed to load categories';
        console.error('❌ Categories error:', action.payload);
      })

      // Brands
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload?.data || action.payload || [];
        state.error = null;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.brands = [];
        state.error = action.payload?.message || 'Failed to load brands';
        console.error('❌ Brands error:', action.payload);
      })

      // Products by Category
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.data || action.payload || [];
        state.error = null;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.products = [];
        state.error = action.payload?.message || 'Failed to load products';
        console.error('❌ Products error:', action.payload);
      })

      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload?.data || action.payload;
        state.error = null;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.currentProduct = null;
        state.error = action.payload?.message || 'Product not found';
        console.error('❌ Product details error:', action.payload);
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // معالجة أشكال مختلفة من الـ response
        const results = action.payload?.data || action.payload || [];
        state.searchResults = Array.isArray(results) ? results : [];
        state.error = null;
        
        console.log(`📦 Search results stored: ${state.searchResults.length} items`);
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.searchResults = [];
        state.error = action.payload?.message || 'Search failed';
        console.error('❌ Search error:', action.payload);
      });
  },
});

export const { clearSearchResults, clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;