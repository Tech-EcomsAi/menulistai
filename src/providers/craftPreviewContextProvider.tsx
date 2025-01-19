'use client'

import { createContext, useEffect, useState } from 'react';

type CraftPreviewContextType = { activeModal: boolean, template: any, setActiveModal: any }

const InititalState: CraftPreviewContextType = {
    activeModal: false,
    template: null,
    setActiveModal: () => { }
}

export const CraftPreviewContext = createContext<CraftPreviewContextType>(InititalState)

function CraftPreviewContextProvider({ children, contextData }: { children: any, contextData: CraftPreviewContextType }) {
    const [contextState, setContextState] = useState(contextData)

    useEffect(() => {
        setContextState(contextData)
    }, [contextData])

    return (
        <CraftPreviewContext.Provider value={contextState}>
            {children}
        </CraftPreviewContext.Provider>
    )
}

export default CraftPreviewContextProvider