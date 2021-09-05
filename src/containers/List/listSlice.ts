import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPage } from './listAPI';
import { Character } from "../../types";

export interface ListState {
    characters: Character[];
    page: number;
}

const initialState: ListState = {
    characters: [],
    page: 1
};

export const fetch = createAsyncThunk(
    'LIST/FETCH',
    async ( page: number, thunkAPI) => {
        try {

            const characters = await fetchPage(page);
            return { characters, page };

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetch.fulfilled, (state, action) => {
                const { characters, page } = action.payload;
                state.characters = [ ...state.characters, ...characters];
                state.page = page;
            });
    },
});


export default listSlice.reducer;
