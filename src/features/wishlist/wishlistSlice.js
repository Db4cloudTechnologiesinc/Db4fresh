import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 👤 Get user ID (temp — modify later when login works)
const USER_ID = 1;

// 🔄 Fetch wishlist from DB
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const res = await axios.get(`http://localhost:4000/api/wishlist/${USER_ID}`);
  return res.data;
});

// ❤️ Add to wishlist
export const addWishlistItem = createAsyncThunk(
  "wishlist/add",
  async (product_id) => {
    await axios.post("http://localhost:4000/api/wishlist/add", {
      user_id: USER_ID,
      product_id,
    });

    return product_id;
  }
);

// ❌ Remove from wishlist
export const removeWishlistItem = createAsyncThunk(
  "wishlist/remove",
  async (product_id) => {
    await axios.post("http://localhost:4000/api/wishlist/remove", {
      user_id: USER_ID,
      product_id,
    });

    return product_id;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        const id = action.payload;
        const exists = state.items.find((p) => p.id === id);
        if (!exists) state.items.push({ id });
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((p) => p.id !== id);
      });
  },
});

export default wishlistSlice.reducer;
