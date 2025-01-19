import TextElement from '@antdComponent/textElement'
import { SEARCHES_LIST } from '@constant/navigations'
import { removeObjRef } from '@util/utils'
import { Button, Input, Modal, Space, Typography, theme } from 'antd'
import { useRouter } from 'next/navigation'
import { Fragment, useState } from 'react'
import { LuX } from 'react-icons/lu'
import styles from './appSearchModal.module.scss'

const { Search } = Input;

function AppSearchModal({ isModalOpen, onClose }) {
    const { token } = theme.useToken();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [filteredSearches, setFilteredSearches] = useState<any>(SEARCHES_LIST)
    const { Text } = Typography;
    const [inputStatus, setInputStatus] = useState<any>()

    const onClickSearch = () => {
        console.log("onclick search")
    }

    const handleClose = () => {
        console.log("messages close")
        onClose()
    }

    const onChangeSearchQuery = (query: string) => {
        setInputStatus("")
        query = query ? query.toLowerCase() : '';
        setSearchQuery(query);
        const searchedCategory = [];
        const searchListCopy = [...SEARCHES_LIST];
        searchListCopy.map((category) => {
            let queryIncludedItems = category.items.filter((i: any) => (i.label.toLowerCase()).includes(query) || (i.keywords ? (i.keywords?.toLowerCase())?.includes(query) : ""))
            if (queryIncludedItems.length !== 0) {
                const filteredCat = removeObjRef(category)
                filteredCat.items = queryIncludedItems;
                searchedCategory.push(filteredCat)
            }
        })
        if (searchedCategory.length == 0) setInputStatus("error")
        setFilteredSearches(!query ? SEARCHES_LIST : searchedCategory)
    }

    const renderSearchWrap = () => {
        return <Space direction='vertical' size={0} style={{ minWidth: "100%" }} className={styles.appSearchModal}>
            <Search value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                onSearch={onClickSearch}
                placeholder="Enter what you want to know"
                enterButton={false}
                allowClear
                size="large"
                status={inputStatus || ""}
                style={{ minWidth: "100%" }}
                loading={isLoading} />
            <TextElement size={"medium"} text={'Quick Navigations Link'} type='primary' />
            <Space wrap direction='horizontal' align='start'>
                {filteredSearches.length != 0 ? <>
                    {filteredSearches.map((searchCategory, i) => {
                        return <Space size={"small"} direction='vertical' style={{ margin: "10px 0" }} key={i}>
                            <TextElement text={searchCategory.label} size={"medium"} />
                            <div className={`${styles.menuItemsWrap}`}>
                                {searchCategory.items.map((nav, i) => {
                                    return <Button size='large' type='text' key={i} icon={<nav.icon style={{ fontSize: 20 }} />}>{nav.label}</Button>
                                })}
                            </div>
                        </Space>
                    })}
                </> : <>
                    <Space className="d-f-c" align='center' style={{ width: "100%", margin: "10px 0", textAlign: "center" }} >
                        <Text style={{ fontSize: "15px", width: "100%", letterSpacing: "0.2px" }} type='secondary'>No Results for <Text style={{ fontSize: "17px", width: "100%" }} strong >{searchQuery}</Text></Text>
                    </Space>
                </>}
            </Space>
        </Space>
    }

    return (
        <Fragment>

            <Modal
                destroyOnClose
                title={"Search for anything"}
                open={isModalOpen}
                footer={false}
                closeIcon={<Button shape='circle' icon={<LuX />} />}
                maskClosable={true}
                onCancel={handleClose}
                mask={true}
                width={700}
            >
                {renderSearchWrap()}
            </Modal>
        </Fragment>
    )
}

export default AppSearchModal