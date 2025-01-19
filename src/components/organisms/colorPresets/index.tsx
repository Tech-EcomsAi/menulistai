import ColorStyle from '@molecules/styleElement/color';
import { removeObjRef } from '@util/utils';
import { Button, ColorPicker, Flex, Typography, theme } from 'antd';
import { useState } from 'react';
import { LuInfo, LuPlus, LuX } from 'react-icons/lu';
const { Text } = Typography


function ColorPresets({ config, onConfigUpdate }) {
    const { token } = theme.useToken();
    const [editableStr, setEditableStr] = useState('This is an editable text.');

    const onChangeValue = (groupIndex, colorIndex, value) => {
        const configCopy = removeObjRef(config);
        configCopy[groupIndex].colors[colorIndex] = value;
        onConfigUpdate(configCopy)

    }

    const removeColor = (groupIndex, colorIndex) => {
        const configCopy = removeObjRef(config);
        configCopy[groupIndex].colors.splice(colorIndex, 1)
        onConfigUpdate(configCopy)
    }

    const onAddColor = (groupIndex) => {
        const configCopy = removeObjRef(config);
        configCopy[groupIndex].colors.push('#0a192f')
        onConfigUpdate(configCopy)
    }

    const onChangeGroupLabel = (groupIndex, text) => {
        const configCopy = removeObjRef(config);
        configCopy[groupIndex].label = text;
        onConfigUpdate(configCopy)
    }

    return (
        <Flex justify="flex-start" style={{ width: "100%" }} vertical gap={10}>
            <Flex justify='space-between' align='center'>
                <Text>Save your favourite colors here, they appered bottom of color picker</Text>
                <ColorPicker
                    presets={removeObjRef(config)}
                    placement='top'
                    trigger='hover'
                    defaultValue="#1677ff"
                >
                    <Button icon={<LuInfo />} type='text' />
                </ColorPicker>
            </Flex>
            <Flex vertical gap={10}>
                {config?.map((colorGroup: any, groupIndex: number) => {
                    return <Flex key={groupIndex} vertical gap={10}>
                        <Flex justify='space-between' align='center'  >
                            <Typography.Title editable={{ onChange: (text) => onChangeGroupLabel(groupIndex, text), tooltip: "Edit color group name" }} level={5} style={{ margin: 0 }}>
                                {colorGroup.label}
                            </Typography.Title>
                        </Flex>
                        <Flex vertical gap={10}>
                            {colorGroup.colors.map((color, colorIndex) => {
                                return <Flex key={colorIndex} gap={10} justify='space-between' align='center' style={{
                                    padding: "5px",
                                    border: "1px solid #dee1ec52",
                                    borderRadius: "5px"
                                }} >
                                    <ColorStyle showTransperancy={false} value={color} onChange={(value) => onChangeValue(groupIndex, colorIndex, value)} label="" />
                                    <Button onClick={() => removeColor(groupIndex, colorIndex)} icon={<LuX />} type='text' danger />
                                </Flex>
                            })}
                            <Button onClick={() => onAddColor(groupIndex)} icon={<LuPlus />}>Add Color</Button>
                        </Flex>
                    </Flex>
                })}
            </Flex>
        </Flex>
    )
}

export default ColorPresets