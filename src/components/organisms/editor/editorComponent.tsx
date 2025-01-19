'use client'
import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import styles from '@organismsCSS/editor/editorComponent.module.scss';
import { getActiveEditorComponent, updateActiveEditorComponent } from "@reduxSlices/activeEditorComponent";
import { removeObjRef } from "@util/utils";
import { Collapse, Flex, theme } from "antd";
import React, { useState } from "react";
import PropsEditor from "./propsEditor";
import StylesEditor from "./stylesEditor";

const EditorComponent = ({ index, config, onConfigUpdate }) => {
    const { token } = theme.useToken();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const dispatch = useAppDispatch()
    const [collapseAll, setCollapseAll] = useState(false)

    const onChange = (key: string | string[]) => {

        if (!key.length) setCollapseAll(true)
        else {
            setCollapseAll(false)
            dispatch(updateActiveEditorComponent(removeObjRef({ ...activeComponent, uid: key[0] })))
        }
    };

    const updatePrentConfig = (c, index) => {
        const updatedConfig = removeObjRef(config);
        updatedConfig.children[index] = c;
        onConfigUpdate(updatedConfig);
    }

    return (
        <div className={styles.editorComponent}>
            <Collapse
                style={{ borderColor: token.colorBorderSecondary }}
                expandIconPosition='end'
                accordion
                onChange={onChange}
                size="small"
                className={styles.elementContainer}
                activeKey={collapseAll ? "" : activeComponent.uid}
                defaultActiveKey={config.uid}
                items={[
                    {
                        key: config.uid,
                        label: <Flex style={{ background: token.colorBgElevated }} className={styles.editorHeadingLabel}>{config.componentName}</Flex>,
                        headerClass: `${styles.editorHeading}`,
                        children: <>
                            {Boolean(Boolean(config?.editable?.props?.length) && config?.editable?.props?.length != 0) && <PropsEditor config={config} onConfigUpdate={(updatedConfig) => onConfigUpdate(updatedConfig)} />}
                            {Boolean(Boolean(config?.editable?.style?.length) && config?.editable?.style?.length != 0) && <StylesEditor config={config} onConfigUpdate={(updatedConfig) => onConfigUpdate(updatedConfig)} />}
                        </>,
                    }
                ]}
            >
            </Collapse>
            {config.children ? config.children?.map((childConfig, index) => {
                return <React.Fragment key={index}>
                    <EditorComponent index={index} config={childConfig} onConfigUpdate={(c) => updatePrentConfig(c, index)} />
                </React.Fragment>
            }) : null}
        </div>
    )
}
export default EditorComponent;