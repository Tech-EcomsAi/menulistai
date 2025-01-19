import TextElement from '@antdComponent/textElement';
import { Card, Input, theme } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import styles from './genericDashboard.module.scss';

const { Search } = Input;

function SearchComponent() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { token } = theme.useToken();

    const onClickSearch = () => {
        console.log("onclick search")
    }

    const onChangeSearchQuery = (query: string) => {
        query = query ? query.toLowerCase() : '';
        setSearchQuery(query);
    }


    return (
        <div className={styles.searchWrap}>
            <Search value={searchQuery}
                onChange={(e) => onChangeSearchQuery(e.target.value)}
                onSearch={onClickSearch}
                placeholder="Enter what you want to know"
                enterButton={false}
                allowClear
                className={styles.searchInput}
                size="large"
                status={""}
                loading={isLoading} />
            <AnimatePresence>
                {Boolean(searchQuery) && <motion.div
                    initial={{ height: "0", opacity: 0 }}
                    animate={{ height: "max-content", opacity: 1 }}
                    exit={{ height: "0", opacity: 0 }}
                    className={styles.serachResultsWrap}
                >
                    <Card style={{ width: "100%" }}>
                        <TextElement size={"medium"} text={'Search Results'} type='primary' styles={{ margin: "20px 0 10px", display: "block" }} />
                    </Card>
                </motion.div>}
            </AnimatePresence>
        </div>
    )
}

export default SearchComponent