import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import login from '../containers/Login/loginSlice';
import register from '../containers/Register/registerSlice';
import list from '../containers/List/listSlice';
import character from '../containers/Character/characterSlice';
import session from '../session/sessionSlice';

export const store = configureStore({
  reducer: {
    login,
    session,
    register,
    list,
    character
  },
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
