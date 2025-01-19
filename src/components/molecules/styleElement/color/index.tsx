import { presetPalettes } from '@ant-design/colors';
import { NO_COLOR_VALUE } from '@constant/common';
import { useAppSelector } from '@hook/useAppSelector';
import { _debounce } from '@hook/useDebounce';
import { CraftBuilderGlobalDataContext } from '@providers/craftBuilderGlobalDataProvider';
import { ActiveTemplateConfigType, getActiveTemplateConfig } from '@reduxSlices/siteBuilderState';
import { CraftBuilderGlobalDataType } from '@type/craftBuilderContextType';
import type { ColorPickerProps } from 'antd';
import { Button, ColorPicker, Flex, Tooltip, Typography } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { RxTransparencyGrid } from 'react-icons/rx';
import { TbColorPicker } from 'react-icons/tb';
import useEyeDropper from 'use-eye-dropper';

const { Text } = Typography;

type ColorPickerPropsType = {
    hidePresets?: boolean,
    value: any,
    onChange: any,
    label?: string,
    showText?: boolean,
    showTransperancy?: boolean,
    pickerSize?: 'small' | 'middle' | 'large',
    trigger?: 'hover' | 'click'
}

type Presets = Required<ColorPickerProps>['presets'][number];

const genPresets = (presets = presetPalettes) => Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));

function ColorStyle({ hidePresets = false, trigger = "hover", value, onChange, label = '', showText = true, showTransperancy = true, pickerSize = "middle" }: ColorPickerPropsType) {

    const activeTemplateConfig: ActiveTemplateConfigType = useAppSelector(getActiveTemplateConfig);
    const { brandKit } = useContext<CraftBuilderGlobalDataType>(CraftBuilderGlobalDataContext)

    const colorPresets = [
        { label: "Brand Color", colors: brandKit.colors },
        { label: "Theme Colors", colors: Object.keys(activeTemplateConfig.colorVariables).map(v => activeTemplateConfig.colorVariables[v]) }];

    const [activeValue, setActiveValue] = useState(value);
    const { open, isSupported } = useEyeDropper()

    const pickColor = useCallback(() => {
        // Using async/await (can be used as a promise as-well)
        const openPicker = async () => {
            try {
                const color = await open()
                Boolean(color.sRGBHex) && setActiveValue(color.sRGBHex);
            } catch (e) {
            }
        }
        openPicker()
    }, [open])

    //debounced function
    const onChangeColor = useMemo(() => _debounce(onChange, 1000), []);

    useEffect(() => {
        //on activevalue changes call debounced function
        if (activeValue && activeValue !== value) {
            onChangeColor(activeValue);
        }
    }, [activeValue])

    const onChangeValue = (value: any) => {
        //update local activeValue state
        setActiveValue(value.toHexString())
    }

    const onClickTransparency = () => {
        onChange(NO_COLOR_VALUE)
    }

    // const presets = genPresets({ primary: generate(token.colorPrimary), red, green, cyan, });

    const customPanelRender: ColorPickerProps['panelRender'] = (_, { components: { Picker, Presets } }) => (
        <Flex vertical>
            <Picker />
            {isSupported() && <Button className='color-eye-dropper' icon={<TbColorPicker />} onClick={pickColor} />}
            {showTransperancy && <Tooltip title="Remove Color">
                <Button
                    className='color-transparency-picker'
                    icon={<RxTransparencyGrid />}
                    onClick={onClickTransparency}></Button>
            </Tooltip>}
            {!hidePresets && <Presets />}
        </Flex>
    );

    return (
        <Flex vertical gap={10}>
            {Boolean(label) && <Text style={{ minWidth: "100px" }}>{label}</Text>}
            <Flex gap={10}>

                <ColorPicker
                    size={pickerSize}
                    showText={showText}
                    trigger={trigger}
                    presets={!hidePresets && Boolean(colorPresets) ? [...colorPresets] : []}
                    format="hex"
                    onChange={onChangeValue}
                    placement="bottom"
                    value={value}
                    defaultValue={value}
                    // presets={presets}
                    panelRender={customPanelRender}
                />
            </Flex>
        </Flex>
    )
}

export default ColorStyle