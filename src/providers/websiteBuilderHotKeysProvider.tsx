'use client';
import { PANEL_ACTIONS_LIST } from "@constant/builder";
import { updateTemplateConfig } from "@database/collections/websiteTemplateConfig";
import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import { activeEditorComponentInitialState, getActiveEditorComponent, updateActiveEditorComponent } from "@reduxSlices/activeEditorComponent";
import { MODAL_PAGES_LIST, updateActiveModalPage } from "@reduxSlices/common";
import { BuilderHistoryType, getActiveTemplateConfig, getBuilderHistory, getBuilderSidebarPanelAction, getBuilderState, updateBuilderHistory, updateBuilderSavedState, updateBuilderSidebarPanelAction, updateBuilderState } from "@reduxSlices/siteBuilderState";
import { showErrorToast, showSuccessToast } from "@reduxSlices/toast";
import { move, toArray } from "@util/moveItem";
import { checkUidIsPresent, removeObjRef } from "@util/utils";
import { DescriptionsProps, Tag } from "antd";
import { useEffect } from "react";
import ReactHotkeys from "react-hot-keys";


const getTag = (key: string) => {
    return <Tag color="cyan" style={{ fontSize: 12, padding: "2px 6px" }}>{key}</Tag>
}

export const SHORTCUTS_KEYS_LIST: DescriptionsProps['items'] = [
    {
        key: "esc",
        label: "Clear selections & Close sidebars",
        children: <>
            {getTag('esc')}
            {getTag('escape')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "Backspace",
        label: "Delete selected section",
        children: <>
            {getTag('Backspace')}
            {getTag('delete')}
            {getTag('del')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+z",
        label: "Undo current changes",
        children: <>
            {getTag('ctrl+z')}
            {getTag('command+z')}
            {getTag('control+z')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+shift+z",
        label: "Redo current changes",
        children: <>
            {getTag('ctrl+shift+z')}
            {getTag('command+shift+z')}
            {getTag('control+shift+z')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+s",
        label: "Save current changes",
        children: <>
            {getTag('ctrl+s')}
            {getTag('command+s')}
            {getTag('control+s')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+enter",
        label: "Select first section to edit",
        children: <>
            {getTag('ctrl+enter')}
            {getTag('command+return')}
            {getTag('control+enter')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "up",
        label: "Select upper section",
        children: <>
            {getTag('up')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "down",
        label: "Select lower section",
        children: <>
            {getTag('down')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "alt+up",
        label: "Move selected section to up",
        children: <>
            {getTag('alt+up')}
            {getTag('⌥+up')}
            {getTag('option+up')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "alt+down",
        label: "Move selected section to down",
        children: <>
            {getTag('alt+down')}
            {getTag('⌥+down')}
            {getTag('option+down')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+a",
        label: "Open quick actions",
        children: <>
            {getTag('ctrl+a')}
            {getTag('command+a')}
            {getTag('control+a')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    }, {
        key: "ctrl+k",
        label: "Open keyboard shortcuts",
        children: <>
            {getTag('ctrl+k')}
            {getTag('command+k')}
            {getTag('control+k')}
        </>,
        contentStyle: { marginLeft: "auto", justifyContent: "flex-end" }
    },
]

export default function WebsiteBuilderHotKeysProvider({ children }) {

    const dispatch = useAppDispatch();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const builderSidebarPanelAction = useAppSelector(getBuilderSidebarPanelAction);
    const builderState = useAppSelector(getBuilderState);
    const historyState: BuilderHistoryType = useAppSelector(getBuilderHistory);
    const activeTemplateConfig = useAppSelector(getActiveTemplateConfig);

    useEffect(() => {
        window.addEventListener('keypress', handleWindowClick);
        return () => window.removeEventListener('click', handleWindowClick);
    }, [])

    const handleWindowClick = (e) => {
        console.log(e)
    }
    const onEscape = () => {
        console.log("esc")
        if (Boolean(activeComponent?.uid)) {
            dispatch(updateActiveEditorComponent(activeEditorComponentInitialState))
        } else if (builderSidebarPanelAction) {
            dispatch(updateBuilderSidebarPanelAction(""))
        }
    }

    const onBackspace = () => {
        console.log("Backspace")
        if (Boolean(activeComponent?.uid)) {
            const builderStateCopy: any = { ...builderState };
            const stateId = Object.keys(builderState)[0];
            const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
            const components: any = [...toArray(builderStateCopy[stateId])];
            components.splice(index, 1);
            builderStateCopy[stateId] = components;
            dispatch(updateActiveEditorComponent(activeEditorComponentInitialState))
            dispatch(updateBuilderState(builderStateCopy))
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.SECTIONS))
        }
    }

    const onUndo = () => {
        let historyStateCopy: BuilderHistoryType = removeObjRef(historyState);
        if (historyStateCopy.currentIndex > 0) {
            const prevIndex = historyStateCopy.currentIndex - 1
            const prevEditorState = { ...historyStateCopy.state[prevIndex] }
            historyStateCopy.currentIndex = prevIndex;
            historyStateCopy.updating = true;
            dispatch(updateBuilderState(prevEditorState))
            dispatch(updateBuilderHistory(historyStateCopy))
        }
    }

    const onRedo = () => {
        let historyStateCopy: BuilderHistoryType = removeObjRef(historyState);
        if (historyStateCopy.currentIndex < historyStateCopy.state.length - 1) {
            const prevIndex = historyStateCopy.currentIndex + 1
            const prevEditorState = { ...historyStateCopy.state[prevIndex] }
            historyStateCopy.currentIndex = prevIndex;
            historyStateCopy.updating = true;
            dispatch(updateBuilderState(prevEditorState))
            dispatch(updateBuilderHistory(historyStateCopy))
        }
    }

    const onSave = (keyboardEvent: any) => {
        const stateId = Object.keys(builderState)[0];
        if (Boolean(activeTemplateConfig?.uid) && (historyState.currentIndex > 0)) {
            updateTemplateConfig({ ...activeTemplateConfig, templateState: { [activeTemplateConfig.uid]: builderState[stateId] } }, activeTemplateConfig.uid)
                .then((response: any) => {
                    dispatch(updateBuilderSavedState(builderState))
                    dispatch(updateBuilderHistory({ ...historyState, state: [{ [activeTemplateConfig.uid]: builderState[stateId] }] }))
                    dispatch(showSuccessToast('Changes saved successfully'));
                })
                .catch((error: any) => {
                    dispatch(showErrorToast('Something wents wrong'));
                    console.log('error', error)
                })
        } else {
            dispatch(showSuccessToast('Changes already saved'));
        }
    }

    const onEnter = () => {
        if (!Boolean(activeComponent?.uid)) {
            const stateId = Object.keys(builderState)[0];
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
            dispatch(updateActiveEditorComponent({ uid: builderState[stateId][0]?.uid, originalState: builderState[stateId][0] }))
        }
    }

    const onMoveUp = () => {
        const builderStateCopy: any = { ...builderState };
        const stateId = Object.keys(builderState)[0];
        const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
        if (index !== 0) {
            builderStateCopy[stateId] = move(builderStateCopy[stateId], { from: index, to: index - 1 });
            dispatch(updateActiveEditorComponent({ uid: builderStateCopy[stateId][index - 1]?.uid, originalState: builderStateCopy[stateId][index - 1] }))
            dispatch(updateBuilderState(builderStateCopy))
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
        }
    }

    const onUp = () => {
        const builderStateCopy: any = { ...builderState };
        const stateId = Object.keys(builderState)[0];
        const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
        if (index !== 0) {
            dispatch(updateActiveEditorComponent({ uid: builderStateCopy[stateId][index - 1]?.uid, originalState: builderStateCopy[stateId][index - 1] }))
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
        }
    }

    const onMoveDown = () => {
        const builderStateCopy: any = { ...builderState };
        const stateId = Object.keys(builderState)[0];
        const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
        if (index !== builderStateCopy[stateId].length - 1) {
            builderStateCopy[stateId] = move(builderStateCopy[stateId], { from: index + 1, to: index });
            dispatch(updateActiveEditorComponent({ uid: builderStateCopy[stateId][index + 1]?.uid, originalState: builderStateCopy[stateId][index + 1] }))
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
            dispatch(updateBuilderState(builderStateCopy))
        }
    }

    const onDown = () => {
        const builderStateCopy: any = { ...builderState };
        const stateId = Object.keys(builderState)[0];
        const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
        if (index !== builderStateCopy[stateId].length - 1) {
            dispatch(updateActiveEditorComponent({ uid: builderStateCopy[stateId][index + 1]?.uid, originalState: builderStateCopy[stateId][index + 1] }))
            dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
        }
    }

    const onShortcutModal = () => {
        dispatch(updateActiveModalPage(MODAL_PAGES_LIST.WEBSITE_BUILDER_SHORTCUTS_PAGE))
    }

    const onQuickActionModal = () => {
        dispatch(updateActiveModalPage(MODAL_PAGES_LIST.WEBSITE_BUILDER_ACTIONS_PAGE))
    }

    const KEYS_LIST = [
        { key: "esc", action: onEscape },
        { key: "escape", action: onEscape },

        { key: "Backspace", action: onBackspace },
        { key: "delete", action: onBackspace },
        { key: "del", action: onBackspace },

        { key: "ctrl+z", action: onUndo },
        { key: "command+z", action: onUndo },
        { key: "control+z", action: onUndo },

        { key: "ctrl+shift+z", action: onRedo },
        { key: "command+shift+z", action: onRedo },
        { key: "control+shift+z", action: onRedo },

        { key: "ctrl+s", action: onSave },
        { key: "command+s", action: onSave },
        { key: "control+s", action: onSave },

        { key: "ctrl+enter", action: onEnter },
        { key: "command+enter", action: onEnter },
        { key: "control+enter", action: onEnter },

        { key: "ctrl+return", action: onEnter },
        { key: "command+return", action: onEnter },
        { key: "control+return", action: onEnter },

        { key: "up", action: onUp },

        { key: "down", action: onDown },

        { key: "alt+up", action: onMoveUp },
        { key: "⌥+up", action: onMoveUp },
        { key: "option+up", action: onMoveUp },

        { key: "alt+down", action: onMoveDown },
        { key: "⌥+down", action: onMoveDown },
        { key: "option+down", action: onMoveDown },

        { key: "ctrl+k", action: onShortcutModal },
        { key: "command+k", action: onShortcutModal },
        { key: "control+k", action: onShortcutModal },

        { key: "ctrl+a", action: onQuickActionModal },
        { key: "command+a", action: onQuickActionModal },
        { key: "control+a", action: onQuickActionModal },
    ]

    const onKeyboardKeyDown = (...props: any) => {
        const [keyName, keyboardEvent, eventDetails] = props[0];
        console.log("keyName", keyName)
        KEYS_LIST.find(key => key.key == keyName).action(keyboardEvent)
    }

    return (
        <ReactHotkeys
            onKeyDown={(keyName, e, handle) => e.preventDefault()}
            keyName={KEYS_LIST.map(key => key.key).toString()}
            onKeyUp={(...props) => onKeyboardKeyDown(props)}
        >
            {children}
        </ReactHotkeys>
    )
}