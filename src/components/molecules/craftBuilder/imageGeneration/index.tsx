import { AiImageGenerationModalData } from '@template/craftBuilder/types'
import { Button, Flex, Input, Tag, Tooltip, Typography } from 'antd'
import { Fragment } from 'react'
import { LuRectangleHorizontal, LuRectangleVertical, LuSquare } from 'react-icons/lu'
const { Text } = Typography

const emptyModalData: AiImageGenerationModalData = {
    prompt: "",
    size: "256x256"
}

const SIZES = [
    { label: "is a square image", title: "Square", width: 80, height: 80, icon: <LuSquare />, key: "256x256" },
    { label: "is a square image", title: "Square", width: 100, height: 100, icon: <LuSquare />, key: "512x512" },
    { label: "is a square image", title: "Square", width: 120, height: 120, icon: <LuSquare />, key: "1024x1024" },
    { label: "is a portrait-oriented image (taller than wide)", title: "Wide", width: 140, height: 80, icon: <LuRectangleHorizontal />, key: "1792x1024" },
    { label: "is a landscape-oriented image (wider than tall)", title: "Tall", width: 100, height: 120, icon: <LuRectangleVertical />, key: "1024x1792" },
]

const SQUARE_SIZES = [
    { label: "is a square image", title: "Square", width: 80, height: 80, icon: <LuSquare />, key: "256x256" },
    { label: "is a square image", title: "Square", width: 100, height: 100, icon: <LuSquare />, key: "512x512" },
    { label: "is a square image", title: "Square", width: 120, height: 120, icon: <LuSquare />, key: "1024x1024" },
]

const OTHER_SIZES = [
    { label: "is a portrait-oriented image (taller than wide)", title: "Wide", width: 200, height: 80, icon: <LuRectangleHorizontal />, key: "1792x1024" },
    { label: "is a landscape-oriented image (wider than tall)", title: "Tall", width: 100, height: 140, icon: <LuRectangleVertical />, key: "1024x1792" },
]

function ImageGenerationInputs({ promptData, setPromptData }: { promptData: AiImageGenerationModalData, setPromptData: any }) {

    return (
        <Flex vertical gap={20} style={{ overflow: "auto", maxHeight: 500 }}>
            <Flex vertical gap={15}>
                <Text strong>Describe your creation in detail here</Text>
                <Input.TextArea
                    onKeyDown={(e) => e.key == "Enter" ? e.preventDefault() : ''}
                    showCount
                    autoSize
                    style={{ minHeight: 50 }}
                    maxLength={1000}
                    value={promptData.prompt}
                    onChange={(e) => setPromptData({ ...promptData, prompt: e.target.value })}
                    placeholder="What do you want to see? Tip: Start your prompt with a subject (like &quot;a cat&quot;)"
                    defaultValue={promptData.prompt}
                />
            </Flex>
            <Flex vertical gap={15}>
                <Text strong>Select Size of the image (Aspect Ratio)</Text>
                {[SQUARE_SIZES, OTHER_SIZES].map((sizes, i) => {
                    return <Flex justify='center' align='flex-end' gap={10} key={i}>
                        {sizes.map((size: any, i: number) => {
                            return <Fragment key={i}>
                                <Tooltip title={`${size.key}px Resolution`}>
                                    <Button onClick={() => setPromptData({ ...promptData, size: size.key })}
                                        ghost={promptData.size == size.key}
                                        styles={{ icon: { fontSize: 30, margin: 0 } }}
                                        type={promptData.size == size.key ? "primary" : "default"}
                                        style={{ width: size.width, height: size.height, flexDirection: "column", }}
                                        icon={size.icon}
                                    >{size.title}</Button>
                                </Tooltip>
                            </Fragment>
                        })}
                    </Flex>
                })}
            </Flex>
            {Boolean(promptData.prompt) && Boolean(promptData.size) && <Flex align='center' justify='center' style={{ maxWidth: 500 }}>
                <Tag color='blue' style={{ fontSize: 13, lineHeight: 2, whiteSpace: "normal", textAlign: "center" }}>Generate image for: {promptData.prompt} which {SIZES.filter((s) => s.key == promptData.size)[0]?.label} ({promptData.size} px)</Tag>
            </Flex>}
        </Flex>
    )
}

export default ImageGenerationInputs