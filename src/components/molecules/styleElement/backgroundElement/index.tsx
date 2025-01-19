import Saperator from '@atoms/Saperator';
import { BACKGROUND_TYPES } from '@constant/common';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { Flex, Segmented, Typography, theme } from 'antd';
import { IoMdColorFilter } from 'react-icons/io';
import { LuImage } from 'react-icons/lu';
import { VscColorMode } from 'react-icons/vsc';
import { COLOR_INITIAL_VALUE, GRADIENT_INITIAL_VALUE, IMAGE_INITIAL_VALUE } from 'src/data/backgroundStyleValues';
import BackgroundColor from '../backgroundColor';
import BackgroundImage from '../backgroundImage';
import GradientColor from '../gradientColor';
const { Text } = Typography
const SEGMENT_OPTIONS = [
    { value: BACKGROUND_TYPES.COLOR, key: BACKGROUND_TYPES.COLOR, icon: <IoMdColorFilter /> },
    { value: BACKGROUND_TYPES.GRADIENT, key: BACKGROUND_TYPES.GRADIENT, icon: <VscColorMode /> },
    { value: BACKGROUND_TYPES.IMAGE, key: BACKGROUND_TYPES.IMAGE, icon: <LuImage /> },
]

const valueSample = {
    value: '#000',
    type: 'Color',
    colors: [{ color: '#000', format: 'hex' }]
}

function BackgroundElement({ component = '', onChange, value }) {
    const { token } = theme.useToken();

    const onChangeBgColor = (newColor) => {
        const valueCopy = { ...value };
        valueCopy.value = [newColor];
        onChange(valueCopy);
    }

    const onChangeType = (type) => {
        if (type == BACKGROUND_TYPES.COLOR) {
            onChange(COLOR_INITIAL_VALUE);
        } else if (type == BACKGROUND_TYPES.GRADIENT) {
            onChange(GRADIENT_INITIAL_VALUE);
        } else {
            onChange(IMAGE_INITIAL_VALUE);
        }
    }

    return (
        <>
            <EditorWrapper>
                <Text strong>Background</Text>
                <Flex vertical gap={10} style={{ width: "100%" }}>
                    <Segmented
                        onChange={(tab: any) => onChangeType(tab)}
                        options={[BACKGROUND_TYPES.COLOR, BACKGROUND_TYPES.GRADIENT, BACKGROUND_TYPES.IMAGE]}
                        block />
                    {value?.type == BACKGROUND_TYPES.COLOR && <BackgroundColor value={value?.value[0]} onChange={(newColor) => onChangeBgColor(newColor)} />}
                    {value?.type == BACKGROUND_TYPES.GRADIENT && <GradientColor value={value} onChange={onChange} />}
                    {value?.type == BACKGROUND_TYPES.IMAGE && (<BackgroundImage component={component} value={value} onChange={onChange} />)}
                </Flex>
            </EditorWrapper>
            <Saperator />
        </>
    )
}

export default BackgroundElement;