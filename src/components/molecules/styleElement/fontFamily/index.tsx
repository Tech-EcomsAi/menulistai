import { CRAFT_BUILDER_APP } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { CraftBuilderGlobalDataContext } from '@providers/craftBuilderGlobalDataProvider';
import { getDarkModeState } from '@reduxSlices/clientThemeConfig';
import { toggleLoader } from '@reduxSlices/loader';
import { FontPresetsType } from '@template/craftBuilder/types';
import { CraftBuilderGlobalDataType } from '@type/craftBuilderContextType';
import { Flex, Select, Typography } from 'antd';
import { fabric } from "fabric";
import FontFaceObserver from 'fontfaceobserver';
import { useContext } from 'react';
const { Text } = Typography

export default function FontFamily({ value, onChange, currentPage = "", showLabel = false, style = {} }) {

    const dispatch = useAppDispatch()
    const isDark = useAppSelector(getDarkModeState);
    const { fontsPresets } = useContext<CraftBuilderGlobalDataType>(CraftBuilderGlobalDataContext)

    const onChangeValue = (fontCode) => {
        if (!fontCode) return;
        const fontDetails = fontsPresets.find(f => f.code == fontCode)
        dispatch(toggleLoader("FontFamily:onChangeValue"))
        // font loading for canvas
        const font = new FontFaceObserver(fontCode);
        font.load(null, 150000).then(() => {
            if (currentPage == CRAFT_BUILDER_APP) {
                fabric.fontPaths = { [fontDetails.code]: fontDetails.fileUrl };
            }
            onChange('fontFamily', fontCode)
            dispatch(toggleLoader(false))
        }).catch((err) => {
            console.log(err);
            dispatch(toggleLoader(false))
        });
    }

    const getFontsList = () => {
        const fonts: any[] = [];
        (fontsPresets.sort((a, b) => a.index - b.index)).map((fontDetails: FontPresetsType) => {
            fonts.push(
                {
                    label: <>
                        <Flex style={{ width: "100%", padding: "2px 0" }} align="center" justify="center">
                            {isDark ?
                                <img style={{ width: "auto", height: "100%", maxHeight: "20px" }} src={fontDetails.whiteTextUrl} />
                                :
                                <img style={{ width: "auto", height: "100%", maxHeight: "20px" }} src={fontDetails.blackTextUrl} />
                            }
                        </Flex>
                    </>,
                    value: fontDetails.code
                },
            )
        })
        return fonts;
    }

    return (
        <Flex vertical gap={10} style={{ width: "100%" }}>
            {showLabel && <Text strong>Font Style</Text>}
            <Select
                showSearch
                defaultValue={value}
                style={{ width: '100%', ...style }}
                onChange={(value) => onChangeValue(value)}
                optionLabelProp="label"
                value={value}
                options={getFontsList()}
            />
        </Flex>

    )
}
