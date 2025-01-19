import TextElement from '@antdComponent/textElement';
import { BACKGROUND_TYPES, NO_COLOR_VALUE } from '@constant/common';
import { useAppSelector } from '@hook/useAppSelector';
import styleElementCSS from '@moleculesCSS/styleElement/styleElement.module.scss';
import { ActiveTemplateConfigType, getActiveTemplateConfig } from '@reduxSlices/siteBuilderState';
import { removeObjRef } from '@util/utils';
import { Button, ColorPicker, Tooltip, theme } from 'antd';
import type { Color, ColorPickerProps } from 'antd/es/color-picker';
import React, { useEffect, useMemo, useState } from 'react';
import { RxTransparencyGrid } from 'react-icons/rx';
import styles from './colorPicker.module.scss';

const valueSample = [{ color: '#000', format: 'hex' }];

function ColorPickerComponent({ page = '', hideColorString = false, hidePresets = false, value, onChange, label = '', hideTransparency = false, parentStyles = {} }) {


    const { token } = theme.useToken();
    const [activeColor, setActiveColor] = useState<Color | string | any>(value.color);
    const [activeColorFormat, setActiveColorFormat] = useState<ColorPickerProps['format']>(value.format);
    const activeTemplateConfig: ActiveTemplateConfigType = useAppSelector(getActiveTemplateConfig);
    const [colorPresets, setColorPresets] = useState([])

    const colorString = useMemo(
        () => {
            // console.log(!(typeof activeColor === 'string' || activeColor instanceof String), activeColor)
            return activeColor ? (typeof activeColor === 'string' ? activeColor : activeColor.toHexString()) : ''
        },
        [activeColor],
    );

    const btnStyle: React.CSSProperties = {
        backgroundColor: colorString,
        borderColor: token.colorBorder
    };

    useEffect(() => {
        if (page == BACKGROUND_TYPES.GRADIENT) {
            setActiveColor(value.color);
        }
    }, [value])

    useEffect(() => {
        activeTemplateConfig && setColorPresets(removeObjRef(activeTemplateConfig.colors))
    }, [activeTemplateConfig])

    const onClickTransparency = () => {
        onChange({ color: NO_COLOR_VALUE, format: 'hex' })
    }

    // useEffect(() => {
    //     console.log("colorString", colorString)
    // onChange({
    //     color: colorString,
    //     format: activeColorFormat
    // })
    // }, [colorString])

    const onChangeColor = (color) => {
        setActiveColor(color.toHexString())
        onChange({
            color: color.toHexString(),
            format: activeColorFormat
        })
    }
    return (
        <div className={`${styleElementCSS.styleWrap} ${styles.colorPickerWrap}`} style={{ ...parentStyles }}>
            {label && <TextElement text={label} />}
            <div className={styles.elementWrap}>
                <ColorPicker
                    trigger="hover"
                    // presets={!hidePresets && Boolean(colorPresets) ? [...colorPresets] : []}
                    format={activeColorFormat}
                    onChange={onChangeColor}
                    placement="bottom"
                    allowClear
                    defaultValue={value}
                    value={value}
                    onFormatChange={setActiveColorFormat}
                >
                    <Button type="default" style={{ background: activeColor }}></Button>
                </ColorPicker>

                {!hideTransparency && <>
                    <Tooltip title="Remove Color">
                        <Button
                            type='text'
                            style={{
                                borderColor: value.color == NO_COLOR_VALUE ? token.colorPrimary : token.colorBorder
                            }}
                            icon={<RxTransparencyGrid />}
                            //    className={`${value.color == NO_COLOR_VALUE ? styles.noColor : ''}`}
                            onClick={onClickTransparency}></Button>
                    </Tooltip>
                </>}

                {!hideColorString &&
                    <Button type='text' className={`${styles.colorValue}`} >{value.color == NO_COLOR_VALUE ? 'Transperant' : colorString}</Button>
                }
            </div>
        </div>
    )
}

export default ColorPickerComponent