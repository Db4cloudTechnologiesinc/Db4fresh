
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await api.get("/products");

    // ✅ DO NOT reshape – keep backend structure
    return res.data.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      images: p.images || [],
      variants: p.variants || [],
      price: p.price || null,
    }));
  }
);

const slice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default slice.reducer;
