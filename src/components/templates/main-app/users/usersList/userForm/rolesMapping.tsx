import FormElementWrapper from "@atoms/formElementWrapper"
import { PlatformGlobalDataContext, PlatformGlobalDataProviderType } from "@providers/platformProviders/platformGlobalDataProvider"
import { UserDataType } from "@type/platform/user"
import { removeObjRef } from "@util/utils"
import { Select } from "antd"
import { useContext } from "react"

function RolesMapping({ userDetails, onChangeValue }) {

    const { storeDetails } = useContext<PlatformGlobalDataProviderType>(PlatformGlobalDataContext)

    const onChangeRoleValue = (from, value) => {
        const userCopy: UserDataType = removeObjRef(userDetails);
        const index = userDetails.stores.findIndex(s => s.storeId == storeDetails?.storeId);
        userCopy.stores[index][from] = value;
        onChangeValue('user', userCopy)
    }

    return (
        <FormElementWrapper label="Roles">
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select role"
                defaultValue={storeDetails?.roles || []}
                value={storeDetails?.roles || []}
                onChange={(value) => onChangeRoleValue('roles', value)}
                options={storeDetails?.roles?.map((role) => ({ label: role.name, value: role.id }))}
            />
        </FormElementWrapper>
    )
}

export default RolesMapping