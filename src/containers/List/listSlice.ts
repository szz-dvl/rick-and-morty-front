import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPage, fetchFavorites, favorite, unfavorite } from './listAPI';
import { Character } from "../../types";
import { RootState } from '../../app/store';

export const PAGES_TO_KEEP = 3;
export const PAGE_SIZE = 20;
export interface ListState {
    characters: Character[];
    favorites: number[];
    index: number[];
    initialised: boolean;
    fetching: number;
    hasNext: boolean;
}

const initialState: ListState = {
    characters: [],
    favorites: [],
    index: [1],
    initialised: false,
    fetching: 0,
    hasNext: true,
};

export const fetch = createAsyncThunk(
    'LIST/FETCH',
    async (page: number, thunkAPI) => {
        try {

            const state = thunkAPI.getState() as RootState;

            if (!state.list.index.includes(page)) {

                const direction = page > state.list.index[state.list.index.length - 1];

                if ((page >= 1 && !direction) || (state.list.hasNext && direction)) {

                    const { characters, hasNext } = await fetchPage(page);
                    return { characters, page, hasNext };

                } else return thunkAPI.rejectWithValue("Bad page");    

            } else return thunkAPI.rejectWithValue("Fetching");
            
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

//https://github.com/reduxjs/redux-toolkit/issues/489
export const _init = createAsyncThunk(
    'LIST/INIT',
    async (dummy: any, thunkAPI) => {
        try {

            const { characters } = await fetchPage(1);
            const { favorites } = await fetchFavorites();

            return { characters, favorites };

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const init = (dummy: any = {}) => _init(dummy);

export const fav = createAsyncThunk(
    'USER/FAVORITE',
    async (id: number, thunkAPI) => {
        try {

            const { favorites } = await favorite(id);
            return favorites;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const unfav = createAsyncThunk(
    'USER/UNFAVORITE',
    async (id: number, thunkAPI) => {
        try {

            const { favorites } = await unfavorite(id);
            return favorites;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        unmount: (state) => {
            state.favorites = [];
            state.characters = [];
            state.initialised = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch.pending, (state, action) => {
                if (!state.fetching)
                    state.fetching = action.meta.arg;
            })
            .addCase(fetch.rejected, (state, action) => {
                state.fetching = 0;
            })
            .addCase(fetch.fulfilled, (state, action) => {
                const { characters, page, hasNext } = action.payload;
                const direction = page > state.index[state.index.length - 1];

                if (direction) {

                    /** Scrolling down */

                    const newCharacters = [...state.characters, ...characters];

                    if (newCharacters.length > PAGES_TO_KEEP * PAGE_SIZE) {
                        state.index = state.index.slice(1);
                        state.characters = newCharacters.slice(newCharacters.length - PAGES_TO_KEEP * PAGE_SIZE);
                    } else
                        state.characters = newCharacters;

                    state.index = [...state.index, page];

                } else {

                    /** Scrolling up */

                    const newCharacters = [...characters, ...state.characters];

                    if (newCharacters.length > PAGES_TO_KEEP * PAGE_SIZE) {
                        state.index = state.index.slice(0, -1);
                        state.characters = newCharacters.slice(0, PAGES_TO_KEEP * PAGE_SIZE);
                    } else
                        state.characters = newCharacters;

                    state.index = [page, ...state.index];
                }

                if (!state.hasNext) {

                    /** Quick fix to avoid repeated elements for not complete pages */

                    state.characters = state.characters.filter((character, idx, array) => {
                        return array.findIndex(c => c.id === character.id) === idx;
                    })
                }

                state.fetching = 0;
                state.hasNext = hasNext;

                //console.log(state.characters.map(c => c.id), state.index);
            })
            .addCase(_init.fulfilled, (state, action) => {
                const { characters, favorites } = action.payload;
                state.favorites = favorites;
                state.characters = characters;
                state.initialised = true;
            })
            .addCase(fav.fulfilled, (state, action) => {
                state.favorites = action.payload;
            })
            .addCase(unfav.fulfilled, (state, action) => {
                state.favorites = action.payload;
            });
    },
});

export const { unmount } = listSlice.actions;
export default listSlice.reducer;
