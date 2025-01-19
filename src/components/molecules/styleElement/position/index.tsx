import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { getStyleValueAndType } from '@util/getColorsValue';
import { Flex, Input, Select, Typography } from 'antd';
const { Text, Title } = Typography

const typeList = [
    { label: 'Relative', value: 'relative' },
    { label: 'Absolute', value: 'absolute' },
    { label: 'Sticky', value: 'sticky' },
    { label: 'Fixed', value: 'fixed' },
]

const directionsList = [
    { label: 'Top', value: 'top' },
    { label: 'Right', value: 'right' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Left', value: 'left' }
]

function Position({ config, onChange }) {

    const onChangeValue = (from, value) => {
        onChange(from, value);
    }

    return (
        <EditorWrapper>
            <Text strong>Position</Text>
            <Select
                defaultValue={''}
                value={config.style['position']}
                style={{ width: '100%' }}
                onChange={(value) => onChangeValue('position', value)}
                options={typeList}
            />
            <Flex gap={10}>
                {directionsList.map((propertyType: any, i: number) => {
                    return <Flex key={i} justify='space-between' vertical gap={10}>
                        <Text style={{ minWidth: "max-content" }}>{propertyType.label}</Text>
                        <Input
                            placeholder="00"
                            maxLength={3}
                            defaultValue={getStyleValueAndType(config.style[propertyType.value]).value}
                            style={{ width: '100%' }}
                            onBlur={(value) => onChangeValue(propertyType.value, `${value.target.value}px`)}
                        />
                    </Flex>
                })}
            </Flex>
            <Saperator />
        </EditorWrapper>
    )
}

export default Position