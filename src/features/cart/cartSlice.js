
import { createSlice } from "@reduxjs/toolkit";

const storedCart = localStorage.getItem("cart");

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [],
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

      localStorage.setItem("cart", JSON.stringify(state.items));
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

      localStorage.setItem("cart", JSON.stringify(state.items));
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

      localStorage.setItem("cart", JSON.stringify(state.items));
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

      localStorage.setItem("cart", JSON.stringify(state.items));
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

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    /* ================= CLEAR ================= */
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
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