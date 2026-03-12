
import { createSlice } from "@reduxjs/toolkit";

const storedWishlist = localStorage.getItem("wishlist");

const initialState = {
  items: storedWishlist ? JSON.parse(storedWishlist) : [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId
      );

      if (!exists) {
        state.items.push(action.payload);
      }

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload
      );

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;