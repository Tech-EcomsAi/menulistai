'use client'

import { StoreDataType } from '@type/platform/store';
import { TenantDataType } from '@type/platform/tenant';
import { UserDataType } from '@type/platform/user';
import { createContext, useEffect, useState } from 'react';

export type PlatformGlobalDataProviderType = {

    tenantDetails: TenantDataType;
    setTenantDetails: any;

    storeDetails: StoreDataType;
    setStoreDetails: any;

    userPermissions: any;
    setUserPermissions: any;

    usersList: UserDataType[];
    setUsersList: any;
}

const InititalState: PlatformGlobalDataProviderType = {

    tenantDetails: null,
    setTenantDetails: () => { },

    storeDetails: null,
    setStoreDetails: () => { },

    userPermissions: null,
    setUserPermissions: () => { },

    usersList: null,
    setUsersList: () => { },
}

export const PlatformGlobalDataContext = createContext<PlatformGlobalDataProviderType>(InititalState)

function PlatformGlobalDataProvider({ children, contextData }: { children: any, contextData: PlatformGlobalDataProviderType }) {
    const [contextState, setContextState] = useState(contextData)

    useEffect(() => {
        setContextState(contextData)
    }, [contextData])

    return (
        <PlatformGlobalDataContext.Provider value={contextState} >
            {children}
        </PlatformGlobalDataContext.Provider>
    )
}

export default PlatformGlobalDataProvider