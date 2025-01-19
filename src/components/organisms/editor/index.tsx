import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import styles from '@organismsCSS/editor/editorContainer.module.scss';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderState, updateBuilderState } from "@reduxSlices/siteBuilderState";
import { checkUidIsPresent, isSameObjects, removeObjRef } from '@util/utils';
import { memo } from 'react';
import EditorComponent from './editorComponent';

function Editor({ config }) {
    const dispatch = useAppDispatch();
    // const [componentConfig, setComponentConfig] = useState<any>(removeObjRef(config));
    const builderState = useAppSelector(getBuilderState);
    const activeComponent = useAppSelector(getActiveEditorComponent);

    // useEffect(() => setComponentConfig({ ...config }), [config])

    const handleConfigUpdate = (updatedConfig) => {
        const listKey = Object.keys(builderState)[0];
        const builderStateCopy: any = removeObjRef(builderState);
        const components = removeObjRef(builderStateCopy[listKey]);
        const index = builderState[Object.keys(builderState)[0]].findIndex(i => checkUidIsPresent(i, activeComponent.uid));
        if (!isSameObjects(updatedConfig, components[index])) {
            // setComponentConfig(updatedConfig);
            components[index] = updatedConfig;
            builderStateCopy[listKey] = components;
            console.log("inside handleConfigUpdate")
            dispatch(updateBuilderState(builderStateCopy));
        }
    };

    return (
        <div className={styles.editorContainer}>
            <EditorComponent index={null} config={config} onConfigUpdate={(con) => handleConfigUpdate(con)} />
        </div>
    )
}

export default memo(Editor);

