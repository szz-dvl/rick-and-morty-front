import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    authenticated: false,
    token: null,
    user: null
  },
  reducers: {
    authenticate: (state, action) => {

        let { user, token } = action.payload;

        state.authenticated = true;
        state.token = token;
        state.user = user;

    },
    deauthenticate: (state) => {

        state.authenticated = false;
        state.token = null;
        state.user = null;
    },
  },
})

export const { authenticate, deauthenticate } = sessionSlice.actions

export default sessionSlice.reducer