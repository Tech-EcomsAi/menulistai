'use client';
import { ECOMSAI_PLATFORM_USER_ROLE } from '@constant/user';
import { getStoreById } from '@database/stores';
import { getTenantById } from '@database/tenants';
import { getUsersByStoreId } from '@database/users';
import { StoreDataType } from '@type/platform/store';
import { TenantDataType } from '@type/platform/tenant';
import resolvePermissions from '@util/store/permissions';
import { objectNullCheck, removeObjRef } from '@util/utils';
import { Session } from 'next-auth';
import { SessionProvider as Provider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import PlatformGlobalDataProvider from './platformProviders/platformGlobalDataProvider';

type Props = {
    children: React.ReactNode;
    session: Session | null;
}

export default function SessionProvider({ children, session }: Props) {

    // Define the initial state for tenant details
    const [tenantDetails, setTenantDetails] = useState<TenantDataType>(null)

    // Define the initial state for store details
    const [storeDetails, setStoreDetails] = useState<StoreDataType>(null)

    const [userPermissions, setUserPermissions] = useState<any>(null)

    const [usersList, setUsersList] = useState<any>(null)

    // Use the useEffect hook to fetch store details when the session changes
    useEffect(() => {
        console.log("session inside SessionProvider", session)
        // Check if the session exists and store details have not been fetched yet
        if (session && (session.user?.platformRole == ECOMSAI_PLATFORM_USER_ROLE ? true : Boolean(session.user?.storeId)) && !Boolean(storeDetails?.storeId)) {

            // Fetch tenant details by tenant ID
            getTenantById(session.user.tenantId).then((fetchedTenant: TenantDataType) => {
                // Fetch store details by store ID
                getStoreById(session.user.storeId).then(async (fetchedStore: StoreDataType) => {
                    // Update the tenant details state with the fetched fetchedTenant
                    const storeIndex = fetchedTenant.storesList.findIndex((s) => s.storeId == session.user.storeId);
                    fetchedTenant.storesList[storeIndex].storeDetails = removeObjRef(fetchedStore)
                    setTenantDetails(fetchedTenant);

                    // Update the store details state with the fetched fetchedStore
                    console.log("storeDetails fetched inside SessionProvider", fetchedStore)
                    setStoreDetails(fetchedStore);

                    const users = await getUsersByStoreId(session.user.storeId);
                    setUsersList(removeObjRef(users))
                })
            })

        }
    }, [session]) // Re-run the effect when the session changes

    useEffect(() => {
        if (objectNullCheck(storeDetails)) {

            const rolesPermissions = [];

            const roles = session.user.stores ? session.user.stores?.find((store: any) => store.storeId === session.user.storeId)?.roles : [];
            roles.map((role: any) => {
                rolesPermissions.push(storeDetails.roles.find((r: any) => r.id === role))
            })
            const finalPermissions = resolvePermissions(rolesPermissions, storeDetails.rolesPermissionStrategy)
            Object.keys(finalPermissions).forEach(group => {
                Object.keys(finalPermissions[group]).forEach(permission => {
                    if (!Boolean(finalPermissions[group][permission])) delete finalPermissions[group][permission]
                })
            })
            console.log("finalPermissions fetched inside SessionProvider", finalPermissions)
            setUserPermissions(finalPermissions)
        }
    }, [storeDetails])


    return (
        <Provider session={session}>
            <PlatformGlobalDataProvider contextData={{
                tenantDetails,
                setTenantDetails,
                storeDetails,
                setStoreDetails,
                userPermissions,
                setUserPermissions,
                usersList,
                setUsersList
            }}>
                {children}
            </PlatformGlobalDataProvider>
        </Provider>
    )
}