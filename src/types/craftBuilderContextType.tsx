import { ActiveObjectStateType, BrandKitType, CraftTemplateType, FontPresetsType } from "@template/craftBuilder/types";
import { fabric } from "fabric";

export type DrawingToolType = {
    isDrawingMode: boolean,
    brushType: string,
    lineWidth: number,
    shadowWidth: number,
    shadowColor: string,
    shadowOffset: number,
    lineColor: string,
    decimate?: number,
    defaultText?: string,
    textColor?: string,
    fontSize?: number,
    fontFamily?: string,
}

export type CraftBuilderContextType = {
    canvas: fabric.Canvas,
    updateLocalCanvas: any,
    activeObjectsState: ActiveObjectStateType,
    activeEditorTab: any,
    workspace: fabric.Object,
    currentPage: string,
    saveTemplateToDatabase: any,
    templateDetails: CraftTemplateType,
    setTemplateDetails: any,
    drawingTool: DrawingToolType,
    updateDrawingMode: any,
    onChangeLeftNavTab: any
}

export type CraftBuilderGlobalDataType = {
    //related to brand kit
    brandKit: BrandKitType,
    setBrandKit: any,

    //related to textPresets
    textPresets: any[],
    setTextPresets: any

    //related to fonts
    fontsPresets: FontPresetsType[],
    setFontsPresets: any

    //related to assets
    illustrationsAssets: any[],
    setIllustrationsAssets: any

    //related to characters
    charactersAssets: any[],
    setCharactersAssets: any

    //related to graphics
    graphicsAssets: any[],
    setGraphicsAssets: any

    //related to icons
    iconsAssets: any[],
    setIconsAssets: any

    //related to threeD
    threeDAssets: any[],
    setThreeDAssets: any
}