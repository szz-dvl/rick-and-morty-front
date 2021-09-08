import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPage, fetchFavorites, favorite, unfavorite } from './listAPI';
import { Character } from "../../types";
import { RootState } from '../../app/store';

export enum Modes {
    SM = 1,
    M,
    L,
    XL
}

export enum Direction {
    UP = -1,
    DOWN = 1
}

export const PAGES_TO_KEEP = 3;
export const PAGE_SIZE = 20;
export interface ListState {
    characters: (Character|null)[];
    favorites: number[];
    index: number[];
    initialised: boolean;
    fetching: number;
    cols: Modes;
    maxPages: number;
}

const initialState: ListState = {
    characters: [],
    favorites: [],
    index: [],
    initialised: false,
    fetching: 0,
    cols: Modes.XL,
    maxPages: 0
};

export const fetch = createAsyncThunk(
    'LIST/FETCH',
    async (direction: Direction, thunkAPI) => {
        try {

            const state = thunkAPI.getState() as RootState;
            const page = direction < 0 ? state.list.index[0] - 1 : direction > 0 ? state.list.index[state.list.index.length - 1] + 1 : -1;

            if (page >= 0) {

                const target = page < 1 ? state.list.maxPages : page > state.list.maxPages ? 1 : page;

                if (!state.list.index.includes(page)) {

                    const { characters } = await fetchPage(target);
                    return { characters, page: target, direction };

                } else return thunkAPI.rejectWithValue("Already in view");

            } else return thunkAPI.rejectWithValue("Bad direction");

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const init = createAsyncThunk(
    'LIST/INIT',
    async (initPage: number, thunkAPI) => {
        try {

            const { characters, maxPages } = await fetchPage(initPage);
            const { favorites } = await fetchFavorites();

            return { characters, favorites, page: initPage, maxPages };

        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

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
            state.index = [];
            state.initialised = false;
            state.maxPages = 0;
            state.fetching = 0;
        },
        setCols: (state, action) => {

            const { cols, user } = action.payload;

            if (user)
                state.cols = cols;
            else if (state.cols > cols)
                state.cols = cols;
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
                const { characters, page, direction } = action.payload;

                /** Quick fix to avoid repeated elements for not complete pages */
                if (characters.length !== PAGE_SIZE)
                    (characters as (Character|null)[]).push.apply(characters, Array.from({ length: PAGE_SIZE - characters.length }, (v, i) => null));

                if (direction > 0) {

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

                state.fetching = 0;
                console.log(state.characters.map(c => c ? c.id : ""), state.index);
            })
            .addCase(init.fulfilled, (state, action) => {
                const { characters, favorites, page, maxPages } = action.payload;
                state.favorites = favorites;
                state.characters = characters;
                state.initialised = true;
                state.maxPages = maxPages;
                state.index.push(page);
            })
            .addCase(fav.fulfilled, (state, action) => {
                state.favorites = action.payload;
            })
            .addCase(unfav.fulfilled, (state, action) => {
                state.favorites = action.payload;
            });
    },
});

export const { unmount, setCols } = listSlice.actions;
export default listSlice.reducer;
