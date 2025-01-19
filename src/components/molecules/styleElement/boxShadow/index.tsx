import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { Button, Flex, Select, Typography, theme } from 'antd';
import { memo } from 'react';
import { LuX } from 'react-icons/lu';
const { Text } = Typography
function BoxShadow({ onChange, value, showSaperator = true }) {

    // const [shadow, setShadow] = useState(value);
    const { token } = theme.useToken();
    const optionsList = [
        { label: 'Soft Shadow', value: 'rgba(0, 0, 0, 0.2) 0px 1px 5px 0px' },
        { label: 'Mid Shadow', value: 'rgba(0, 0, 0, 0.4) 0px 1px 5px' },
        { label: 'Hard Shadow', value: 'rgba(0, 0, 0, 0.7) 0px 1px 5px' },
        { label: 'Far Shadow', value: 'rgba(0, 0, 0, 0.1) 0px 8px 1px' },
        { label: 'Blury Shadow', value: 'rgba(0, 0, 0, 0.2) 0px 0px 25px, rgba(0, 0, 0, 0.2) 0px 0px 15px, rgba(0, 0, 0, 0.4) 0px 0px 3px' },
        { label: 'Dark With Heighlight Shadow', value: 'rgba(0, 0, 0, 0.4) 0px 0px 25px, rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.4) 0px 0px 3px' },
        { label: 'Soft Inner', value: 'rgba(0, 0, 0, 0.2) 0px 1px 5px inset' },
        { label: 'Mid Inner Shadow', value: 'rgba(0, 0, 0, 0.4) 0px 1px 5px inset' },
        { label: 'Hard Inner Shadow', value: 'rgba(0, 0, 0, 0.7) 0px 1px 5px inset' },
    ]

    const onChangeValue = (value) => {
        onChange('boxShadow', value)
    }
    return (
        <EditorWrapper>

            <Flex gap={10} justify='space-between' align='center' style={{ width: "100%" }}>
                <Text strong>Box Shadow</Text>
                <Button type='text' shape='circle' danger onClick={() => onChangeValue('')} icon={<LuX />} />
            </Flex>

            <Select
                showSearch
                value={optionsList.find(t => t.value == value)}
                // defaultValue={optionsList[0].value}
                style={{ width: '100%' }}
                onChange={(value) => onChangeValue(value)}
                options={optionsList}
            />
            {showSaperator && <Saperator />}
        </EditorWrapper>
    )
}

export default memo(BoxShadow)