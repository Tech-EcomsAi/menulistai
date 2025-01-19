import { useAppSelector } from '@hook/useAppSelector';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderActiveHoverComponent, getBuilderActiveLayer } from '@reduxSlices/siteBuilderState';
import { Badge } from 'antd';
import { memo } from 'react';

function RibbonLable({ componentConfig }) {
    // console.log("RibbonLable renderre")
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const activeHoverComponent = useAppSelector(getBuilderActiveHoverComponent);
    const activeLayer = useAppSelector(getBuilderActiveLayer);
    return (
        <>
            {([activeHoverComponent?.uid, activeLayer?.uid, activeComponent?.uid].includes(componentConfig.uid)) ? <>
                <Badge.Ribbon placement='start' color='blue' style={{ zIndex: 999, top: 0 }} text={([activeHoverComponent?.uid, activeLayer?.uid, activeComponent?.uid].includes(componentConfig.uid)) ? (componentConfig.componentName || componentConfig.component) : ""}>
                </Badge.Ribbon>
            </> : null}
        </>
    )
}

export default memo(RibbonLable)