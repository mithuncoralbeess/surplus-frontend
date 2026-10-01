import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/apiClient';

export interface SubCategory {
  id: number | string;
  name: string;
  slug?: string;
  category?: number | string;
  [key: string]: any;
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  subcategories?: SubCategory[];
  sub_categories?: SubCategory[];
  [key: string]: any;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  fetched: false,
};

// Async thunk to fetch categories & subcategories from API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Try /api/categories/ first, then fallback to /categories/
      let res = await apiClient('/api/categories/');
      if (!res.success) {
        res = await apiClient('/categories/');
      }

      if (res.success && res.data) {
        // Handle various response wrappers (Array vs { results: [] } vs { categories: [] })
        const rawData = res.data;
        let categoriesArray: Category[] = [];

        if (Array.isArray(rawData)) {
          categoriesArray = rawData;
        } else if (Array.isArray(rawData.results)) {
          categoriesArray = rawData.results;
        } else if (Array.isArray(rawData.categories)) {
          categoriesArray = rawData.categories;
        } else if (Array.isArray(rawData.data)) {
          categoriesArray = rawData.data;
        }

        return categoriesArray;
      } else {
        return rejectWithValue(res.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error fetching categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.fetched = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.fetched = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load categories';
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
