import { BACKGROUND_IMAGES_TYPES } from '@constant/common';
import type { TabsProps } from 'antd';
import { Button, Drawer, Space, Tabs, theme } from 'antd';
import { useEffect, useState } from 'react';
import { BsImages, } from 'react-icons/bs';
import { MdOutlineImageSearch } from 'react-icons/md';
import { RiImageAddFill, RiImageEditFill } from 'react-icons/ri';
import BgGalleryImages from './bgGalleryImages';
import EditImages from './editImages';
import GalleryImages from './galleryImages';
import styles from './imagePickerModal.module.scss';
import SearchImage from './searchImage';
import UploadImage from './uploadImage';

const TAB_TYPES = {
    GALLERY: 'Gallery',
    SEARCH: 'Search',
    UPLOAD: 'Upload',
    EDITOR: 'Edit'
}


function ImagePickerModal({ component, open = false, value, onSave, onCancel }) {
    const [selectedImage, setSelectedImage] = useState({ src: '' });
    const [activeTab, setActiveTab] = useState(TAB_TYPES.GALLERY);
    const { token } = theme.useToken();
    const [originalState, setOriginalState] = useState({ isUpdated: false, value: null });

    useEffect(() => {
        if (open && !originalState.value) setOriginalState({ isUpdated: false, value })
    }, [open])

    const TAB_ITEMS_LIST = [
        { key: TAB_TYPES.GALLERY, icon: <BsImages />, children: component == 'GLOBAL_BG' ? <BgGalleryImages selectedImage={selectedImage} setSelectedImage={(imageData) => handleSave(imageData, true)} /> : <GalleryImages selectedImage={selectedImage} setSelectedImage={(imageData) => handleSave(imageData, true)} config={{ type: BACKGROUND_IMAGES_TYPES.SMALL }} /> },
        { key: TAB_TYPES.SEARCH, icon: <MdOutlineImageSearch />, children: <SearchImage selectedImage={selectedImage} setSelectedImage={(imageData) => handleSave(imageData, true)} config={{ type: BACKGROUND_IMAGES_TYPES.SMALL }} /> },
        { key: TAB_TYPES.UPLOAD, icon: <RiImageAddFill />, children: <UploadImage onCrop={undefined} /> },
        { key: TAB_TYPES.EDITOR, icon: <RiImageEditFill />, children: <EditImages /> },
    ]

    const getTabItems = () => {
        let TAB_ITEMS: TabsProps['items'] = [];
        TAB_ITEMS_LIST.map((tab) => {
            TAB_ITEMS.push({
                key: tab.key,
                label: (
                    <div className={`${styles.tabItemWrap} ${activeTab == tab.key ? styles.active : ''}`}
                        style={{ color: activeTab == tab.key ? token.colorPrimary : token.colorText }}>
                        <div className={styles.iconWrap}>{tab.icon}</div>
                        {tab.key}
                    </div>
                ),
                children: <div className={styles.tabContentWrap}>{tab.children}</div>,
            })
        })
        return TAB_ITEMS;
    }

    const onChange = (key: string) => {
        setActiveTab(key)
    };

    const handleSave = (imageData, doNotCloseDrawer) => {
        onSave({ ...imageData, doNotCloseDrawer });
        setSelectedImage(imageData)
    }

    const handleCancel = () => {
        if (!originalState.isUpdated) {
            onSave(originalState.value)
        }
        onCancel()
    }

    return (
        <div className={styles.imagePickerModal}>
            <Drawer
                title={`${component == 'GLOBAL_BG' ? "APP " : ''}Background Images`}
                placement='right'
                open={open}
                width={525}
                destroyOnClose
                onClose={handleCancel}
                className={styles.imagePickerModalWrap}
                styles={{
                    footer: {
                        display: 'flex', justifyContent: "flex-end"
                    },
                    mask: {
                        background: 'unset'
                    }
                }}
                footer={
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={() => handleSave(selectedImage, false)}>Update</Button>
                    </Space>
                }
            >
                <div className={styles.modalContentWrap}>
                    <Tabs
                        type='card'//line | card | editable-card
                        size="small"
                        animated
                        defaultActiveKey={activeTab}
                        activeKey={activeTab}
                        items={getTabItems()}
                        onChange={onChange}
                        tabBarGutter={0}
                        centered
                    />
                </div>
            </Drawer>
        </div>
    )
}

export default ImagePickerModal