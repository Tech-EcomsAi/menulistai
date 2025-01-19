import { Flex, Input, Typography } from 'antd'
const { Text } = Typography

function TextSuggestionsInput({ userPrompt, setUserPrompt }) {
    return (
        <Flex vertical gap={10}>
            <Text>Enter your topic(s) or keyword(s) to generate text using AI</Text>
            <Input.TextArea
                onKeyDown={(e) => e.key == "Enter" ? e.preventDefault() : ''}
                showCount
                autoSize
                maxLength={80}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Ex. birthday wishes"
                defaultValue={userPrompt}
            />
        </Flex>
    )
}

export default TextSuggestionsInput