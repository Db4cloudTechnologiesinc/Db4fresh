import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { productId, name, price, image, qty }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    // ✅ ADD TO CART (RESPECTS QTY)
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (i) => i.productId === item.productId
      );

      const qtyToAdd = item.qty || 1;

      if (existing) {
        existing.qty += qtyToAdd;
      } else {
        state.items.push({
          ...item,
          qty: qtyToAdd,
        });
      }
    },

    // ✅ INCREASE QTY
    increaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i.productId === action.payload
      );
      if (item) item.qty += 1;
    },

    // ✅ DECREASE QTY (MIN 1)
    decreaseQty: (state, action) => {
      const item = state.items.find(
        (i) => i.productId === action.payload
      );
      if (item && item.qty > 1) item.qty -= 1;
    },

    // ✅ REMOVE ITEM
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload
      );
    },
    // ✅ CLEAR CART
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
} = cartSlice.actions;

export default cartSlice.reducer;
