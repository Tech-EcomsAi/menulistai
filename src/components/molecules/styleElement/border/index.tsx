import Saperator from '@atoms/Saperator';
import { NO_COLOR_VALUE } from '@constant/common';
import { BORDER } from '@constant/editorStylesProperties';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { getStyleValueAndType } from '@util/getColorsValue';
import { Button, Flex, Input, Select, Typography } from 'antd';
import { LuX } from 'react-icons/lu';
import ColorStyle from '../color';
const { Text } = Typography

const sizeList = [
    { label: '1', value: '1px' },
    { label: '3', value: '3px' },
    { label: '5', value: '5px' },
    { label: '6', value: '6px' },
    { label: '7', value: '7px' },
    { label: '8', value: '8px' },
    { label: '9', value: '9px' },
    { label: '10', value: '10px' }
]

const typeList = [
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' }
]

function Border({ onChange, value, showSaperator = true }) {


    const onChangeValue = (from, newValue) => {
        const borderCopy = { ...getProperties(value) };
        borderCopy[from] = newValue;
        Boolean(borderCopy.size) && onChange(BORDER, `${borderCopy.size || '1px'} ${borderCopy.type || 'solid'} ${borderCopy.color || NO_COLOR_VALUE}`)
    }

    const onReset = () => {
        onChange("border", `unset`)
        // onChange(BORDER, `${'0px'} ${getProperties(value).type} ${getProperties(value).color}`)
    }

    const getProperties = (value) => {
        if (value) {
            const propertyValues = {
                size: value.split(' ')[0],
                type: value.split(' ')[1],
                color: value.split(' ')[2]
            };
            return propertyValues;
        } else return { size: "0px", type: "solid", color: "#000" }
    }

    return (
        <>
            <EditorWrapper>
                <Flex gap={10} justify='space-between' align='center'>
                    <Text strong>Border</Text>
                    <Button type='text' shape='circle' danger onClick={onReset} icon={<LuX />} />
                </Flex>

                <Flex gap={10}>
                    <Input
                        placeholder="00"
                        maxLength={3}
                        defaultValue={getStyleValueAndType(getProperties(value).size).value}
                        // value={getStyleValueAndType(getProperties(value).size).value}
                        style={{ width: '100%' }}
                        onBlur={(value) => onChangeValue('size', `${value.target.value}px`)}
                    />
                    <Select
                        placeholder="solid/dotted"
                        defaultValue={typeList[0].value}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('type', value)}
                        value={getProperties(value).type || 'solid'}
                        options={typeList}
                    />
                    {Boolean(value) && <ColorStyle showTransperancy={false} showText={false} value={getProperties(value).color || "#000"} onChange={(value) => onChangeValue('color', value)} />}
                </Flex>
            </EditorWrapper>
            {showSaperator && <Saperator />}
        </>
    )
}

export default (Border)