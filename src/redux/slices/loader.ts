import { AppState } from "@reduxStore/index";
import { createSlice } from "@reduxjs/toolkit";

export interface Loader {
    loader: string | boolean;
}

const initialState: Loader = {
    loader: null,
};

export const loader = createSlice({
    name: "loader",
    initialState,
    reducers: {
        toggleLoader(state, action) {
            state.loader = action.payload;
        },
    },
});

export const { toggleLoader } = loader.actions;

export const getLoaderState = (state: AppState) => state.loader?.loader;