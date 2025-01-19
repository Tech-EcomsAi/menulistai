import { getStyleValueAndType } from '@util/getColorsValue';
import { Flex, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
const { Text } = Typography

function FontSize({ showLabel = true, value, onChange, style = {} }) {

    const [optionsList, setOptionsList] = useState([])

    useEffect(() => {
        const res = [];
        for (let i = 1; i <= 100; i++) {
            res.push({ label: i, value: i })
        }
        setOptionsList(res);
    }, [value])

    const onChangeValue = (value) => {
        onChange('fontSize', value)
    }

    return (
        <Flex vertical gap={10} style={{ width: "100%" }}>
            {showLabel && <Text strong>Font Size</Text>}
            <Select
                showSearch
                value={Number(getStyleValueAndType(value).value).toFixed()}
                style={{ width: '100%' }}
                onChange={(value) => onChangeValue(`${value}px`)}
                options={optionsList}
            />
        </Flex>
    )
}

export default FontSize;
