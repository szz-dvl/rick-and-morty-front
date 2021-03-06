import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { submitLogin } from './loginAPI';
import SessionService from '../../session/SessionService';
import { History } from 'history';

export interface LoginState {
    error: string | null;
    in_progress: boolean;
}

interface LoginData {
    nick: string;
    pwd: string;
    remember: boolean;
    history: History;
}

const initialState: LoginState = {
    error: null,
    in_progress: false,
};

export const submit = createAsyncThunk(
    'LOGIN/SUBMIT',
    async ({ nick, pwd, remember, history }: LoginData, thunkAPI) => {
        try {

            const { token } = await submitLogin(nick, pwd, remember);

            SessionService.saveData(nick, token);

            history.push("/list");

            return true;
            
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        clean: (state) => {
            state.error = null;
        }
    },
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
                let error = action.payload as string;

                state.in_progress = false;
                state.error = error;
            });
    },
});

export const { clean } = loginSlice.actions;
export default loginSlice.reducer;
