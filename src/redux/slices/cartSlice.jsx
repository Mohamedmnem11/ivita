import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Helper functions للـ localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('ivita_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0, count: 0 };
  } catch (error) {
    console.error('Error parsing cart from storage:', error);
    return { items: [], total: 0, count: 0 };
  }
};

const saveCartToStorage = (cartData) => {
  try {
    localStorage.setItem('ivita_cart', JSON.stringify(cartData));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

// الدالة اللي هتحسب الـ total بشكل صحيح
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    // خد السعر من item.price أو item.sale_price لو موجود، وإلا 0
    const price = parseFloat(item.sale_price || item.price || item.product?.sale_price || item.product?.price || 0);
    const quantity = parseInt(item.quantity || 1);
    return sum + (price * quantity);
  }, 0);
};

// Get cart
export const getCart = createAsyncThunk(
  'cart/get',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/user/cart');
          return response.data;
        } catch (apiError) {
          console.log('API cart failed, falling back to local');
        }
      }

      const cartData = getCartFromStorage();
      return cartData;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to get cart' });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (itemData, { rejectWithValue }) => {
    try {
      const currentCart = getCartFromStorage();
      const existingItemIndex = currentCart.items.findIndex(
        item => item.product_id === itemData.product_id
      );

      if (existingItemIndex > -1) {
        currentCart.items[existingItemIndex].quantity += parseInt(itemData.quantity || 1);
      } else {
        currentCart.items.push({
          product_id: itemData.product_id,
          quantity: parseInt(itemData.quantity || 1),
          name: itemData.name || 'Unknown Product',      
          image: itemData.image || null,                
          price: parseFloat(itemData.price || 0),        
        });
      }

      currentCart.count = currentCart.items.length;
      currentCart.total = calculateTotal(currentCart.items);
      saveCartToStorage(currentCart);

      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.post('/cart/add', itemData);
        } catch (error) {
          console.log('Failed to sync add with server',error);
        }
      }

      return currentCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add item' });
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const currentCart = getCartFromStorage();
      const itemIndex = currentCart.items.findIndex(item => item.product_id === product_id);

      if (itemIndex > -1) {
        const newQuantity = parseInt(quantity);
        if (newQuantity <= 0) {
          currentCart.items.splice(itemIndex, 1);
        } else {
          currentCart.items[itemIndex].quantity = newQuantity;
        }
      }

      currentCart.count = currentCart.items.length;
      currentCart.total = calculateTotal(currentCart.items);
      saveCartToStorage(currentCart);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.post('/cart/update', { product_id, quantity });
        } catch (apiError) {
          console.log('Failed to sync update with server');
        }
      }

      return currentCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update item' });
    }
  }
);


export const removeCartItem = createAsyncThunk(
  'cart/remove',
  async (product_id, { rejectWithValue }) => {
    try {
      const currentCart = getCartFromStorage();
      currentCart.items = currentCart.items.filter(item => item.product_id !== product_id);

      currentCart.count = currentCart.items.length;
      currentCart.total = calculateTotal(currentCart.items);
      saveCartToStorage(currentCart);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.post('/cart/remove_item', { product_id });
        } catch (apiError) {
          console.log('Failed to sync remove with server');
        }
      }

      return currentCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to remove item' });
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      const emptyCart = { items: [], total: 0, count: 0 };
      saveCartToStorage(emptyCart);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axiosInstance.delete('/cart/delete');
        } catch (apiError) {
          console.log('Failed to sync clear with server');
        }
      }

      return emptyCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to clear cart' });
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  count: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    loadCartFromStorage: (state) => {
      const cartData = getCartFromStorage();
      state.items = cartData.items;
      state.total = cartData.total;
      state.count = cartData.count;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || calculateTotal(action.payload.items || []);
        state.count = action.payload.count || action.payload.items?.length || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get cart';
        const cartData = getCartFromStorage();
        state.items = cartData.items;
        state.total = cartData.total;
        state.count = cartData.count;
      })

      // Add
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.count = action.payload.count;
      })

      // Update
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.count = action.payload.count;
      })

      // Remove
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.count = action.payload.count;
      })

      // Clear
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.count = 0;
      });
  },
});

export const { clearCartError, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;