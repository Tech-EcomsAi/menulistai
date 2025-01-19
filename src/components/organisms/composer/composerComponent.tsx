'use client'
import { PANEL_ACTIONS_LIST } from '@constant/builder';
import { BUILDER_CONTAINER } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { updateActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderState, updateBuilderSidebarPanelAction } from "@reduxSlices/siteBuilderState";
import { checkUidIsPresent, removeObjRef } from '@util/utils';
import { memo } from 'react';
import ComponentContainer from './componentContainer';
import RibbonLable from './ribbonLable';


function ComposerComponent(pageProps: { config: any; currentContainer: any; uid: any }) {
    const { config, currentContainer } = pageProps
    const componentConfig = { ...config };
    const dispatch = useAppDispatch();
    const builderState = useAppSelector(getBuilderState);

    const onClickAction = (event: any, action: string, componentConfig: any) => {
        if (Boolean(currentContainer == BUILDER_CONTAINER)) {
            switch (action) {
                case 'EDIT':
                    const rootConfig = builderState[Object.keys(builderState)[0]].find(i => checkUidIsPresent(i, componentConfig.uid));
                    dispatch(updateActiveEditorComponent(removeObjRef({ originalState: rootConfig, uid: componentConfig.uid })));
                    dispatch(updateBuilderSidebarPanelAction(PANEL_ACTIONS_LIST.EDITOR))
                    break;
                default:
                    break;
            }
            event.stopPropagation();
        }
    }

    return (
        <>
            {currentContainer == BUILDER_CONTAINER && <RibbonLable componentConfig={componentConfig} />}
            <ComponentContainer currentContainer={currentContainer} componentConfig={componentConfig} onClickAction={onClickAction} />
        </>
    );
}

export default memo(ComposerComponent)