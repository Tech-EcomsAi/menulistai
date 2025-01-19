import { useAppDispatch } from '@hook/useAppDispatch';
import { CraftBuilderContext } from '@providers/creaftBuilderProvider';
import { toggleLoader } from '@reduxSlices/loader';
import { showErrorToast, showSuccessToast } from '@reduxSlices/toast';
import { addIText, addTextArea, replaceText } from '@template/craftBuilder/utility/text';
import { CraftBuilderContextType } from '@type/craftBuilderContextType';
import { Button, Flex, Typography } from 'antd';
import { Fragment, memo, useContext } from 'react';
import { LuArrowDownRight, LuCheckCircle } from 'react-icons/lu';
import styles from './styles.module.scss';
const { Text } = Typography;

function AiTextSuggestionsRenderer({ suggestion, selectedSuggestion = null, setSelectedSuggestion = null, previewMode = false }) {

    const { canvas, updateLocalCanvas, activeObjectsState } = useContext<CraftBuilderContextType>(CraftBuilderContext)
    const [heading, content] = suggestion?.split(":");
    const active = selectedSuggestion == suggestion;
    const dispatch = useAppDispatch();

    const addToCanvas = (type) => {
        if (!suggestion) {
            dispatch(showErrorToast("Please select suggestion first"));
            return;
        }
        dispatch(toggleLoader("AiTextSuggestionsRenderer:addToCanvas"))
        const [heading, content] = suggestion.split(":");

        var fun = type == "Add" ? addIText : replaceText
        fun(heading, { textAlign: 'center', fontSize: 30 }, canvas, updateLocalCanvas);

        setTimeout(() => {
            if (Boolean(content)) {
                var fun = type == "Add" ? addTextArea : replaceText
                fun(content, { textAlign: 'center', fontSize: 20 }, canvas, updateLocalCanvas);
            }
            Boolean(setSelectedSuggestion) && setSelectedSuggestion("");
            dispatch(showSuccessToast(`Text ${type == "Add" ? "Added" : "Replaceed"} successfully`));
            dispatch(toggleLoader(false));
        }, 200);
    }

    const onClickSuggestion = () => {
        if (previewMode) {
            setSelectedSuggestion(suggestion)
        } else {
            const type = activeObjectsState.isSelected ? "Replace" : "Add"
            addToCanvas(type);
        }
    }

    return (<Fragment key={heading}>
        {Boolean(suggestion) && <>
            <Button
                block
                styles={{ icon: { fontSize: 20, opacity: 0.6 } }}
                size="middle"
                className={styles.textSuggestion}
                icon={active ? <LuCheckCircle /> : <LuArrowDownRight />}
                type={active ? "primary" : "default"}
                ghost={active}
                onClick={onClickSuggestion}>
                <Flex vertical gap={10}>
                    <Text strong={Boolean(content)}>{heading}</Text>
                    {Boolean(content && content != heading) && <Text>{content}</Text>}
                </Flex>
            </Button>
        </>}
    </Fragment>
    )
}

export default memo(AiTextSuggestionsRenderer)