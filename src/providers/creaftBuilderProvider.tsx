'use client'

import { CraftBuilderContextType } from '@type/craftBuilderContextType';
import { createContext, useEffect, useState } from 'react';

const InititalState: CraftBuilderContextType = {
    canvas: null,
    updateLocalCanvas: null,
    activeObjectsState: null,
    activeEditorTab: null,
    workspace: null,
    currentPage: '',
    templateDetails: null,
    setTemplateDetails: null,
    saveTemplateToDatabase: null,
    drawingTool: {
        brushType: "",
        isDrawingMode: true,
        lineWidth: 0,
        lineColor: '#0000',
        shadowWidth: 0,
        shadowColor: '#0000',
        shadowOffset: 0
    },
    updateDrawingMode: null,
    onChangeLeftNavTab: null
}

export const CraftBuilderContext = createContext<CraftBuilderContextType>(InititalState)

function CraftBuilderContextProvider({ children, contextData }: { children: any, contextData: CraftBuilderContextType }) {
    const [contextState, setContextState] = useState(contextData)

    useEffect(() => {
        setContextState(contextData)
    }, [contextData])

    return (
        <CraftBuilderContext.Provider value={contextState}>
            {children}
        </CraftBuilderContext.Provider>
    )
}

export default CraftBuilderContextProvider