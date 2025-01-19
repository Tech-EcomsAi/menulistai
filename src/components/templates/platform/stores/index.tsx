'use client'
import { getPlatformSummary } from '@database/platformSummary';
import { getAllStores } from '@database/stores';
import { useAppDispatch } from '@hook/useAppDispatch';
import { toggleLoader } from '@reduxSlices/loader';
import { StoreDataType } from '@type/platform/store';
import { TenantDataType } from '@type/platform/tenant';
import { removeObjRef } from '@util/utils';
import { Card, Flex, Table, Tag } from 'antd'; // Import Ant Design components
import { useEffect, useState } from 'react';
import { LuImageOff } from 'react-icons/lu';
import StoreDetailsModal from './storeDetailsModal';

function StoresDashboard() {

    const [storesList, setStoresList] = useState<TenantDataType[]>([]);
    const [storeModal, setStoreModal] = useState<{ active: boolean, data: StoreDataType | null, tenantData: any | null }>({ active: false, data: null, tenantData: null })
    const [platformSummary, setPlatformSummary] = useState([])

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(toggleLoader("stores-fetching"))
        getAllStores().then((stores) => {
            setStoresList(stores)
            dispatch(toggleLoader(""))
            console.log("stores", stores)
        })

        getPlatformSummary().then((summary) => {
            setPlatformSummary(summary)
            console.log("summary", summary)
        })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'storeId',
            key: Math.random(),
        },
        {
            title: 'Tenant ID',
            dataIndex: 'tenantId',
            key: Math.random(),
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: Math.random(),
            render: (_, record) => (
                <Flex align='center' justify='flex-start' gap={10}>
                    {record?.logo ? <img src={record?.logo} style={{ width: "auto", height: 50, borderRadius: 25 }} /> : <LuImageOff />}
                </Flex>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: Math.random(),
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: Math.random(),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: Math.random(),
        },
        {
            title: 'Verified',
            dataIndex: 'verified',
            key: Math.random(),
            render: (_, record) => (
                <>
                    {record.verified ? <Tag color='green'>Verified</Tag> : <Tag color='warning'>Non Verified</Tag>}
                </>
            ),
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: Math.random(),
            render: (_, record) => (
                <>
                    {!record.active ? <Tag color='error'>Deactivated</Tag> : <Tag color='green'>Active</Tag>}
                </>
            ),
        },
        {
            title: 'Blocked',
            dataIndex: 'bloked',
            key: Math.random(),
            render: (_, record) => (
                <>
                    {record.bloked ? <Tag color='error'>Blocked</Tag> : <Tag color='green'>Not Blocked</Tag>}
                </>
            ),
        },
        {
            title: 'Deleted',
            dataIndex: 'deleted',
            key: Math.random(),
            render: (_, record) => (
                <>
                    {record.deleted ? <Tag color='red'>Deleted</Tag> : <Tag color='warning'>Not deleted</Tag>}
                </>
            ),
        }
    ];

    const onCloseModal = (updatedTenant, closeDrawer = true) => {
        if (Boolean(updatedTenant?.name)) {
            const tenantsCopy = removeObjRef(storesList)
            let index = tenantsCopy.findIndex((u) => u.name == updatedTenant.name)
            if (index == -1) {
                tenantsCopy.push(updatedTenant)
            } else {
                tenantsCopy[index] = updatedTenant
            }
            setStoresList(tenantsCopy)
        }
        closeDrawer && setStoreModal({ active: false, data: null, tenantData: null })
    }

    return (
        <Flex style={{ overflowX: 'auto', width: '100%' }}>
            <Card title="Stores List "
            //  extra={<Button icon={<LuPlus />} type="primary" onClick={() => setStoreModal({ active: true, data: null, tenantData: null })}>Add Store</Button>}
            >
                <Table key={Math.random()} dataSource={storesList} columns={columns}
                    onRow={(record: StoreDataType) => ({
                        onClick: () => setStoreModal({ active: true, data: record, tenantData: { tenantId: record.tenantId, name: '' } }), // Handle row click
                    })} />
            </Card>
            <StoreDetailsModal modalData={storeModal} closeModal={onCloseModal} platformSummary={platformSummary} />
        </Flex>
    );
}

export default StoresDashboard