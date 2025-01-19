'use client'
import DrawerElement from '@antdComponent/drawerElement';
import ImageUploadInput from '@atoms/imageUploadInput';
import Saperator from '@atoms/Saperator';
import { BUSINESS_TYPES } from '@constant/common';
import { DB_COLLECTIONS } from '@constant/database';
import { ECOMSAI_PLATFORM_STORE_ID } from '@constant/user';
import { addStore, updateStore } from '@database/stores';
import { updateTenantsStoreslist } from '@database/tenants';
import RoleDetailsModal from '@template/main-app/users/permissions/roleDetailsModal';
import { UserUploadedFileType } from '@type/common';
import { StoreDataType } from '@type/platform/store';
import { getFormatedDateAndTime } from '@util/dateTime';
import { getObjectDifferance } from '@util/deepMerge';
import { removeObjRef } from '@util/utils';
import { Button, Divider, Flex, Input, Select, Switch, Typography } from 'antd'; // Import Ant Design components
import { useFormatter } from 'next-intl';
import { memo, useEffect, useRef, useState } from 'react';
import { LuPen, LuPlus, LuTrash, LuUpload, LuUploadCloud, LuX } from 'react-icons/lu';
import { TbEdit, TbMail, TbPhoneCall } from 'react-icons/tb';
const { Text } = Typography

function StoreDetailsModal({ modalData, closeModal, platformSummary }) {

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState<UserUploadedFileType>({ name: "", size: 0, type: "", src: null })
    const [storeData, setStoreData] = useState<StoreDataType | null>(null);
    const format = useFormatter();
    const [roleModal, setRoleModal] = useState({ active: false, data: null })

    useEffect(() => {
        if (modalData.active) {
            setStoreData(modalData.data)
        } else {
            setStoreData(null)
        }
    }, [modalData])

    const closeDrawer = (updated = null) => {
        closeModal(updated)
        setSelectedFile({ name: "", size: 0, type: "", src: null })
    }

    const addUpdateDetails = (changesToUpload: any) => {

        if (selectedFile.src) {
            changesToUpload.imageToUpdate = selectedFile.src
            changesToUpload.imageType = selectedFile.type
        }
        if (changesToUpload.storeId || changesToUpload.storeId == ECOMSAI_PLATFORM_STORE_ID) {
            const updatedChanges: any = getObjectDifferance(changesToUpload, modalData.data);
            if (Object.keys(updatedChanges).length > 0) {

                updatedChanges.storeId = modalData.data.storeId;
                if ('name' in updatedChanges) {
                    updatedChanges.storeKey = updatedChanges.name.toLowerCase().replaceAll(" ", "_");
                }
                updateStore(updatedChanges).then((savedDetails) => {

                    if ('name' in updatedChanges) {
                        const savedstoresList = modalData.tenantData.storesList;
                        const index = savedstoresList.findIndex(s => s.storeId == modalData.data.storeId);
                        if (index != -1) {
                            console.log("stores Updated in tenant")
                            savedstoresList[index].name = updatedChanges.name;
                            const tenantData = {
                                tenantId: modalData.data.tenantId,
                                storesList: savedstoresList
                            }
                            updateTenantsStoreslist(tenantData).then(() => {
                                closeDrawer({ ...updatedChanges, ...savedDetails })
                            })
                        }
                    } else {
                        closeDrawer({ ...updatedChanges, ...savedDetails })
                    }

                })
            } else {
                console.log("No changes detected.");
            }
        } else {

            let newId = 0;
            if (platformSummary.length && platformSummary.find(s => s.id == DB_COLLECTIONS.STORES)) {
                newId = platformSummary.find(s => s.id == DB_COLLECTIONS.STORES).count + 1;
            }
            changesToUpload.storeId = newId;
            changesToUpload.tenantId = modalData.tenantData.tenantId;
            changesToUpload.storeKey = changesToUpload.name.toLowerCase().replaceAll(" ", "_");

            addStore(changesToUpload).then((savedDetails) => {
                const tenantData = {
                    tenantId: changesToUpload.tenantId,
                    storesList: [...modalData.tenantData.storesList, { storeId: changesToUpload.storeId, name: changesToUpload.name }]
                }
                updateTenantsStoreslist(tenantData).then(() => {
                    console.log("store details Updated in tenant")
                    closeDrawer(savedDetails);
                })
            })
        }
    }

    const handleFileChange = async (selectedFile: UserUploadedFileType) => {
        setSelectedFile(selectedFile)
    };

    const onChangeValue = (from: string, value: any) => {
        let dataCopy = removeObjRef(storeData)
        if (!dataCopy) dataCopy = {}
        dataCopy[from] = value
        setStoreData(dataCopy)
    }

    const onCloseRoleModal = (storeData) => {
        if (storeData) {
            setStoreData(storeData)
        }
        closeModal(storeData, false)
        setRoleModal({ active: false, data: null })
    }

    return (
        <Flex style={{ overflowX: 'auto', width: '100%' }}>
            <DrawerElement
                title={storeData?.name ? `Update Store` : `Add Store`}
                open={Boolean(modalData.active)}
                onClose={() => closeDrawer()}
                footerActions={[
                    <Button type="default" onClick={() => closeDrawer()} icon={<LuX />} key="Cancel">Cancel</Button>,
                    <>{(Boolean(storeData?.storeId) || storeData?.storeId == ECOMSAI_PLATFORM_STORE_ID) && <>
                        {!storeData?.deleted ? <Button type="default" icon={<LuTrash />} danger onClick={() => addUpdateDetails({ ...storeData, deleted: true })} key="Delete">Delete</Button> :
                            <Button type="default" icon={<LuTrash />} danger onClick={() => addUpdateDetails({ ...storeData, deleted: false })} key="Delete">Activate</Button>}
                    </>}
                    </>,
                    <Button type="primary" icon={<LuUploadCloud />} onClick={() => addUpdateDetails(storeData)} key="Update">{(Boolean(storeData?.storeId) || storeData?.storeId == ECOMSAI_PLATFORM_STORE_ID) ? "Update" : "Add"}</Button>,
                ]}
                width={450}
            >
                <Flex vertical gap={20}>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Tenant</Text>
                        <Text>{modalData.tenantData?.tenantId}, {modalData.tenantData?.name}</Text>
                    </Flex>
                    <Saperator />

                    <Flex onClick={() => fileInputRef.current.click()}>
                        <Text style={{ minWidth: 150 }}>Logo</Text>
                        {selectedFile.src ? <img src={selectedFile.src} style={{ width: "auto", height: 100 }} /> :
                            <>
                                {storeData?.logo ? <img src={storeData?.logo} style={{ width: "auto", height: 100 }} /> : <>
                                    <Button icon={<LuUpload />}>Upload Logo</Button>
                                </>}
                            </>}
                    </Flex>

                    {(Boolean(storeData?.storeId) || storeData?.storeId == ECOMSAI_PLATFORM_STORE_ID) && <Flex>
                        <Text style={{ minWidth: 150 }}>Store Id</Text>
                        <Text>{storeData?.storeId}</Text>
                    </Flex>}

                    {storeData?.createdBy && <Flex>
                        <Text style={{ minWidth: 150 }}>Created By</Text>
                        <Text>{storeData?.createdBy}, <br /> {getFormatedDateAndTime(format, new Date(storeData?.createdOn))}</Text>
                    </Flex>}
                    <Saperator />

                    <Flex wrap='wrap' gap={10}>
                        <Flex>
                            <Text style={{ minWidth: 150 }}>Verified</Text>
                            <Switch
                                defaultChecked={storeData?.verified || false}
                                value={storeData?.verified || false}
                                onChange={() => onChangeValue('verified', !Boolean(storeData?.verified))}
                            />
                        </Flex>

                        <Flex>
                            <Text style={{ minWidth: 150 }}>Active</Text>
                            <Switch
                                defaultChecked={storeData?.active || false}
                                value={storeData?.active || false}
                                onChange={() => onChangeValue('active', !Boolean(storeData?.active))}
                            />
                        </Flex>

                        <Flex>
                            <Text style={{ minWidth: 150 }}>Blocked</Text>
                            <Switch
                                defaultChecked={storeData?.blocked || false}
                                value={storeData?.blocked || false}
                                onChange={() => onChangeValue('blocked', !Boolean(storeData?.blocked))}
                            />
                        </Flex>
                    </Flex>

                    <Divider>Basic Details</Divider>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Name</Text>
                        <Input prefix={<TbEdit />} placeholder="Store name" value={storeData?.name || ""} onChange={(e) => onChangeValue('name', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Number</Text>
                        <Input prefix={<TbPhoneCall />} placeholder="Store phoneNumber" value={storeData?.phoneNumber || ""} onChange={(e) => onChangeValue('phoneNumber', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Alternate Number</Text>
                        <Input prefix={<TbPhoneCall />} placeholder="Store alternatePhoneNumber" value={storeData?.alternatePhoneNumber || ""} onChange={(e) => onChangeValue('alternatePhoneNumber', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Email</Text>
                        <Input type='email' prefix={<TbMail />} placeholder="Store email" value={storeData?.email || ""} onChange={(e) => onChangeValue('email', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Description</Text>
                        <Input.TextArea placeholder="Store description" value={storeData?.description || ""} onChange={(e) => onChangeValue('description', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>GSTN</Text>
                        <Input prefix={<TbEdit />} placeholder="Store gstn" value={storeData?.gstn || ""} onChange={(e) => onChangeValue('gstn', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Store Key</Text>
                        <Input prefix={<TbEdit />} placeholder="Store storeKey" value={storeData?.storeKey || ""} onChange={(e) => onChangeValue('storeKey', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Domain</Text>
                        <Input prefix={<TbEdit />} placeholder="Store domain" value={storeData?.domain || ""} onChange={(e) => onChangeValue('domain', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Sub Domain</Text>
                        <Input prefix={<TbEdit />} placeholder="Store subDomain" value={storeData?.subDomain || ""} onChange={(e) => onChangeValue('subDomain', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>URL</Text>
                        <Input prefix={<TbEdit />} placeholder="Store url" value={storeData?.url || ""} onChange={(e) => onChangeValue('url', e.target.value)} />
                    </Flex>

                    <Divider>Licence Details</Divider>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Key</Text>
                        <Input placeholder="Licence Key" value={storeData?.licenceKey || ""} onChange={(e) => onChangeValue('licenceKey', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Expiry Date</Text>
                        <Input placeholder="Expiry Date" value={storeData?.licenceExpiryDate || ""} onChange={(e) => onChangeValue('licenceExpiryDate', e.target.value)} />
                    </Flex>

                    <Divider>Address</Divider>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Address Line</Text>
                        <Input placeholder="Address Line" value={storeData?.addressLine || ""} onChange={(e) => onChangeValue('addressLine', e.target.value)} />
                    </Flex>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Area</Text>
                        <Input placeholder="Area" value={storeData?.area || ""} onChange={(e) => onChangeValue('area', e.target.value)} />
                    </Flex>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>City</Text>
                        <Input placeholder="City" value={storeData?.city || ""} onChange={(e) => onChangeValue('city', e.target.value)} />
                    </Flex>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>State</Text>
                        <Input placeholder="State" value={storeData?.state || ""} onChange={(e) => onChangeValue('state', e.target.value)} />
                    </Flex>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Pincode</Text>
                        <Input placeholder="Pincode" value={storeData?.postalCode || ""} onChange={(e) => onChangeValue('postalCode', e.target.value)} />
                    </Flex>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Country</Text>
                        <Input placeholder="Country" value={storeData?.country || ""} onChange={(e) => onChangeValue('country', e.target.value)} />
                    </Flex>

                    <Divider>Locale Details</Divider>
                    <Flex>
                        <Text style={{ minWidth: 150 }}>Business Type</Text>
                        <Select
                            defaultValue={storeData?.businessType || ""}
                            value={storeData?.businessType || ""}
                            style={{ width: "100%" }}
                            placeholder="Select Business Type"
                            onChange={(value) => onChangeValue('businessType', value)}
                            options={BUSINESS_TYPES}
                        />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Language</Text>
                        <Input placeholder="Preferred Language" value={storeData?.language || ""} onChange={(e) => onChangeValue('language', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Country Code</Text>
                        <Input placeholder="Country Code" value={storeData?.countryCode || ""} onChange={(e) => onChangeValue('countryCode', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Phone Prefix</Text>
                        <Input placeholder="Phone Prefix" value={storeData?.countryCode || ""} onChange={(e) => onChangeValue('countryCode', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Currency Symbol</Text>
                        <Input placeholder="Currency Symbol" value={storeData?.currencySymbol || ""} onChange={(e) => onChangeValue('currencySymbol', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Currency Code</Text>
                        <Input placeholder="Currency Code" value={storeData?.currencyCode || ""} onChange={(e) => onChangeValue('currencyCode', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Time Zone</Text>
                        <Input placeholder="Time Zone" value={storeData?.timeZone || ""} onChange={(e) => onChangeValue('timeZone', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Date Format</Text>
                        <Input placeholder="Date Format" value={storeData?.dateFormat || ""} onChange={(e) => onChangeValue('dateFormat', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Time Format</Text>
                        <Input placeholder="Time Format" value={storeData?.timeFormat || ""} onChange={(e) => onChangeValue('timeFormat', e.target.value)} />
                    </Flex>

                    <Divider>Contact Person Details</Divider>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Name</Text>
                        <Input placeholder="Contact Person Name" value={storeData?.contactPersonName || ""} onChange={(e) => onChangeValue('contactPersonName', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Number</Text>
                        <Input placeholder="Contact Person Number" value={storeData?.contactPersonNumber || ""} onChange={(e) => onChangeValue('contactPersonNumber', e.target.value)} />
                    </Flex>

                    <Flex>
                        <Text style={{ minWidth: 150 }}>Email</Text>
                        <Input placeholder="Contact Person Email" value={storeData?.contactPersonEmail || ""} onChange={(e) => onChangeValue('contactPersonEmail', e.target.value)} />
                    </Flex>

                    <Divider>Roles & Permissions</Divider>
                    <Button type='text' onClick={() => setRoleModal({ active: true, data: null })} icon={<LuPlus />} >Add Role</Button>
                    <Flex vertical gap={10}>
                        {storeData?.roles?.map((role, i: number) => {
                            return <Button onClick={() => setRoleModal({ active: true, data: role })} icon={<LuPen />} key={i}>{role.name}</Button>
                        })}
                    </Flex>

                    <RoleDetailsModal storeDetails={storeData} modalData={roleModal} onClose={onCloseRoleModal} />

                    {modalData.active && <ImageUploadInput onUploadFile={handleFileChange} fileInputRef={fileInputRef} />}
                </Flex>
            </DrawerElement>
        </Flex>
    );
}

export default memo(StoreDetailsModal)