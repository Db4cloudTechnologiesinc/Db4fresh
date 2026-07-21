
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
        String(i.productId) === String(item.productId) &&
        Number(i.variantId || 0) ===
Number(item.variantId || 0)
    );

    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      state.items.push({
        ...item,
        variantId: item.variantId ?? null,
        qty: item.qty || 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(state.items));
  },

  /* ================= INCREASE ================= */
  increaseQty: (state, action) => {
    const { productId, variantId } = action.payload;

    const item = state.items.find(
  (i) =>
    String(i.productId) === String(productId) &&
    Number(i.variantId || 0) === Number(variantId || 0)
);

    if (item) item.qty += 1;

    localStorage.setItem("cart", JSON.stringify(state.items));
  },

  /* ================= DECREASE ================= */
  decreaseQty: (state, action) => {
    const { productId, variantId } = action.payload;

    const item = state.items.find(
  (i) =>
    String(i.productId) === String(productId) &&
    Number(i.variantId || 0) === Number(variantId || 0)
);

    if (!item) return;

    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      state.items = state.items.filter(
        (i) =>
          !(
            String(i.productId) === String(productId) &&
            Number(i.variantId || 0) ===
              Number(variantId || 0)
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
        String(i.productId) === String(productId) &&
        Number(i.variantId || 0) === Number(variantId || 0)
      )
  );

  localStorage.setItem("cart", JSON.stringify(state.items));
},
  /* ================= CLEAR ================= */
  clearCart: (state) => {
    state.items = [];
    localStorage.removeItem("cart");
  },
  resetCartState: (state) => {
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
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;