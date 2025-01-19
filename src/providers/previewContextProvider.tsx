'use client'

import { PreviewBuilderContextType } from '@type/previewContextType';
import { createContext, useState } from 'react';

const InititalState: PreviewBuilderContextType = { data: { darkMode: true, deviceType: "Desktop", fromPage: "", reloadInProgress: false }, updater: null }

export const PreviewBuilderContext = createContext<PreviewBuilderContextType>(InititalState)

function PreviewContextProvider({ children, fromPage }) {
    const [contextState, setContextState] = useState(InititalState)

    return (

        <PreviewBuilderContext.Provider value={{ data: { ...contextState.data, fromPage }, updater: setContextState }}>
            {children}
        </PreviewBuilderContext.Provider>
    )
}

export default PreviewContextProvider