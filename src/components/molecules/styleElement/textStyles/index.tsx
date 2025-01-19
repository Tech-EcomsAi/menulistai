import Saperator from '@atoms/Saperator';
import { TEXT_STYLES_VARIABLES } from '@constant/builder';
import { FONT_LIST, FONT_SIZES } from '@constant/font';
import { useAppSelector } from '@hook/useAppSelector';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { ActiveTemplateConfigType, getActiveTemplateConfig } from '@reduxSlices/siteBuilderState';
import { getStyleValueAndType } from '@util/getColorsValue';
import { Button, Card, Flex, Input, Popover, Select, Tag, Typography } from 'antd';
import { TbItalic, TbLetterCase, TbLetterCaseLower, TbLetterCaseUpper } from 'react-icons/tb';
import ColorStyle from '../color';
const { Text, Title } = Typography
const { Option } = Select;

const OverflowTypeList = [
    { label: 'visible', value: 'visible' },
    { label: 'Hidden', value: 'hidden' },
    { label: 'Scroll', value: 'scroll' },
    { label: 'Auto', value: 'auto' },
]


const FontUnitList = [
    { label: 'px', value: 'px' },
    { label: '%', value: '%' }
]

const WordingMode = [
    { label: 'Vertical', value: 'vertical-rl' },
    { label: 'Normal', value: 'horizontal-tb' }
]

const DecorationList = [
    { label: 'Overline', value: 'overline' },
    { label: 'Line Through', value: 'line-through' },
    { label: 'Underline', value: 'underline' },
    { label: 'Both Line', value: 'underline overline' },
]

const DecorationStyleList = [
    { label: 'Solid', value: 'solid' },
    { label: 'Wavy', value: 'wavy' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Double', value: 'double' },
]

const FontWeightList = [
    { label: "Thin", value: 100 },
    { label: "Extra Light", value: 200 },
    { label: "Light", value: 300 },
    { label: "Regular", value: 400 },
    { label: "Medium", value: 500 },
    { label: "Semibold", value: 600 },
    { label: "Bold", value: 'bold' },
    { label: "Extra Bold", value: 'bolder' },
    { label: "Black", value: 'normal' },
]

const SITE_SETTINGS = "SITE_SETTINGS";

const DecoraionLineSizes = [];
for (let i = 1; i <= 15; i++) {
    DecoraionLineSizes.push({ label: `${i}px`, value: `${i}px` })
}

function TextStyles({ config, onChange, fromPage = "", handleStyleVariableChange = null }) {

    const activeTemplateConfig: ActiveTemplateConfigType = useAppSelector(getActiveTemplateConfig);

    const onChangeValue = (from, value) => {
        onChange(from, value);
    }

    const renderStyleLabel = (style) => {
        return <Flex>
            <Popover placement='left' content={
                <Card
                    title={<Flex>
                        <Tag>{style}</Tag>
                        <Text>{TEXT_STYLES_VARIABLES[style]}</Text>
                    </Flex>}>
                    <Text style={activeTemplateConfig.textStyles[style]}>{TEXT_STYLES_VARIABLES[style]}</Text>
                </Card>}>
                <Tag>{style}</Tag>
                <Text>{TEXT_STYLES_VARIABLES[style]}</Text>
            </Popover>
        </Flex>
    }

    const TEXT_STYLES_OPTIONS: any[] = Object.keys(TEXT_STYLES_VARIABLES).map((style) => ({ value: style, label: renderStyleLabel(style) }))

    return (
        <EditorWrapper>
            <Text strong>Text Styles</Text>

            <Flex justify='space-between' vertical gap={10}>

                {fromPage !== SITE_SETTINGS && <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Typo Styles</Text>
                    <Select
                        defaultValue={''}
                        value={config.textStyleVariable}
                        style={{ width: '100%' }}
                        onChange={(value) => handleStyleVariableChange(value)}
                        options={[{
                            value: "", label: <Flex><Text>Unset</Text></Flex>
                        }, ...TEXT_STYLES_OPTIONS]}
                    />
                </Flex>}

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Font Style</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['fontFamily']}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('fontFamily', value)}
                        optionLabelProp="label"
                        options={FONT_LIST}
                    />
                </Flex>

                {fromPage !== SITE_SETTINGS ? <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Font Size</Text>
                    <Input
                        placeholder="00"
                        maxLength={3}
                        defaultValue={getStyleValueAndType(config.style['fontSize']).value}
                        style={{ width: '100%' }}
                        onBlur={(value) => onChangeValue('fontSize', `${value.target.value}px`)}
                    />

                    <Select
                        defaultValue={'px'}
                        value={getStyleValueAndType(config.style["fontSize"]).type}
                        style={{ width: '60px' }}
                        onChange={(value) => onChangeValue("fontSize", `${getStyleValueAndType(config.style["fontSize"]).value}${value}`)}
                        options={FontUnitList}
                    />
                </Flex> : <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Font Size</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['fontSize']}
                        style={{ width: "100%" }}
                        onChange={(value) => onChangeValue('fontSize', value)}
                        options={FONT_SIZES}
                    />
                </Flex>}

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Font Weight</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['fontWeight']}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('fontWeight', value)}
                        options={FontWeightList}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Color</Text>
                    <ColorStyle showTransperancy={fromPage !== SITE_SETTINGS} value={Boolean(config?.style?.color) ? config?.style?.color : '#00000'} onChange={(value) => onChange('color', value)} label="" />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Letter Spacing</Text>
                    <Input
                        placeholder="00"
                        maxLength={2}
                        defaultValue={getStyleValueAndType(config.style['letterSpacing']).value}
                        style={{ width: '100%' }}
                        onBlur={(value) => onChangeValue('letterSpacing', `${value.target.value}px`)}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Line Height</Text>
                    <Input
                        placeholder="00"
                        maxLength={2}
                        defaultValue={getStyleValueAndType(config.style['lineHeight']).value}
                        style={{ width: '100%' }}
                        onBlur={(value) => onChangeValue('lineHeight', `${value.target.value}px`)}
                    />
                </Flex>

                {fromPage !== SITE_SETTINGS && <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Writing Mode</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['writingMode']}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('writingMode', value)}
                        options={WordingMode}
                    />
                </Flex>}

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Decorations</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['textDecoration']}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('textDecoration', value)}
                        options={DecorationList}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Decoration Line Type</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['textDecorationStyle']}
                        style={{ width: 100 }}
                        onChange={(value) => onChangeValue('textDecorationStyle', value)}
                        options={DecorationStyleList}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 100 }}>Decoration Line Size</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['textDecorationThickness']}
                        style={{ width: 100 }}
                        onChange={(value) => onChangeValue('textDecorationThickness', value)}
                        options={DecoraionLineSizes}
                    />
                </Flex>


                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: 50 }}>Style</Text>
                    <Button block
                        style={{ fontSize: 18 }}
                        type={config.style['fontStyle'] == 'italic' ? "primary" : "default"}
                        onClick={() => onChangeValue("fontStyle", config.style['fontStyle'] == 'italic' ? "unset" : "italic")}
                        icon={<TbItalic />}
                    />
                    <Button block
                        style={{ fontSize: 18 }}
                        type={config.style['textTransform'] == 'uppercase' ? "primary" : "default"}
                        onClick={() => onChangeValue("textTransform", config.style['textTransform'] == 'uppercase' ? "unset" : "uppercase")}
                        icon={<TbLetterCaseUpper />}
                    />
                    <Button block
                        style={{ fontSize: 18 }}
                        type={config.style['textTransform'] == 'lowercase' ? "primary" : "default"}
                        onClick={() => onChangeValue("textTransform", config.style['textTransform'] == 'lowercase' ? "unset" : "lowercase")}
                        icon={<TbLetterCaseLower />}
                    />
                    <Button block
                        style={{ fontSize: 18 }}
                        type={config.style['textTransform'] == 'capitalize' ? "primary" : "default"}
                        onClick={() => onChangeValue("textTransform", config.style['textTransform'] == 'capitalize' ? "unset" : "capitalize")}
                        icon={<TbLetterCase />}
                    />
                </Flex>

            </Flex>
            {fromPage !== SITE_SETTINGS && <Saperator />}
        </EditorWrapper>
    )
}

export default TextStyles