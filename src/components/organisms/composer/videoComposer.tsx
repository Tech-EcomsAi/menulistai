
'use client'
import { APP_THEME_COLOR } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderActiveHoverComponent, getBuilderActiveLayer, updateBuilderActiveHoverComponent } from "@reduxSlices/siteBuilderState";
import getBackground from '@util/getBackgroundStyle';
import { getColourValue } from '@util/websiteBuilder';

function VideoComposer({ config, onClickAction }) {
    const componentConfig = { ...config };
    const { props } = componentConfig;
    const dispatch = useAppDispatch();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const activeHoverComponent = useAppSelector(getBuilderActiveHoverComponent);
    const activeLayer = useAppSelector(getBuilderActiveLayer);

    return (
        <>
            <video
                onMouseEnter={() => dispatch(updateBuilderActiveHoverComponent(componentConfig))}
                onMouseLeave={() => dispatch(updateBuilderActiveHoverComponent(''))}
                style={{
                    ...componentConfig.style,
                    color: getColourValue(componentConfig?.style),
                    ...getBackground(componentConfig.background),
                    boxShadow: ([activeHoverComponent?.uid, activeLayer?.uid, activeComponent?.uid].includes(componentConfig.uid)) ? `inset 0px 0px 0px 2px ${APP_THEME_COLOR}` : "unset",
                }}
                id={componentConfig.uid}
                className={`composerWrap`}
                onClick={(e) => onClickAction(e, 'EDIT', componentConfig)}
                {...componentConfig.props}
                width="100%"
                height="100%"
                preload="none">
                <source src={props.src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* </div> */}
        </>
    )
}

export default VideoComposer