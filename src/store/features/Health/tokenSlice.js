// src/redux/tokenSlice.js

import { createSlice } from '@reduxjs/toolkit';

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    publicToken: 'WlDEZA0QpYffLXRRjPTaAwE83YImK4JE5utDP91fBpmbyiBIvejCRWmDMuYpm4xIYYJU2muY9aQql6RiYY7khCS9BPOW8ra8ezTHyX1pQcYhtOd5b5ZT2fkuHxwazFSdlYBqlVByqaz72jRhLJx5x7J7dolhLGGo28fTklfQwq77cwDu0QBLkiAUAWwX10abith47P3xrA9sL2DH9kra14X9w6JRae36PpbycXg1uhoXvIMOzpqHHDUyto6',
  },
  reducers: {
    setToken: (state, action) => {
      state.publicToken = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
