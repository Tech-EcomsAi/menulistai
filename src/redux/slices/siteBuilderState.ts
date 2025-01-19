import { createSlice, current } from "@reduxjs/toolkit";
import { TEMPLATE_TYPE } from "@template/websiteBuilderDashboard/templateConstants";
import { isSameObjects } from "@util/utils";
import defaultSiteConfig from "src/data/defaultSiteConfig";
import { AppState } from "../store";
// import { HYDRATE } from "next-redux-wrapper";
// const HYDRATE_ACTION = createAction(HYDRATE)

export type BuilderSidebarPanelAction = {
    activeAction: null | "EDITOR" | "REDESIGN"
}

export type BuilderContextType = {
    editorMode: boolean,
    canvasMode: boolean,
    state: {
        "previousScale": number,
        "scale": number,
        "positionX": number,
        "positionY": number,
    },
    deviceType: "All" | "Mobile" | "Desktop";
}

export type ColorPalletType = { background: string, text: string, primary: string }

export type ColorVariablesType = {
    "--color_primary"?: string,
    "--color_primary_contrast"?: string
    "--color_background"?: string,
    "--color_surface"?: string,
    "--color_text"?: string,
    "--color_paragraph"?: string,
}
export type TextStylesType = {
    h1: any,
    h2: any,
    h3: any,
    h4: any,
    h5: any,
    h6: any,
    p: any,
}

export type BackgroundType = {
    type?: string,//Color/Gradient/image
    value?: any,
    opacity?: any,
    src?: any,
    colorVariable?: string,
}
export type ActiveTemplateConfigType = {
    id: any,
    version: string,
    name: string,
    createdOn: string,
    modifiedOn: string,
    logo: {
        type: string,
        value: any
    },
    background: BackgroundType,
    colors: any[],
    style: any,
    colorVariables: ColorVariablesType,
    textStyles: TextStylesType,
    templateState: { ["default"]: [] }
    //site ref https://colorhunt.co/palettes/neon
}

export type BuilderHistoryType = {
    state: any[],
    currentIndex: number,
    updating: boolean
}

export interface BuilderStateType {
    builderContext: BuilderContextType;
    builderSidebarPanelAction: BuilderSidebarPanelAction;
    activeTemplate: TEMPLATE_TYPE;
    activeTemplateConfig: ActiveTemplateConfigType;
    builderState: any;
    builderHistory: BuilderHistoryType,
    activeLayer: any,
    activeHoverComponent: any,
    savedState: any
}

export const builderInitialState: BuilderStateType = {
    builderContext: {
        canvasMode: true,
        editorMode: true,
        deviceType: "Mobile",
        state: { positionX: 0, positionY: 0, previousScale: 0, scale: 0 }
    },
    builderSidebarPanelAction: null,
    activeTemplate: null,
    activeTemplateConfig: defaultSiteConfig,
    builderState: { ["default"]: [] },
    builderHistory: {
        state: [],
        currentIndex: 0,
        updating: false
    },
    activeLayer: null,
    activeHoverComponent: null,
    savedState: { ["default"]: [] }
};

export const builderState = createSlice({
    name: "builderState",
    initialState: builderInitialState,
    reducers: {
        updateBuilderContext(state, action) {
            if (!isSameObjects(current(state).builderContext, action.payload)) {
                state.builderContext = action.payload;
            }
        },
        updateBuilderSidebarPanelAction(state, action) {
            if (!isSameObjects(current(state).builderSidebarPanelAction, action.payload)) {
                state.builderSidebarPanelAction = action.payload;
            }
        },
        updateActiveTemplate(state, action) {
            if (!isSameObjects(current(state).activeTemplate, action.payload)) {
                state.activeTemplate = action.payload;
            }
        },
        updateActiveTemplateConfig(state, action) {
            if (!isSameObjects(current(state).activeTemplateConfig, action.payload)) {
                state.activeTemplateConfig = action.payload;
            }
        },
        updateBuilderState(state, action) {
            if (!isSameObjects(current(state).builderState, action.payload)) {
                state.builderState = action.payload;
            }
        },
        updateBuilderHistory(state, action) {
            state.builderHistory = action.payload;
        },
        updateBuilderActiveLayer(state, action) {
            state.activeLayer = action.payload;
        },
        updateBuilderActiveHoverComponent(state, action) {
            state.activeHoverComponent = action.payload;
        },
        updateBuilderSavedState(state, action) {
            state.savedState = action.payload;
        },
    },
});

const {
    updateBuilderState,
    updateBuilderHistory,
    updateBuilderSidebarPanelAction,
    updateBuilderContext,
    updateActiveTemplateConfig,
    updateActiveTemplate,
    updateBuilderActiveLayer,
    updateBuilderActiveHoverComponent,
    updateBuilderSavedState
} = builderState.actions;

const getBuilderContext = (state: AppState) => state.builderState?.builderContext || builderInitialState.builderContext;
const getBuilderSidebarPanelAction = (state: AppState) => state.builderState?.builderSidebarPanelAction || builderInitialState.builderSidebarPanelAction;
const getActiveTemplate = (state: AppState) => state.builderState?.activeTemplate || builderInitialState.activeTemplate;
const getActiveTemplateConfig = (state: AppState) => state.builderState?.activeTemplateConfig || builderInitialState.activeTemplateConfig;
const getBuilderState = (state: AppState) => state.builderState?.builderState || builderInitialState.builderState;
const getBuilderHistory = (state: AppState) => state.builderState?.builderHistory || builderInitialState.builderHistory;
const getBuilderActiveLayer = (state: AppState) => state.builderState?.activeLayer || builderInitialState.activeLayer;
const getBuilderActiveHoverComponent = (state: AppState) => state.builderState?.activeHoverComponent || builderInitialState.activeHoverComponent;
const getBuilderSavedState = (state: AppState) => state.builderState?.savedState || builderInitialState.savedState;

export {
    getActiveTemplate,
    getActiveTemplateConfig,
    getBuilderActiveHoverComponent,
    getBuilderActiveLayer,
    getBuilderContext,
    getBuilderHistory,
    getBuilderSavedState,
    getBuilderSidebarPanelAction,
    getBuilderState, updateActiveTemplate,
    updateActiveTemplateConfig,
    updateBuilderActiveHoverComponent,
    updateBuilderActiveLayer,
    updateBuilderContext,
    updateBuilderHistory,
    updateBuilderSavedState,
    updateBuilderSidebarPanelAction,
    updateBuilderState
};

