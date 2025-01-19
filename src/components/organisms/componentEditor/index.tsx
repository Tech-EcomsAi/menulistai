import { useAppSelector } from '@hook/useAppSelector';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderState } from '@reduxSlices/siteBuilderState';
import { checkUidIsPresent, removeObjRef } from '@util/utils';
import { getSectionEditorComponent } from '@util/websiteBuilder';
import { useCallback, useEffect, useState } from 'react';

function ComponentEditor({ activeComponent }) {

    const [componentConfig, setComponentConfig] = useState<any>({});
    const stateActiveComponent = useAppSelector(getActiveEditorComponent);
    const builderState = useAppSelector(getBuilderState);

    useEffect(() => {
        const rootConfig = builderState[Object.keys(builderState)[0]].find(i => checkUidIsPresent(i, stateActiveComponent.uid));
        setComponentConfig(rootConfig || {});
    }, [activeComponent, builderState])

    const getComponent = useCallback(() => {

        let Component: any = getSectionEditorComponent(componentConfig);

        if (Boolean(Component)) {
            return <Component key={componentConfig.uid} config={removeObjRef(componentConfig)} />
        }
        return null;

    }, [componentConfig])

    return getComponent();
}

export default ComponentEditor