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

// "padding": {
// paddingTop: '0px',
// paddingBottom: '0px',
// paddingLeft: '0px',
// paddingRight: '0px'
// },
// value = 20px 20px 20px 20px

function PaddingMargin({ propertyType, onChange, value }) {
    const [valueType, setValueType] = useState('Common')

    const typesList = [
        { label: 'Top', value: 'top' },
        { label: 'Right', value: 'right' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Left', value: 'left' }
    ]

    const getIndividualValue = (index) => {
        if (value) {
            if (propertyType == "padding") {
                switch (index) {
                    case 0:
                        return value.paddingTop;
                    case 1:
                        return value.paddingRight;
                    case 2:
                        return value.paddingBottom;
                    case 3:
                        return value.paddingLeft;
                    default:
                        return '0px'
                }
            } else if (propertyType == "margin") {
                switch (index) {
                    case 0:
                        return value.marginTop;
                    case 1:
                        return value.marginRight;
                    case 2:
                        return value.marginBottom;
                    case 3:
                        return value.marginLeft;
                    default:
                        return '0px'
                }
            }

        } else return '0px'
    }

    useEffect(() => {
        if (propertyType == 'padding') {
            if (value?.paddingTop === value?.paddingBottom && value?.paddingBottom === value?.paddingLeft && value?.paddingLeft === value?.paddingRight) {
                setValueType("Common");
            } else {
                setValueType("");
            }
        } else if (propertyType == 'margin') {
            if (value?.marginTop === value?.marginBottom && value?.marginBottom === value?.marginLeft && value?.marginLeft === value?.marginRight) {
                setValueType("Common");
            } else {
                setValueType("");
            }
        }
    }, [value]);

    const getFieldValue = (index) => {
        if (valueType == "common") {
            if (propertyType == 'padding') {
                return getStyleValueAndType(value.paddingTop);
            } else if (propertyType == 'margin') {
                return getStyleValueAndType(value.marginTop);
            }
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
        if (propertyType == 'padding') {
            onChange(propertyType, { paddingTop: propertyValues.top, paddingBottom: propertyValues.bottom, paddingLeft: propertyValues.left, paddingRight: propertyValues.right })
        } else if (propertyType == 'margin') {
            onChange(propertyType, { marginTop: propertyValues.top, marginBottom: propertyValues.bottom, marginLeft: propertyValues.left, marginRight: propertyValues.right })
        }
    }

    const onChangeProperty = (from, newValue) => {
        if (from == 'type') {
            if (propertyType == 'padding') {
                const oldValue = getStyleValueAndType(value?.paddingTop).value;
                onChange(propertyType, { paddingTop: oldValue + newValue, paddingBottom: oldValue + newValue, paddingLeft: oldValue + newValue, paddingRight: oldValue + newValue })
            } else if (propertyType == 'margin') {
                const oldValue = getStyleValueAndType(value?.marginTop).value;
                onChange(propertyType, { marginTop: oldValue + newValue, marginBottom: oldValue + newValue, marginLeft: oldValue + newValue, marginRight: oldValue + newValue })
            }
        } else {
            if (propertyType == "padding") {
                const type = getStyleValueAndType(value?.paddingTop).type;
                onChange(propertyType, { paddingTop: newValue + type, paddingBottom: newValue + type, paddingLeft: newValue + type, paddingRight: newValue + type })
            } else if (propertyType == 'margin') {
                const type = getStyleValueAndType(value?.marginTop).type;
                onChange(propertyType, { marginTop: newValue + type, marginBottom: newValue + type, marginLeft: newValue + type, marginRight: newValue + type })
            }
        }
    }

    const onReset = () => {
        if (propertyType == 'padding') {
            onChange(propertyType, { paddingTop: '0px', paddingBottom: '0px', paddingLeft: '0px', paddingRight: '0px' });
        } else if (propertyType == 'margin') {
            onChange(propertyType, { marginTop: '0px', marginBottom: '0px', marginLeft: '0px', marginRight: '0px' });
        }
    }

    return (
        <>
            <EditorWrapper>
                <Flex gap={10} justify='space-between' align='center'>
                    <Text strong className='cap-text'>{propertyType}</Text>
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
                            defaultValue={getStyleValueAndType(propertyType == 'padding' ? value?.paddingTop : value?.marginTop).value}
                            style={{ width: '100%' }}
                            onBlur={(value) => onChangeProperty('value', value.target.value)}
                        />
                        <Select
                            defaultValue={'px'}
                            value={getStyleValueAndType(propertyType == 'padding' ? value?.paddingTop : value?.marginTop).type}
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

export default PaddingMargin