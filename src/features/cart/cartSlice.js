import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // hydrated from backend
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ================= HYDRATE CART ================= */
    setCart: (state, action) => {
      state.items = action.payload.map((i) => ({
        cartId: i.cartId,
        productId: i.productId,
        name: i.name,
        price: i.price,
        image: i.image,
        qty: i.qty,
        variantId: i.variantId || null,
        variantLabel: i.variantLabel || "",
      }));
    },

    /* ================= ADD ================= */
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) =>
          i.productId === item.productId &&
          i.variantId === item.variantId
      );

      if (existing) {
        existing.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
    },

    /* ================= INCREASE ================= */
    increaseQty: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId
      );
      if (item) item.qty += 1;
    },

    /* ================= DECREASE ================= */
    decreaseQty: (state, action) => {
      const { productId, variantId } = action.payload;
      const item = state.items.find(
        (i) =>
          i.productId === productId &&
          i.variantId === variantId
      );
      if (!item) return;

      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        state.items = state.items.filter(
          (i) =>
            !(
              i.productId === productId &&
              i.variantId === variantId
            )
        );
      }
    },

    /* ================= REMOVE ================= */
    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === productId &&
            i.variantId === variantId
          )
      );
    },

    /* ================= CLEAR ================= */
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
