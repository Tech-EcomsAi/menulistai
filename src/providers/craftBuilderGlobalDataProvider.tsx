'use client'

import { CraftBuilderGlobalDataType } from '@type/craftBuilderContextType';
import { createContext, useEffect, useState } from 'react';

const InititalState: CraftBuilderGlobalDataType = {

    //this data fetched inititally at the time of builder loading in src/components/templates/craftBuilder/index.tsx:16
    brandKit: {
        colors: [],
        logos: [],
        fonts: [],
        assets: []
    },
    setBrandKit: () => { },

    //this data fetched inititally at the time of text component loading in src/components/templates/craftBuilder/tabsComposer/text/textPresets.tsx
    textPresets: [],
    setTextPresets: () => { },

    fontsPresets: [],
    setFontsPresets: () => { },

    illustrationsAssets: [],
    setIllustrationsAssets: () => { },

    charactersAssets: [],
    setCharactersAssets: () => { },

    graphicsAssets: [],
    setGraphicsAssets: () => { },

    iconsAssets: [],
    setIconsAssets: () => { },

    threeDAssets: [],
    setThreeDAssets: () => { },
}

export const CraftBuilderGlobalDataContext = createContext<CraftBuilderGlobalDataType>(InititalState)

function CraftBuilderGlobalDataProvider({ children, contextData }: { children: any, contextData: CraftBuilderGlobalDataType }) {
    const [contextState, setContextState] = useState(contextData)

    useEffect(() => {
        setContextState(contextData)
    }, [contextData])

    return (
        <CraftBuilderGlobalDataContext.Provider value={contextState} >
            {children}
        </CraftBuilderGlobalDataContext.Provider>
    )
}

export default CraftBuilderGlobalDataProvider