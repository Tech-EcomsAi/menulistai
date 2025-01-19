
import { Flex, Typography } from "antd"
import { Fragment, memo } from "react"
import AiTextSuggestionsRenderer from "."
import styles from './styles.module.scss'
const { Text } = Typography

function TextSuggestionsList({ previewMode = false, suggestions = [], selectedSuggestion = null, setSelectedSuggestion = null }) {
    if (!suggestions.length) return null
    return <Flex vertical gap={20} className={styles.textSuggestionsWrap}>
        <Text>Select text do you want to add to canvas</Text>
        <Flex vertical gap={10}>
            {suggestions.map((suggestion: any, i: number) => {
                return <Fragment key={i}>
                    <AiTextSuggestionsRenderer previewMode={previewMode} selectedSuggestion={selectedSuggestion} suggestion={suggestion} setSelectedSuggestion={setSelectedSuggestion} />
                </Fragment>
            })}
        </Flex>
    </Flex>
}

export default memo(TextSuggestionsList)