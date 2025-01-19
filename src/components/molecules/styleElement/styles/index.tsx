import Saperator from '@atoms/Saperator';
import EditorWrapper from '@organisms/editor/editorWrapper';
import { Flex, Input, Select, Slider, Typography, theme } from 'antd';
const { Text, Title } = Typography

const OverflowTypeList = [
    { label: 'visible', value: 'visible' },
    { label: 'Hidden', value: 'hidden' },
    { label: 'Scroll', value: 'scroll' },
    { label: 'Auto', value: 'auto' },
]


// //

// opacity || visibility || overflow || rotation || zindex
// //

function Styles({ config, onChange }) {
    const { token } = theme.useToken();

    const onChangeValue = (from, value) => {
        onChange(from, value);
    }

    return (
        <EditorWrapper>
            <Text strong>Styles</Text>

            <Flex justify='space-between' vertical gap={10}>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "100px" }}>Opacity</Text>
                    <Slider
                        style={{ width: '100%' }}
                        min={0}
                        max={1}
                        step={0.2}
                        onChange={(value) => onChangeValue('opacity', value)}
                        value={(config.style['opacity'] || 1)}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "100px" }}>Overflow</Text>
                    <Select
                        defaultValue={''}
                        value={config.style['overflow']}
                        style={{ width: '100%' }}
                        onChange={(value) => onChangeValue('overflow', value)}
                        options={OverflowTypeList}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "100px" }}>Rotation</Text>
                    <Slider
                        style={{ width: '100%' }}
                        min={0}
                        max={360}
                        step={5}
                        onChange={(value) => onChangeValue('rotate', `${value}deg`)}
                        value={Boolean(config.style['rotate']) ? Number((`${config.style['rotate']}`).split("deg")[0]) : 0}
                    />
                </Flex>

                <Flex justify='space-between' gap={10} align='center'>
                    <Text style={{ minWidth: "100px" }}>Z-Index</Text>
                    <Input
                        placeholder="00"
                        maxLength={3}
                        defaultValue={config.style['zIndex']}
                        style={{ width: '100%' }}
                        onBlur={(value) => onChangeValue('zIndex', value.target.value)}
                    />
                </Flex>
            </Flex>
            <Saperator />
        </EditorWrapper>
    )
}

export default Styles