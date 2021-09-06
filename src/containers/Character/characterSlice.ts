import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCharacter, favorite, unfavorite } from './characterAPI';
import { Character } from '../../types';

export interface CharacterState {
    error: string | null;
    in_progress: boolean;
    character: Character | null;
    isFav: boolean;
}

const initialState: CharacterState = {
    error: null,
    in_progress: false,
    character: null,
    isFav: false
};

export const fetch = createAsyncThunk(
    'REGISTER/SUBMIT',
    async (id: number, thunkAPI) => {
        try {

            return await fetchCharacter(id);
            
        } catch (err) {

            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const fav = createAsyncThunk(
    'USER/FAVORITE',
    async (id: number, thunkAPI) => {
        try {

            await favorite(id);
            return true;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const unfav = createAsyncThunk(
    'USER/UNFAVORITE',
    async (id: number, thunkAPI) => {
        try {

            await unfavorite(id);
            return false;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const characterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {
        clean: (state) => {
            state.error = null;
            state.character = null;
            state.isFav = false;
            state.in_progress = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.error = null;
                state.in_progress = true;
            })
            .addCase(fetch.fulfilled, (state, action) => {

                const { character, isFav } = action.payload;

                state.in_progress = false;
                state.character = character;
                state.isFav = isFav;
            })
            .addCase(fetch.rejected, (state, action) => {
                let error = action.payload as string;

                state.in_progress = false;
                state.error = error;
            }).addCase(fav.fulfilled, (state, action) => {
                state.isFav = action.payload;
            }).addCase(unfav.fulfilled, (state, action) => {
                state.isFav = action.payload;
            });
    },
});

export const { clean } = characterSlice.actions;
export default characterSlice.reducer;