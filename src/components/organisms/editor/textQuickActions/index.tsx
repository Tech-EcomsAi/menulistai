import { FONT_SIZES } from "@constant/font"
import { useAppDispatch } from "@hook/useAppDispatch"
import { useAppSelector } from "@hook/useAppSelector"
import { _debounce } from "@hook/useDebounce"
import ColorStyle from "@molecules/styleElement/color"
import FontFamily from "@molecules/styleElement/fontFamily"
import { getActiveEditorComponent } from "@reduxSlices/activeEditorComponent"
import { getBuilderState, updateBuilderState } from "@reduxSlices/siteBuilderState"
import getBackground from "@util/getBackgroundStyle"
import { checkUidIsPresent, removeObjRef } from "@util/utils"
import { getColourValue } from "@util/websiteBuilder"
import { Button, Divider, Flex, Input, MenuProps, Popover, Select, Skeleton, Space, Spin } from "antd"
import { AnimatePresence, motion } from "framer-motion"
import { Fragment, useState } from "react"
import { GiSpellBook } from "react-icons/gi"
import { LuArrowLeft, LuArrowRight, LuArrowRightFromLine, LuArrowRightToLine, LuLaugh } from "react-icons/lu"
import { MdSpellcheck } from "react-icons/md"
import styles from './textQuickActions.module.scss'
const { TextArea } = Input;

function TextQuickActions({ config }) {

    const [error, setError] = useState({ id: '', message: '' });
    const [textPrompt, setTextPrompt] = useState('')
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState('')
    const [textSuggestions, setTextSuggestions] = useState([]);
    const [showTextSuggestions, setShowTextSuggestions] = useState(false)
    const builderState = useAppSelector(getBuilderState);
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const dispatch = useAppDispatch()

    const ACTIONS_LIST: MenuProps['items'] = [
        { key: '1', icon: <LuArrowRightToLine />, label: 'Make it Short' },
        { key: '2', icon: <LuArrowRightFromLine />, label: 'Make it Long' },
        { key: '3', icon: <MdSpellcheck />, label: 'Correct Grammar' },
        { key: '4', icon: <LuLaugh />, label: 'Make it More Readable' },
    ];

    const updateTextProps = (from, value, type = "style") => {
        const configCopy = removeObjRef(config);
        if (configCopy[type][from] !== value) {
            configCopy[type] = { ...configCopy[type], [from]: value };
            const listKey = Object.keys(builderState)[0];
            const builderStateCopy: any = removeObjRef(builderState);
            const components = removeObjRef(builderStateCopy[listKey]);
            const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
            if (index != -1) {
                const childIndex = components[index].children.findIndex((c: any) => c.uid == configCopy.uid);
                if (childIndex != -1) {
                    // console.log('after updatetextconfig', configCopy)
                    components[index].children[childIndex] = configCopy;
                    builderStateCopy[listKey] = components;
                    dispatch(updateBuilderState(builderStateCopy));
                }
            }
        }
    };

    const renderActionItem = () => {
        const items: any[] = [];
        if (showTextSuggestions) {
            if (textSuggestions.length && !isLoading || isLoading.includes("generatedText")) {
                items.push({
                    key: "back", label: <Space>
                        <Button style={{ fontSize: 15 }} type="link" icon={<LuArrowLeft />} >Show previous actions</Button>
                    </Space>
                })
                textSuggestions.map((text, i) => {
                    items.push({
                        key: `generatedText-${i}`, label:
                            <Spin spinning={isLoading == `generatedText-${i}`}>
                                <Space className={styles.generatedText}>
                                    <Button style={{ fontSize: 20 }} type="text" icon={<GiSpellBook />} />
                                    <Button type="text" className={styles.text}>{text}</Button>
                                </Space>
                            </Spin>
                    })
                })
            } else {
                items.push({
                    key: "back", label: <Space>
                        <Button style={{ fontSize: 15 }} type="link" >Hold on !!! Generating suggestions</Button>
                    </Space>
                })
                items.push({ key: `skeleton`, label: <Skeleton active /> })
            }
        } else {
            ACTIONS_LIST.map((action: any) => {
                items.push({
                    key: action.key,
                    label: <Space style={{ width: "100%" }} className={styles.actionMenu} styles={{ item: { width: "100%" } }} >
                        <Spin spinning={isLoading == action.key}>
                            <Button block type="text" icon={action.icon} >{action.label}</Button>
                        </Spin>
                    </Space>
                })
            })
            items.push({ key: '5', label: <Divider style={{ margin: "5px 0", cursor: "default" }} orientation="center">OR</Divider> });
            items.push({
                key: '6', label:
                    <Spin spinning={isLoading == "6"} style={{ width: "100%" }}>
                        <Space onClick={(e) => e.preventDefault()} direction="vertical" style={{ width: "100%" }}>
                            <TextArea
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                status={error.id == 'text' ? "error" : ''}
                                allowClear
                                size="large"
                                value={textPrompt}
                                placeholder="Enter text you want to create"
                                onChange={(e) => setTextPrompt(e.target.value)}
                            />
                            <Button onClick={generateTextClick} type="primary" size="large" block disabled={!Boolean(textPrompt)}>Generate Text</Button>
                            {Boolean(textSuggestions.length) &&
                                <Button
                                    icon={<LuArrowRight />}
                                    onClick={(e) => {
                                        setShowTextSuggestions(true); e.preventDefault()
                                    }} type="link"
                                    size="large"
                                    block>
                                    Show Generated Text
                                </Button>}
                        </Space>
                    </Spin>
            })
        }
        return items;
    }

    const handleMenuClick = (e: any) => {
        if (e.key == 'back') {
            setShowTextSuggestions(false)
        } else if (e.key.includes('generatedText')) {
            const index = e.key.split("generatedText-")[1];
            setIsLoading(e.key);
            setTimeout(() => {
                onChangeText("text", textSuggestions[index], 'props')
                setOpen(false)
                setIsLoading("");
            }, 1000);
        } else if (e.key.includes("skeleton")) return;
        else {
            console.log('click', e);
            if (e.key == "6" || Boolean(isLoading)) return
            setIsLoading(e.key)
            setTimeout(() => {
                setOpen(false)
                setIsLoading("");
            }, 5000);
        }
    };

    const onChangeText = _debounce(updateTextProps, 1000);

    const generateTextClick = () => {
        setIsLoading("6")
        setShowTextSuggestions(true);
        setTimeout(() => {
            setIsLoading("")
            setTextSuggestions(["Welcome to ecoms.ai", "Transform Your Salon Experience with ecoms.ai", "Join the ecoms.ai Community and Experience Service Like Never Before"])
        }, 5000);
    }

    return (
        <Fragment>
            <Popover
                // open
                destroyTooltipOnHide
                trigger={["click", "contextMenu"]}
                placement='bottom'
                zIndex={6}
                content={<>
                    <Flex vertical gap={10}>
                        <Flex gap={10}>
                            <FontFamily style={{ width: 150 }} value={config.style.fontFamily} onChange={updateTextProps} />
                            <Flex vertical gap={10} style={{ width: "100%" }}>
                                <Select
                                    showSearch
                                    value={config.style.fontSize}
                                    style={{ width: '100%' }}
                                    onChange={(value) => updateTextProps("fontSize", value)}
                                    options={FONT_SIZES}
                                />
                            </Flex>
                            <ColorStyle showText={false} showTransperancy={false} value={config.style.color} onChange={(color) => updateTextProps("color", color)} />
                        </Flex>
                        <Divider plain style={{ margin: "0", borderInlineStartWidth: "2px", top: "2px", }} />
                        <Flex vertical style={{ width: "100%" }} >
                            {renderActionItem().map((item: any, i: number) => {
                                return <Fragment key={item.key}>
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={styles.selectedItemCheck}
                                            onClick={() => handleMenuClick({ key: item.key })}
                                        >
                                            {item.label}
                                        </motion.div>
                                    </AnimatePresence>
                                </Fragment>
                            })}
                        </Flex>
                    </Flex>
                </>}
            >
                <span
                    style={{
                        ...config.style,
                        color: getColourValue(config?.style),
                        ...getBackground(config.background),
                    }}
                    className={`${styles.editableContent} editableContent`}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const spanElement = e.target as HTMLSpanElement
                        updateTextProps("text", spanElement.innerText, 'props')
                    }}
                >{config.props?.text}</span>
            </Popover>
        </Fragment>
    )
}

export default TextQuickActions