import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: { items: [] },

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) =>
          i.productId === item.productId &&
          i.variantId === item.variantId
      );

      if (existing) {
        if (existing.qty < item.stock) {
          existing.qty += item.qty;
        }
      } else {
        state.items.push({
          ...item,
          qty: 1,
        });
      }
    },

    increaseQty: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId
      );

      if (item && item.qty < item.stock) {
        item.qty += 1;
      }
    },

    decreaseQty: (state, action) => {
      const { productId, variantId } = action.payload;

      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId
      );

      if (item && item.qty > 1) {
        item.qty -= 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId
          )
      );
    },
    clearCart: (state) => {
  state.items = [];
},
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = slice.actions;

export default slice.reducer;
