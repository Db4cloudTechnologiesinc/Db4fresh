import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name:'auth',
  initialState:{ user:null, token:null },
  reducers:{
    setAuth(s,a){ s.user = a.payload.user; s.token = a.payload.token; },
    logout(s){ s.user = null; s.token = null; }
  }
});

export const { setAuth, logout } = slice.actions;
export default slice.reducer;
