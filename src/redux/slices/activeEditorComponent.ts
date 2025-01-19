import { createSlice, current } from "@reduxjs/toolkit";
import { isSameObjects, removeObjRef } from "@util/utils";
import { AppState } from "../store";
// import { HYDRATE } from "next-redux-wrapper";
// const HYDRATE_ACTION = createAction(HYDRATE)

export interface ActiveEditorComponent {
    activeEditorComponent: any;
}

export const activeEditorComponentInitialState: ActiveEditorComponent = {
    activeEditorComponent: { originalState: null, uid: '' },
};

export const activeEditorComponent = createSlice({
    name: "activeEditorComponent",
    initialState: activeEditorComponentInitialState,
    reducers: {
        updateActiveEditorComponent(state, action) {
            if (!isSameObjects(current(state).activeEditorComponent, action.payload)) {
                state.activeEditorComponent = action.payload ? removeObjRef(action.payload) : activeEditorComponentInitialState.activeEditorComponent;
            }
        },
    },
});

export const { updateActiveEditorComponent } = activeEditorComponent.actions;

export const getActiveEditorComponent = (state: AppState) => state.activeEditorComponent?.activeEditorComponent || activeEditorComponentInitialState.activeEditorComponent;