'use client'
import DrawerElement from '@antdComponent/drawerElement';
import Saperator from '@atoms/Saperator';
import { CRAFT_BUILDER_MAINTAINER_USER_ROLE, ECOMSAI_PLATFORM_SUPPORT_USER_ROLE, ECOMSAI_PLATFORM_USER_ROLE } from '@constant/user';
import { getAllStoresByTenantId } from '@database/stores';
import { getAllTenants } from '@database/tenants';
import { getAllPlatformUsers, updatePlatformUser } from '@database/users';
import { useAppDispatch } from '@hook/useAppDispatch';
import { firebaseAuth } from '@lib/firebase/firebaseClient';
import { PlatformGlobalDataContext, PlatformGlobalDataProviderType } from '@providers/platformProviders/platformGlobalDataProvider';
import { showSuccessToast, showWarningToast } from '@reduxSlices/toast';
import { TenantDataType } from '@type/platform/tenant';
import { UserDataType } from '@type/platform/user';
import { getObjectDifferance } from '@util/deepMerge';
import { extractUserDataFromFirebaseUser } from '@util/usersUtils';
import { removeObjRef } from '@util/utils';
import { Button, Card, Flex, Select, Switch, Table, Tag, Typography } from 'antd'; // Import Ant Design components
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Fragment, useContext, useEffect, useState } from 'react';
import { LuTrash, LuUser } from 'react-icons/lu';
const { Text } = Typography

function PlatformUsers() {

    const [usersList, setUsersList] = useState([]);
    const [userModal, setUserModal] = useState<UserDataType>(null)
    const [tenantsList, setTenantsList] = useState<TenantDataType[]>([]);
    const dispatch = useAppDispatch()
    const { storeDetails, tenantDetails } = useContext<PlatformGlobalDataProviderType>(PlatformGlobalDataContext);
    const [selectedTenant, setSelectedTenant] = useState<TenantDataType>(tenantDetails);
    console.log("storeDetails in PlatformUsers", storeDetails)

    useEffect(() => {
        getAllTenants().then((tenants) => {
            setTenantsList(tenants)
            console.log("tenants", tenants)
        })
        getAllPlatformUsers().then((users) => {
            setUsersList(users)
            console.log("users", users)
        })
    }, [])

    useEffect(() => {
        if (selectedTenant && !Boolean(selectedTenant?.storesList?.[0]?.storeDetails)) {
            console.log("selectedTenant", selectedTenant)
            getAllStoresByTenantId(selectedTenant?.tenantId).then((stores) => {

                const tenantsListCopy = removeObjRef(tenantsList)
                const storesListCopy = removeObjRef(selectedTenant?.storesList)

                stores.map((store) => {
                    const storeIndex = storesListCopy.findIndex((s) => s.storeId == store?.storeId);
                    storesListCopy[storeIndex].storeDetails = removeObjRef(store);
                })

                const tenantIndex = tenantsListCopy.findIndex((t) => t.tenantId == selectedTenant?.tenantId);
                tenantsListCopy[tenantIndex].storesList = storesListCopy
                setTenantsList(tenantsListCopy)
                setSelectedTenant(removeObjRef(tenantsListCopy[tenantIndex]))
                console.log("stores for tenantId: ", selectedTenant?.tenantId, stores)
            })
        }
    }, [selectedTenant])

    useEffect(() => {
        const auth = firebaseAuth;
        const user = auth.currentUser;
        if (user !== null) {
            // The user object has basic properties such as display name, email, etc.
            // const displayName = user.displayName;
            // const email = user.email;
            // const photoURL = user.photoURL;
            // const emailVerified = user.emailVerified;

            // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            const uid = user.uid;
        }

        console.log("firebaseAuth currentUser", user)

    }, [userModal])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: Math.random(),
            render: (_, record) => (
                <Flex align='center' justify='flex-start' gap={10}>
                    {record?.image ? <img src={record?.image} style={{ width: 50, height: 50, borderRadius: 25 }} /> : <LuUser />}
                    <Text>{record.name}</Text>
                </Flex>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: Math.random(),
        },
        {
            title: 'Status',
            dataIndex: 'isVerified',
            key: Math.random(),
            render: (_, record) => (
                <>
                    {!record.active ? <Tag color='error'>Deactivated</Tag> : <>
                        {record.isVerified ? <Tag color='green'>Verified</Tag> : <Tag color='warning'>Non Verified</Tag>}
                    </>}
                </>
            ),
        },
        {
            title: 'Action',
            key: Math.random(),
            render: (_, record) => (
                <Button type="primary">Edit</Button> // Edit button
            ),
        },
    ];

    const updateUser = (updated) => {
        const originalUser = usersList.find((u) => u.email == updated.email)
        const updatedChanges: any = getObjectDifferance(updated, originalUser);

        // we need to check if the user has multiple store permission or not
        // if the user has multiple store permission then we should update the storeId and stores array
        // else we should remove the storeId and stores array from the updatedChanges object

        const ifUserHasMultipleStorePermission = true;
        if (!Boolean(updated?.stores?.length) && (tenantsList.find((t) => t.tenantId == userModal?.tenantId)?.storesList?.length == 1 || !ifUserHasMultipleStorePermission)) {
            const storesList = tenantsList.find((t) => t.tenantId == userModal?.tenantId)?.storesList;
            updatedChanges.storeIds = [storesList[0].storeId];
            updatedChanges.stores = [{ storeId: storesList[0].storeId, name: storesList[0].name, roles: [] }];
            updatedChanges.storeId = storesList[0].storeId;
        }

        if (Object.keys(updatedChanges).length > 0) {
            updatedChanges.id = originalUser.id;
            updatePlatformUser(updatedChanges).then(() => {
                const usersCopy = removeObjRef(usersList)
                let index = usersCopy.findIndex((u) => u.id == updatedChanges.id)
                usersCopy[index] = { ...originalUser, ...updatedChanges }
                setUsersList(usersCopy)
                setUserModal(null)
                dispatch(showSuccessToast("User updated successfully"))
            })
        } else {
            dispatch(showWarningToast("No changes found"))
        }
    }

    const onVerify = () => {

        createUserWithEmailAndPassword(firebaseAuth, userModal.email, userModal.email)
            .then(async (userCredential) => {
                const firebaseUser = userCredential.user;
                const updatedUser = { ...extractUserDataFromFirebaseUser(firebaseUser), ...userModal, isVerified: true }
                updateUser(updatedUser)
            })
            .catch((err) => {
                if (err.code == 'auth/email-already-in-use') {
                    const updatedUser = { ...userModal, isVerified: true }
                    updateUser(updatedUser)
                }
                console.log(err.code);
                console.log(err.message);
            });
    }

    const onChangeValue = (from, value) => {
        const userCopy: UserDataType = removeObjRef(userModal);
        userCopy[from] = value;
        if (from == "tenantId") {
            userCopy.stores = [];
            const storesList = tenantsList.find((t) => t.tenantId == userCopy?.tenantId)?.storesList;
            setSelectedTenant(tenantsList.find((t) => t.tenantId == userCopy?.tenantId));
            userCopy.storeId = storesList[0].storeId;
            if (storesList.length == 1) {
                userCopy.storeIds = [storesList[0].storeId];
                userCopy.stores = [{ storeId: storesList[0].storeId, name: storesList[0].name, roles: [] }];
            }
        }
        setUserModal(userCopy)
    }

    const onChangeStoreValue = (index, from, value) => {
        const userCopy: UserDataType = removeObjRef(userModal);
        userCopy.stores[index][from] = value;
        if (from == "storeId") {
            const storeDetails = selectedTenant.storesList.find((s) => s.storeId == value);
            userCopy.stores[index].name = storeDetails?.name;
            userCopy.storeIds = Boolean(userCopy.stores?.length) ? userCopy.stores.map((s) => s.storeId) : [];
        }
        setUserModal(userCopy)
    }

    const onClickAddStore = () => {
        const userCopy: UserDataType = removeObjRef(userModal);
        if (!userCopy.stores) userCopy.stores = [];
        userCopy.stores.push({ storeId: null, name: "", roles: [] });
        setUserModal(userCopy)
    }

    const onClickDeleteStore = (index) => {
        const userCopy: UserDataType = removeObjRef(userModal);
        userCopy.stores.splice(index, 1);
        userCopy.storeIds = Boolean(userCopy.stores?.length) ? userCopy.stores.map((s) => s.storeId) : [];
        setUserModal(userCopy)
    }

    const onClickUser = (record) => {
        setSelectedTenant(tenantsList.find((t) => t.tenantId == record.tenantId));
        setUserModal(record)
    }
    return (
        <Flex style={{ overflowX: 'auto' }}>
            <Table key={Math.random()}
                pagination={false}
                dataSource={usersList}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => onClickUser(record), // Handle row click
                })} />

            <DrawerElement
                title="Update user"
                open={Boolean(userModal)}
                onClose={() => setUserModal(null)}
                footerActions={[
                    <Button type="default" onClick={() => setUserModal(null)} key="Cancel">Cancel</Button>,
                    <>
                        {userModal?.isVerified ?
                            <Button type="primary" onClick={() => updateUser(userModal)}>Update</Button> :
                            <Button type="primary" onClick={onVerify}>Verify</Button>}
                    </>
                ]}
                width={450}
            >
                <Flex vertical gap={20}>
                    <Flex align='center' justify='flex-start' gap={10}>
                        {userModal?.profileImage ? <img src={userModal?.profileImage} style={{ width: 50, height: 50, borderRadius: 25 }} /> : <LuUser />}
                        <Flex vertical gap={0}>
                            <Text>{userModal?.name}</Text>
                            <Text>{userModal?.email}</Text>
                        </Flex>
                    </Flex>
                    <Saperator />

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Active</Text>
                        <Switch
                            defaultChecked={userModal?.active || false}
                            value={userModal?.active || false}
                            onChange={() => onChangeValue('active', !Boolean(userModal?.active))}
                        />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Platofrm Role</Text>
                        <Select
                            defaultValue={userModal?.platformRole || ""}
                            value={userModal?.platformRole || ""}
                            style={{ width: "100%" }}
                            placeholder="Select Role"
                            onChange={(value) => onChangeValue('platformRole', value)}
                            options={[
                                { label: ECOMSAI_PLATFORM_USER_ROLE, value: ECOMSAI_PLATFORM_USER_ROLE },
                                { label: ECOMSAI_PLATFORM_SUPPORT_USER_ROLE, value: ECOMSAI_PLATFORM_SUPPORT_USER_ROLE },
                                { label: CRAFT_BUILDER_MAINTAINER_USER_ROLE, value: CRAFT_BUILDER_MAINTAINER_USER_ROLE },
                            ]}
                        />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Tenant</Text>
                        <Select
                            defaultValue={tenantsList.find((t) => t.tenantId == userModal?.tenantId)?.name || ""}
                            value={tenantsList.find((t) => t.tenantId == userModal?.tenantId)?.name || ""}
                            style={{ width: "100%" }}
                            placeholder="Select Tenant"
                            onChange={(tenantId) => onChangeValue('tenantId', tenantId)}
                            options={tenantsList.map((t) => ({ label: t.name, value: t.tenantId }))}
                        />
                    </Flex>

                    <Flex vertical gap={10}>
                        <Saperator />
                        <Text style={{ minWidth: 150 }}>Stores Assigned to User <Tag color='blue'>{userModal?.stores?.length}</Tag></Text>

                        {userModal?.stores?.map((mappedStore, index) => {
                            return <Fragment key={index}>
                                <Card>
                                    <Flex vertical gap={10} key={index}>
                                        <Flex>
                                            <Text style={{ minWidth: 100 }}>Store</Text>
                                            <Select
                                                defaultValue={mappedStore?.storeId}
                                                value={mappedStore?.storeId}
                                                style={{ width: "100%" }}
                                                placeholder="Select Default Store"
                                                onChange={(storeId) => onChangeStoreValue(index, 'storeId', storeId)}
                                                options={(selectedTenant.storesList)?.map((s) => ({ label: `${s.storeId}-${s.name}`, value: s.storeId }))}
                                            />
                                        </Flex>

                                        <Flex>
                                            <Text style={{ minWidth: 100 }}>Roles</Text>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Please select"
                                                defaultValue={mappedStore?.roles || []}
                                                value={mappedStore?.roles || []}
                                                onChange={(value) => onChangeStoreValue(index, 'roles', value)}
                                                options={selectedTenant.storesList.find((s) => s.storeId == mappedStore?.storeId)?.storeDetails?.roles?.map((role) => ({ label: role.name, value: role.id }))}
                                            />
                                        </Flex>

                                        <Flex justify='flex-end'>
                                            <Button danger type='text' icon={<LuTrash />} onClick={() => onClickDeleteStore(index)}>Delete Store Mapping</Button>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Fragment>
                        })}
                    </Flex>

                    <Flex justify='flex-end'>
                        {(tenantsList.find((t) => t.tenantId == userModal?.tenantId)?.storesList.length != userModal?.stores?.length) && <Button type="primary" ghost onClick={onClickAddStore}>Add Store</Button>}
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Default Store</Text>
                        <Select
                            defaultValue={userModal?.storeId}
                            value={userModal?.storeId}
                            style={{ width: "100%" }}
                            placeholder="Select Default Store"
                            onChange={(storeId) => onChangeValue('storeId', storeId)}
                            options={userModal?.stores?.map((s) => ({ label: s.name, value: s.storeId }))}
                        />
                    </Flex>
                    <Tag color='yellow'>Default store used when user loggedin then landing page is of this store</Tag>
                </Flex>
            </DrawerElement>
        </Flex>
    );
}

export default PlatformUsers;