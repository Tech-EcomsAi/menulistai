'use client'

import TextElement from "@antdComponent/textElement";
import { ROLES_PERMISSIONS_STRATEGIES_LIST, SamplePermissionData } from "@data/rolesPermissionsInitialData";
import { updateStore } from "@database/stores";
import { useAppDispatch } from "@hook/useAppDispatch";
import EditorWrapper from "@organisms/editor/editorWrapper";
import { PlatformGlobalDataContext, PlatformGlobalDataProviderType } from "@providers/platformProviders/platformGlobalDataProvider";
import { showSuccessToast } from "@reduxSlices/toast";
import { StoreRoleDataType } from "@type/platform/roles";
import { arrayNullCheck, objectNullCheck } from "@util/utils";
import { Button, Card, Divider, Flex, Popconfirm, Space, Tag, theme } from "antd";
import { Fragment, useContext, useState } from "react";
import { LuCheck, LuPen, LuPlus, LuX } from "react-icons/lu";
import RoleDetailsModal from "./roleDetailsModal";
const { Meta } = Card
function UserPermissionsPage() {

    const [activeRole, setActiveRole] = useState<StoreRoleDataType>(null);
    const { storeDetails, setStoreDetails } = useContext<PlatformGlobalDataProviderType>(PlatformGlobalDataContext)
    const [showDetailsModal, setShowDetailsModal] = useState({ active: false, data: null })
    const dispatch = useAppDispatch()
    const { token } = theme.useToken();

    const onCloseRoleModal = (storeData) => {
        if (storeData?.roles && activeRole?.id) {
            let ind = storeData.roles.findIndex((u) => u.id == activeRole.id)
            if (ind != -1) setActiveRole(storeData.roles[ind])
        }
        setShowDetailsModal({ active: false, data: null })
    }

    const onChangeStrategy = (value) => {
        console.log('radio checked', value);
        updateStore({ rolesPermissionStrategy: value, storeId: storeDetails.storeId }).then((saved) => {
            setStoreDetails({ ...storeDetails, rolesPermissionStrategy: value })
            dispatch(showSuccessToast("Permissions strategy updated successfully"))
        })
    };

    return (
        <Flex vertical gap={30}>

            <Space direction="vertical" size={2}>
                <TextElement size='heading' text="Roles & Permissions" type='primary' />
                <TextElement text="A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he need" />
            </Space>

            <Card>
                <EditorWrapper gap={30}>

                    <Flex vertical gap={10}>
                        <TextElement size={"medium"} text={"Available Roles List"} />
                        {arrayNullCheck(storeDetails?.roles) && <TextElement size={"small"} text={`Please select any of role to view permissions associated with it`} />}
                        <Flex wrap="wrap" gap={10}>
                            {storeDetails?.roles?.map((role, index) => {
                                return <Fragment key={index}>
                                    <Card hoverable style={{ width: 300, outline: activeRole?.id == role?.id ? "1px solid green" : "unset" }} key={index} onClick={() => setActiveRole(role)}>
                                        <Meta title={role.name} description={role.description} />
                                    </Card>
                                </Fragment>
                            })}

                            <Divider type="vertical" style={{ height: "auto" }} />

                            <Card hoverable style={{ width: 200, display: "flex", justifyContent: "center", alignItems: "center" }}
                                onClick={() => {
                                    setActiveRole(null);
                                    setShowDetailsModal({ active: true, data: null })
                                }}>
                                <Meta title="Add New Role" avatar={<LuPlus />} />
                            </Card>

                        </Flex>
                    </Flex>

                    <Flex vertical gap={10}>
                        <TextElement size={"medium"} text={"Permissions Strategy (Used in case of multiple roles assigned to a user)"} />
                        <Flex wrap="wrap" gap={10}>
                            {ROLES_PERMISSIONS_STRATEGIES_LIST.map((u, i) => {
                                const selected = u?.value == storeDetails?.rolesPermissionStrategy;
                                return <Fragment key={i}>
                                    <Popconfirm
                                        okText="Yes"
                                        cancelText="No"
                                        title="Update Strategy"
                                        description="Are you sure you want to update strategy?"
                                        onConfirm={(e) => onChangeStrategy(u.value)}
                                    >
                                        <Card hoverable style={{ width: "max-content", outline: u?.value == storeDetails?.rolesPermissionStrategy ? `2px solid ${token.colorPrimary}` : "unset" }}>
                                            <Meta title={`${u.lable}${selected ? ' (Current)' : ''}`} description={u.description} avatar={u.value == storeDetails?.rolesPermissionStrategy ? "✅" : <></>} />
                                        </Card>
                                    </Popconfirm>
                                </Fragment>
                            })}
                        </Flex>
                    </Flex>

                    {objectNullCheck(activeRole) && <Flex vertical gap={10}>
                        <Card style={{ width: "100%" }} title={`Showing ${activeRole.name} Role Details`} extra={<Button type="primary" icon={<LuPen />} onClick={() => setShowDetailsModal({ active: true, data: activeRole })}>Edit Role</Button>}>
                            <Flex vertical gap={20}>
                                <Meta title={activeRole.description} description={`Last Updated By: ${activeRole.modifiedBy}`} />

                                <Flex gap={10} align="center">
                                    <Meta style={{ width: 90 }} title={""} />
                                    <Flex gap={10}>
                                        {Object.keys(SamplePermissionData).map((permission, index) => {
                                            return <Fragment key={index}>
                                                <Tag style={{ width: 60, fontSize: 14, padding: 4, display: "flex", justifyContent: "center", alignItems: "center" }} color="processing">{permission}</Tag>
                                            </Fragment>
                                        })}
                                    </Flex>
                                </Flex>

                                {objectNullCheck(activeRole, 'permissions') && (Object.keys(activeRole.permissions)).map((permissionKey, index) => {
                                    return <Fragment key={index}>
                                        <Flex gap={10} align="center">
                                            <Meta style={{ width: 90 }} title={permissionKey} />
                                            <Flex gap={10}>
                                                {Object.keys(SamplePermissionData).map((permission, index) => {
                                                    const isAval = activeRole.permissions[permissionKey][permission];
                                                    return <Fragment key={index}>
                                                        <Tag style={{ width: 60, fontSize: 20, padding: 2, display: "flex", justifyContent: "center", alignItems: "center" }} color={isAval ? 'green' : "error"} icon={isAval ? <LuCheck /> : <LuX />}></Tag>
                                                    </Fragment>
                                                })}
                                            </Flex>
                                        </Flex>
                                    </Fragment>
                                })}
                            </Flex>
                        </Card>
                    </Flex>}
                </EditorWrapper>

                <RoleDetailsModal storeDetails={storeDetails} modalData={showDetailsModal} onClose={onCloseRoleModal} />
            </Card>

        </Flex>
    )
}

export default UserPermissionsPage