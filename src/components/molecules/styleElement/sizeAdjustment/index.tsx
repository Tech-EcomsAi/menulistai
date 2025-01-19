import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { getStyleValueAndType } from '@util/getColorsValue';
import { Flex, Input, Select, Typography, theme } from 'antd';
const { Text, Title } = Typography

const typeList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
]

const propsTypeList = [
    { label: 'width', value: 'width' },
    { label: 'height', value: 'height' },
    { label: 'Minimum Width', value: 'minWidth' },
    { label: 'Minimum Height', value: 'minHeight' },
    { label: 'Maximum Width', value: 'maxWidth' },
    { label: 'Maximum Height', value: 'maxHeight' },
]

function SizeAdjustment({ config, onChange }) {
    const { token } = theme.useToken();

    const onChangeValue = (from, value) => {
        onChange(from, value);
    }

    return (
        <EditorWrapper>
            <Text strong>Size</Text>
            <Flex vertical gap={10}>
                {propsTypeList.map((propertyType: any, i: number) => {
                    return <Flex key={i} justify='space-between'>
                        <Text style={{ minWidth: "max-content" }}>{propertyType.label}</Text>
                        <Flex gap={10}>

                            <Input
                                placeholder="00"
                                maxLength={3}
                                defaultValue={getStyleValueAndType(config.style[propertyType.value]).value}
                                style={{ width: '70px' }}
                                onBlur={(value) => onChangeValue(propertyType.value, `${value.target.value}${getStyleValueAndType(config.style[propertyType.value]).type}`)}
                            />

                            <Select
                                defaultValue={'px'}
                                value={getStyleValueAndType(config.style[propertyType.value]).type}
                                style={{ width: '60px' }}
                                onChange={(value) => onChangeValue(propertyType.value, `${getStyleValueAndType(config.style[propertyType.value]).value}${value}`)}
                                options={typeList}
                            />
                        </Flex>
                    </Flex>
                })}
            </Flex>
            <Saperator />
        </EditorWrapper>


    )
}

export default SizeAdjustment