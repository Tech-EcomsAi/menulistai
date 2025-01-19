import Saperator from '@atoms/Saperator';
import { _debounce } from '@hook/useDebounce';
import { Flex, Input, Typography, theme } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
const { Text } = Typography;
const { TextArea } = Input;

function TextEditorElement({ value, onChange, label = '', placeholder, minRows = 1, maxRows = 3 }: any) {
    const { token } = theme.useToken();
    const [activeValue, setActiveValue] = useState();

    useEffect(() => {
        //for the first load if local state that is "activeValue" not present then set this value to original state "value"
        if (!activeValue && value) setActiveValue(value)
    }, [value])

    // ***********debounce logic*********** //

    //debounced function
    const onChangeText = useMemo(() => _debounce(onChange, 1000), []);

    useEffect(() => {
        //on activevalue changes call debounced function
        onChangeText(activeValue);
    }, [activeValue])

    const onChangeValue = (value: any) => {
        //update local activeValue state
        setActiveValue(value)
    }

    // ***********debounce logic*********** //

    return (
        <Flex vertical gap={10} style={{ width: "100%" }}>
            <Text strong>{label}</Text>
            <TextArea
                autoSize
                value={activeValue}
                onChange={(e) => onChangeValue(e.target.value)}
                placeholder={placeholder}
            />
            <Saperator />
        </Flex>
    )
}

export default memo(TextEditorElement)