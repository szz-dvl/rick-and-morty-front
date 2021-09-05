import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { submitRegister } from './registerAPI';
import { History } from 'history';

export interface RegisterState {
    error: string | null;
    in_progress: boolean;
}

interface RegisterData {
    nick: string;
    pwd: string;
    check: string;
    history: History;
}

const initialState: RegisterState = {
    error: null,
    in_progress: false,
};

export const submit = createAsyncThunk(
    'REGISTER/SUBMIT',
    async ({ nick, pwd, check, history }: RegisterData, thunkAPI) => {
        try {

            const { state } = await submitRegister(nick, pwd, check);

            if (state)
                history.push("/");

            return true;
            
        } catch (err) {

            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const registerSlice = createSlice({
    name: 'register',
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

export const { clean } = registerSlice.actions;
export default registerSlice.reducer;
