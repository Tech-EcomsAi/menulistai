import getBackground from '@util/getBackgroundStyle';
import { getGradientValue } from '@util/getColorsValue';
import { removeObjRef } from '@util/utils';
import { Button, Card, Drawer, Flex, Select, Space, Tooltip, theme } from 'antd';
import { useEffect, useState } from 'react';
import { LuPaintBucket, LuX } from 'react-icons/lu';
import ColorStyle from '../color';
import Gradients from './gradients';

const GRADIENT_DIRECTIONS = {
    linear: [
        { value: 'to right', label: 'Right' },
        { value: 'to right bottom', label: 'Right Bottom' },
        { value: 'to right top', label: 'Right Top' },
        { value: 'to left', label: 'Left' },
        { value: 'to left bottom', label: 'Left Bottom' },
        { value: 'to left top', label: 'Left Top' },
        { value: 'to bottom', label: 'Bottom' },
        { value: 'to top', label: 'Top' },
    ],
    radialCircle: [
        { value: 'circle at center', label: 'Circle at center' },
        { value: 'circle at left', label: 'Circle at left' },
        { value: 'circle at right', label: 'Circle at right' },
        { value: 'circle at top', label: 'Circle at top' },
        { value: 'circle at bottom', label: 'Circle at bottom' },
    ],
    radialEllipse: [
        { value: 'ellipse at center', label: 'Ellipse at center' },
        { value: 'ellipse at left', label: 'Ellipse at left' },
        { value: 'ellipse at right', label: 'Ellipse at right' },
        { value: 'ellipse at top', label: 'Ellipse at top' },
        { value: 'ellipse at bottom', label: 'Ellipse at bottom' },
    ]
}
const GRADIENT_TYPES = [
    { value: 'linear', label: 'Linear' },
    { value: 'radialCircle', label: 'Radial Circle' },
    { value: 'radialEllipse', label: 'Radial Ellipse' },
]

const valueSample = {
    value: 'linear-gradient(to right, #fff, #000)',
    type: 'Gradient',
    direction: 'to right',
    colors: ['#000']
}

function GradientColor({ value, onChange }) {

    const [showGradientsList, setShowGradientsList] = useState(false);
    const [originalState, setOriginalState] = useState({ isUpdated: false, value: null });
    const { token } = theme.useToken();

    useEffect(() => {
        (showGradientsList) && setOriginalState({ isUpdated: false, value })
    }, [showGradientsList])

    const onSelectGradient = (selectedConfig) => {
        !selectedConfig.doNotCloseDrawer && setShowGradientsList(false);
        const gradientObj = {
            value: '',
            props: { direction: 'to right', type: "linear" },
            type: 'Gradient',
            colors: selectedConfig.colors
        }
        gradientObj.value = getGradientValue(gradientObj)
        onChange(gradientObj);
    }

    const onChangeColor = (index, newColor) => {
        const valueCopy = { ...value };
        const colorsCopy = [...valueCopy.colors];
        colorsCopy[index] = newColor;
        valueCopy.colors = colorsCopy;
        valueCopy.value = getGradientValue(valueCopy);
        onChange(valueCopy);
    }

    const onChangeDirection = (direction) => {
        const valueCopy = removeObjRef(value);
        if (!valueCopy.props) valueCopy.props = { direction: "", type: "" }
        valueCopy.props.direction = direction;
        valueCopy.value = getGradientValue(valueCopy);
        onChange(valueCopy);
    }

    const onChangeType = (type) => {
        const valueCopy = removeObjRef(value);
        if (!valueCopy.props) valueCopy.props = { direction: "", type: "" }
        valueCopy.props.type = type;
        valueCopy.props.direction = GRADIENT_DIRECTIONS[type][0].value;
        valueCopy.value = getGradientValue(valueCopy);
        onChange(valueCopy);
    }

    const removeColor = (colorIndex) => {
        const valueCopy = { ...value };
        const colorsCopy = [...valueCopy.colors];
        colorsCopy.splice(colorIndex, 1);
        valueCopy.colors = colorsCopy;
        valueCopy.value = getGradientValue(valueCopy);
        onChange(valueCopy);
    }

    const onAddColor = () => {
        const valueCopy = { ...value };
        const colorsCopy = [...valueCopy.colors];
        colorsCopy.push('#0a192f')
        valueCopy.colors = colorsCopy;
        valueCopy.value = getGradientValue(valueCopy);
        onChange(valueCopy);
    }


    const handleSave = (imageData, doNotCloseDrawer) => {
        onSelectGradient({ ...imageData, doNotCloseDrawer });
    }

    const handleCancel = () => {
        if (!originalState.isUpdated) {
            onChange(originalState.value)
        }
        setShowGradientsList(false);
    }


    return (
        <>
            <Flex vertical gap={10}>
                <Card style={{ ...getBackground(value) }} />

                <Flex vertical gap={10}>
                    {value.colors.map((colorData, cIndex) => {
                        return <Flex key={cIndex} justify='space-between'>
                            <ColorStyle value={colorData} onChange={(value) => onChangeColor(cIndex, value)} />
                            {value.colors.length > 2 && <Button danger shape='circle' type='text' onClick={() => removeColor(cIndex)} icon={<LuX />} />}
                        </Flex>
                    })}

                    <Select
                        showSearch
                        defaultValue={value?.props?.type}
                        // style={{ width: 160 }}
                        onChange={(value) => onChangeType(value)}
                        options={GRADIENT_TYPES}
                    />
                    <Select
                        showSearch
                        defaultValue={value?.props?.direction}
                        // style={{ width: 160 }}
                        onChange={(value) => onChangeDirection(value)}
                        options={GRADIENT_DIRECTIONS[value?.props?.type || 'linear']}
                    />
                    <Flex gap={10} >
                        {value.colors.length <= 6 && <Button onClick={onAddColor} icon={<LuPaintBucket />}>Add color</Button>}
                        <Tooltip title="View list of gradients">
                            <Button block onClick={() => setShowGradientsList(true)}>View More</Button>
                        </Tooltip>
                    </Flex>
                </Flex>
            </Flex>
            <Drawer
                title="Colorful Gradients Pallets"
                placement='right'
                open={showGradientsList}
                width={450}
                destroyOnClose
                onClose={handleCancel}
                maskStyle={{ background: 'unset' }}
                footer={
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={() => setShowGradientsList(false)}>Update</Button>
                    </Space>
                }
            >
                <Flex>
                    <Gradients onSelect={(value) => handleSave(value, true)} />
                </Flex>
            </Drawer>
        </>
    )
}

export default GradientColor