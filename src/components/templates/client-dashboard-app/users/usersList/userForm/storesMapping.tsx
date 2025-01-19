import TagElement from '@antdComponent/tagElement';
import FormElementWrapper from '@atoms/formElementWrapper';
import { getStoreById } from '@database/stores';
import { PlatformGlobalDataContext } from '@providers/platformProviders/platformGlobalDataProvider';
import { StoreDataType } from '@type/platform/store';
import { UserDataType } from '@type/platform/user';
import { removeObjRef } from '@util/utils';
import { Button, Card, Empty, Flex, Select, Tag, Typography } from 'antd';
import { Fragment, useContext } from 'react';
import { LuTrash } from 'react-icons/lu';
const { Text } = Typography;

function StoresMapping({ userDetails, onChangeValue }) {

    const { tenantDetails, setTenantDetails } = useContext(PlatformGlobalDataContext)

    const onChangeStoreValue = (index, from, value) => {
        const userCopy: UserDataType = removeObjRef(userDetails);
        userCopy.stores[index][from] = value;
        if (from == "storeId") {
            const storeIndex = tenantDetails?.storesList.findIndex((s) => s.storeId == value);
            const storeDetails = tenantDetails?.storesList[storeIndex];
            userCopy.stores[index].name = storeDetails?.name;
            userCopy.storeIds = Boolean(userCopy.stores?.length) ? userCopy.stores.map((s) => s.storeId) : [];

            if (!userCopy.storeId) {
                userCopy.storeId = value
            }
            if (!Boolean(storeDetails.storeDetails)) {//if storedetails is not fetched then fetch it on run time when user selected the store
                getStoreById(storeDetails.storeId).then((store: StoreDataType) => {
                    tenantDetails.storesList[storeIndex].storeDetails = store;
                    setTenantDetails(removeObjRef(tenantDetails))
                })
            }
        }
        onChangeValue('user', userCopy)
    }

    const onClickDeleteStore = (index) => {
        const userCopy: UserDataType = removeObjRef(userDetails);
        userCopy.stores.splice(index, 1);
        userCopy.storeIds = Boolean(userCopy.stores?.length) ? userCopy.stores.map((s) => s.storeId) : [];
        onChangeValue('user', userCopy)
    }

    const onClickAddStore = () => {
        const userCopy: UserDataType = removeObjRef(userDetails);
        if (!userCopy.stores) userCopy.stores = [];
        userCopy.stores.push({ storeId: null, name: "", roles: [] });
        onChangeValue('user', userCopy)
    }


    return (
        <Flex vertical gap={10}>

            {userDetails?.stores?.length > 1 && <Text style={{ minWidth: 150 }}>Total stores Assigned to User
                {Boolean(userDetails?.stores?.length) && <Tag color='blue'>{userDetails?.stores?.length}</Tag>}
            </Text>}

            {!Boolean(userDetails?.stores?.length) ? <>
                <Empty description="No stores assigned to user" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </> : <>
                {userDetails?.stores?.map((mappedStore, index) => {
                    return <Fragment key={index}>
                        <Card size='small'>
                            <Flex vertical gap={10} key={index}>
                                <Flex>
                                    <Text style={{ minWidth: 100 }}>Store {index + 1}</Text>
                                    <Select
                                        defaultValue={mappedStore?.storeId}
                                        value={mappedStore?.storeId}
                                        style={{ width: "100%" }}
                                        placeholder="Select Store"
                                        onChange={(storeId) => onChangeStoreValue(index, 'storeId', storeId)}
                                        options={tenantDetails?.storesList?.map((s) => ({ label: `${s.storeId}-${s.name}`, value: s.storeId }))}
                                    />
                                </Flex>

                                <FormElementWrapper label="Roles">
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Please select role"
                                        defaultValue={mappedStore?.roles || []}
                                        value={mappedStore?.roles || []}
                                        onChange={(value) => onChangeStoreValue(index, 'roles', value)}
                                        options={(tenantDetails.storesList.find(s => s.storeId == mappedStore?.storeId))?.storeDetails?.roles?.map((role) => ({ label: role.name, value: role.id }))}
                                    />
                                </FormElementWrapper>

                                <Flex justify='flex-end'>
                                    <Button danger type='text' icon={<LuTrash />} onClick={() => onClickDeleteStore(index)}>Delete Store Mapping</Button>
                                </Flex>
                            </Flex>
                        </Card>
                    </Fragment>
                })}
            </>}
            <Flex justify={!Boolean(userDetails?.stores?.length) ? "center" : 'flex-end'}>
                {(tenantDetails?.storesList?.length > 1 && tenantDetails?.storesList.length != userDetails?.stores?.length) && <Button type="primary" ghost onClick={onClickAddStore}>Add Store</Button>}
            </Flex>

            {Boolean(userDetails?.stores?.length) && userDetails?.stores?.length > 1 && <>
                <Card >
                    <Flex vertical gap={10}>
                        <Flex>
                            <Text style={{ minWidth: 150 }}>Default Store</Text>
                            <Select
                                defaultValue={userDetails?.storeId}
                                value={userDetails?.storeId}
                                style={{ width: "100%" }}
                                placeholder="Select Default Store"
                                onChange={(storeId) => onChangeValue('storeId', storeId)}
                                options={userDetails?.stores?.map((s) => ({ label: s.name, value: s.storeId }))}
                            />
                        </Flex>
                        <TagElement type='default' content="Default store used when user loggedin then user will be redirected to default store" />
                    </Flex>
                </Card>
            </>}
        </Flex>
    )
}

export default StoresMapping