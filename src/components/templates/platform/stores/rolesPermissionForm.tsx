import Saperator from "@atoms/Saperator";
import { RolesPermissionsConfig, SamplePermissionData } from "@data/rolesPermissionsInitialData";
import { removeObjRef } from "@util/utils";
import { Checkbox, Flex, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
const { Text } = Typography;
function RolesPermissionForm({ userPermissions, updatePermissions }) {

    const [rolesPermissionsConfig, setRolesPermissionsConfig] = useState(removeObjRef(RolesPermissionsConfig))
    const [selectAllOptions, setSelectAllOptions] = useState(SamplePermissionData)
    useEffect(() => {
        const configCopy = removeObjRef(RolesPermissionsConfig);
        configCopy.map((roleGroup) => {
            roleGroup.permissions = removeObjRef(userPermissions[roleGroup.key])
        })
        setRolesPermissionsConfig(configCopy)
    }, [userPermissions])

    const onChangeValue = (key, permission, value) => {

        const newPermissions = removeObjRef(userPermissions);

        if (key === "All") {
            Object.keys(newPermissions).map((pKey) => {
                newPermissions[pKey][permission] = value
            })
            setSelectAllOptions({ ...selectAllOptions, [permission]: value })
        } else {
            newPermissions[key][permission] = value
        }
        updatePermissions(newPermissions)
    }

    const renderPermissionInput = (permission, active, onChange) => {
        return <Flex gap={10} align="center" justify="flex-start" style={{ width: 90 }}>
            <Checkbox style={{ width: 90 }} defaultChecked={active} checked={active} onChange={onChange}>
                {permission}
            </Checkbox>
        </Flex>
    }
    return (
        <Flex vertical gap={20}>
            <Text>Permissions you may use and assign to your users.</Text>

            <Flex vertical gap={20}>
                <Flex justify="space-between">
                    <Text>Full Access</Text>
                    <Flex gap={10} wrap="wrap">
                        {Object.keys(selectAllOptions).map((permission, index) => {
                            return <Fragment key={index}>
                                {renderPermissionInput(permission, selectAllOptions[permission], () => onChangeValue("All", permission, !Boolean(selectAllOptions[permission])))}
                            </Fragment>
                        })}
                    </Flex>
                </Flex>
                <Saperator margin="0 0 0" />
                {rolesPermissionsConfig.map((roleGroup, groupIndex) => {
                    return <Fragment key={groupIndex}>
                        <Flex justify="space-between">
                            <Text>{roleGroup.groupName}</Text>
                            <Flex gap={10} wrap="wrap">
                                {Object.keys(selectAllOptions).map((permission, index) => {
                                    return <Fragment key={index}>
                                        {renderPermissionInput(permission, roleGroup.permissions[permission], () => onChangeValue(roleGroup.key, permission, !Boolean(selectAllOptions[permission])))}
                                    </Fragment>
                                })}
                            </Flex>
                        </Flex>
                    </Fragment>

                })}
            </Flex>
        </Flex>
    )
}

export default RolesPermissionForm