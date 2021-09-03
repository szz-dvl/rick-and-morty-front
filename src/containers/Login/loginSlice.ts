import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fakeSubmit } from './loginAPI';
import SessionService from '../../session/SessionService';

export interface LoginState {
    error: string | null;
    in_progress: boolean;
}

interface LoginData {
    nick: string,
    pwd: string
}

const initialState: LoginState = {
    error: null,
    in_progress: false,
};

export const submit = createAsyncThunk(
    'LOGIN/SUBMIT',
    async ({ nick, pwd }: LoginData, thunkAPI) => {
        try {

            const { token } = await fakeSubmit(nick, pwd);
            SessionService.saveData(nick, token);

            return true;
            
        } catch (err) {
            SessionService.removeData();
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submit.pending, (state) => {
                state.error = null;
                state.in_progress = true;
            })
            .addCase(submit.fulfilled, (state) => {
                state.in_progress = false;
            })
            .addCase(submit.rejected, (state, action) => {
                state.in_progress = false;
                state.error = action.payload as string;
            });
    },
});

export default loginSlice.reducer;
