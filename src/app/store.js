import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import wishlistReducer from "../features/wishlist/wishlistSlice";
import addressReducer from '../features/address/addressSlice';


export const store=configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
  }
});
