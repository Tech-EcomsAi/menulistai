import { BorderInnerOutlined, BorderOuterOutlined } from '@ant-design/icons';
import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { getStyleValueAndType } from '@util/getColorsValue';
import { Button, Flex, Input, Segmented, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';
const { Text } = Typography

const typeList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
]

// propertyType padding 20px 20px 20px 20px

function DirectionProperty({ label = "", propertyType, onChange, value }) {
    const [valueType, setValueType] = useState('Common')

    const typesList = [
        { label: 'Top', value: 'top' },
        { label: 'Right', value: 'right' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' }
    ]

    const getIndividualValue = (index) => {
        if (value) return value.split(' ')[index];
        else return '0px'
    }

    useEffect(() => {
        const values = [getIndividualValue(0), getIndividualValue(1), getIndividualValue(2), getIndividualValue(3)];
        if (values.every(v => v === getIndividualValue(0))) setValueType("Common");
        else setValueType("");
    }, [value])

    const getFieldValue = (index) => {
        if (valueType == "common") {
            const propertyValues = value.split(' ')[0];
            return getStyleValueAndType(propertyValues);
        } else {
            return getStyleValueAndType(getIndividualValue(index));
        }
    }

    const onChangeValue = (from, newValue) => {
        const propertyValues = {
            top: getIndividualValue(0),
            right: getIndividualValue(1),
            bottom: getIndividualValue(2),
            left: getIndividualValue(3),
        };
        const type = getStyleValueAndType(propertyValues.top).type;
        propertyValues[from] = newValue + type;
        onChange(propertyType, `${propertyValues.top} ${propertyValues.right} ${propertyValues.bottom} ${propertyValues.left}`);
    }

    const onChangeProperty = (from, newValue) => {
        if (from == 'type') {
            const oldValue = getStyleValueAndType(value?.split(' ')[0]).value;
            onChange(propertyType, `${oldValue + newValue} ${oldValue + newValue} ${oldValue + newValue} ${oldValue + newValue}`);
        } else {
            const type = getStyleValueAndType(value?.split(' ')[0]).type;
            onChange(propertyType, `${newValue + type} ${newValue + type} ${newValue + type} ${newValue + type}`);
        }
    }

    const onReset = () => {
        onChange(propertyType, `${'0px'} ${'0px'} ${'0px'} ${'0px'}`);
    }

    return (
        <>
            <EditorWrapper>
                <Flex gap={10} justify='space-between' align='center'>
                    <Text strong>{label || propertyType}</Text>
                    <Button type='text' shape='circle' danger onClick={onReset} icon={<LuX />} />
                </Flex>
                <Flex vertical gap={10} align='flex-start'
                    justify='flex-start'>
                    <Segmented
                        width={73}
                        onChange={(value: any) => setValueType(value)}
                        options={[
                            { value: 'Common', icon: <BorderOuterOutlined /> },
                            { value: 'Indevidual', icon: <BorderInnerOutlined /> },
                        ]}
                    />
                    {valueType == "Common" ? <Flex gap={10}>
                        <Input
                            placeholder='00'
                            defaultValue={getStyleValueAndType(value?.split(' ')[0]).value}
                            style={{ width: '100%' }}
                            onBlur={(value) => onChangeProperty('value', value.target.value)}
                        />
                        <Select
                            defaultValue={'px'}
                            value={getStyleValueAndType(value?.split(' ')[0]).type}
                            style={{ width: '100%' }}
                            onChange={(value) => onChangeProperty('type', value)}
                            options={typeList}
                        />
                    </Flex> : <Flex gap={13} style={{ width: '100%' }}>
                        {typesList.map((type, index) => {
                            return <Flex key={index} gap={5} vertical>
                                <Text>{type.label}</Text>
                                <Input
                                    placeholder='00'
                                    defaultValue={getFieldValue(index).value}
                                    style={{ width: 51 }}
                                    onBlur={(value) => onChangeValue(type.value, value.target.value)}
                                />
                            </Flex>
                        })}
                    </Flex>}
                </Flex>
            </EditorWrapper>
            <Saperator />
        </>
    )
}

export default DirectionProperty