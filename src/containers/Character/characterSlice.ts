import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCharacter, favorite, unfavorite, fetchEpisodes } from './characterAPI';
import { Character, Episode } from '../../types';

export interface CharacterState {
    error: string | null;
    in_progress: boolean;
    character: Character | null;
    isFav: boolean;
    episodes: Episode[]
}

const initialState: CharacterState = {
    error: null,
    in_progress: false,
    character: null,
    isFav: false,
    episodes: []
};

export const fetch = createAsyncThunk(
    'CHARACTER/FETCH',
    async (id: number, thunkAPI) => {
        try {

            const { character, isFav, status } = await fetchCharacter(id);

            if (status === 200) {
                
                const episodes = await fetchEpisodes(character.episode.map((url) => {
                    return parseInt(url.split('/').pop() as string);
                }));
    
                return { character, episodes, isFav };

            } else {
                return thunkAPI.rejectWithValue(status);
            }
            
            
        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
);

export const fav = createAsyncThunk(
    'USER/FAVORITE/SINGLE',
    async (id: number, thunkAPI) => {
        try {

            await favorite(id);
            return true;

        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
        }
    }
);

export const unfav = createAsyncThunk(
    'USER/UNFAVORITE/SINGLE',
    async (id: number, thunkAPI) => {
        try {

            await unfavorite(id);
            return false;

        } catch (err) {
            return thunkAPI.rejectWithValue((err as Error).message);
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
            state.episodes = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state) => {
                state.error = null;
                state.in_progress = true;
            })
            .addCase(fetch.fulfilled, (state, action) => {

                const { character, isFav, episodes } = action.payload;

                state.in_progress = false;
                state.character = character;
                state.isFav = isFav;
                state.episodes = episodes;
            })
            .addCase(fetch.rejected, (state, action) => {
                let error = action.payload as string;

                state.in_progress = false;
                state.error = error;
            })
            .addCase(fav.fulfilled, (state, action) => {
                state.isFav = action.payload;
            })
            .addCase(unfav.fulfilled, (state, action) => {
                state.isFav = action.payload;
            });
    },
});

export const { clean } = characterSlice.actions;
export default characterSlice.reducer;