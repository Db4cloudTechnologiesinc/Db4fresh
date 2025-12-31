import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
    selectedAddress: null,
    isOpen: false,
  },
  reducers: {
    setAddresses: (state, action) => {
  const addresses = Array.isArray(action.payload)
    ? action.payload
    : action.payload?.data || action.payload?.addresses || [];

  state.list = addresses;

  state.selectedAddress =
    addresses.find(a => a.is_default === 1 || a.is_default === true) ||
    addresses[0] ||
    null;
},

    selectAddress: (state, action) => {
      const address = Array.isArray(action.payload)
       ? action.payload : action.payload;
    },
    openAddressModal: (state) => {
      state.isOpen = true;
    },
    closeAddressModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  setAddresses,
  selectAddress,
  openAddressModal,
  closeAddressModal,
} = addressSlice.actions;

export default addressSlice.reducer;
