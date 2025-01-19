import TagElement from '@antdComponent/tagElement'
import { SamplePermissionData } from '@data/rolesPermissionsInitialData'
import EditorWrapper from '@organisms/editor/editorWrapper'
import { PlatformGlobalDataContext, PlatformGlobalDataProviderType } from '@providers/platformProviders/platformGlobalDataProvider'
import { StoreDataType } from '@type/platform/store'
import { UserDataType } from '@type/platform/user'
import resolvePermissions from '@util/store/permissions'
import { objectNullCheck } from '@util/utils'
import { Empty, Flex, Select, Tag, Typography } from 'antd'
import Meta from 'antd/es/card/Meta'
import { Fragment, useContext, useEffect, useState } from 'react'
import { LuCheck, LuX } from 'react-icons/lu'
const { Text } = Typography;

function AccessPermissions({ userDetails }: { userDetails: UserDataType }) {


    const { storeDetails, tenantDetails } = useContext<PlatformGlobalDataProviderType>(PlatformGlobalDataContext)
    const [permissions, setPermissions] = useState<any>({})
    const [activeStore, setActiveStore] = useState(null)

    useEffect(() => {
        setPermissions({})
        if ((Boolean(storeDetails) && Boolean(userDetails?.stores?.length) && 'storeId' in userDetails)) {

            const store: StoreDataType = tenantDetails.storesList.find((s: any) => s.storeId === (activeStore || userDetails.storeId))?.storeDetails
            if (!store) return

            const roles = userDetails.stores ? userDetails.stores?.find((store: any) => store.storeId === (activeStore || userDetails.storeId))?.roles : [];
            if (!Boolean(roles?.length)) return

            const rolesPermissions = [];
            roles?.map((role: any) => {
                rolesPermissions.push(store.roles.find((r: any) => r.id === role))
            })
            const finalPermissions = rolesPermissions ? resolvePermissions(rolesPermissions, store.rolesPermissionStrategy) : {}
            Object.keys(finalPermissions).forEach(group => {
                Object.keys(finalPermissions[group]).forEach(permission => {
                    if (!Boolean(finalPermissions[group][permission])) delete finalPermissions[group][permission]
                })
            })
            console.log("finalPermissions fetched inside SessionProvider", finalPermissions)
            if (activeStore == null) setActiveStore(userDetails.storeId);
            setPermissions(finalPermissions)
        }
    }, [userDetails, activeStore])

    return (
        <EditorWrapper>
            {Boolean(userDetails?.storeIds?.length) && Object.keys(permissions).length > 0 ? <>
                <Flex vertical gap={20}>

                    {userDetails?.stores?.length > 1 && <Flex>
                        <Text style={{ minWidth: 100 }}>Select Store</Text>
                        <Select
                            defaultValue={activeStore}
                            value={activeStore}
                            style={{ width: "100%" }}
                            placeholder="Select Store"
                            onChange={(storeId) => setActiveStore(storeId)}
                            options={userDetails.stores?.map((s) => ({ label: `${s.storeId}-${s.name}`, value: s.storeId }))}
                        />
                    </Flex>}

                    <Flex gap={10} align="center">
                        <Meta style={{ width: 90 }} title={""} />
                        <Flex gap={10}>
                            {Object.keys(SamplePermissionData).map((permission, index) => {
                                return <Fragment key={index}>
                                    <TagElement type="info" content={permission} />
                                </Fragment>
                            })}
                        </Flex>
                    </Flex>

                    {objectNullCheck('permissions') && (Object.keys(permissions)).map((permissionKey, index) => {
                        return <Fragment key={index}>
                            <Flex gap={10} align="center">
                                <Meta style={{ width: 90 }} title={permissionKey} />
                                <Flex gap={10}>
                                    {Object.keys(SamplePermissionData).map((permission, index) => {
                                        const isAval = permissions[permissionKey][permission];
                                        return <Fragment key={index}>
                                            <Tag style={{ width: 60, fontSize: 20, padding: 2, display: "flex", justifyContent: "center", alignItems: "center" }} color={isAval ? 'green' : "error"} icon={isAval ? <LuCheck /> : <LuX />}></Tag>
                                        </Fragment>
                                    })}
                                </Flex>
                            </Flex>
                        </Fragment>
                    })}
                    <TagElement type='default' content="To change permissions you need to change roles assigned to the user" />
                </Flex>
            </> : <>
                <Empty description="No stores mapped" />
                <TagElement type="warning" content="To view permissions, map at least one store" />
            </>}
        </EditorWrapper>
    )
}

export default AccessPermissions