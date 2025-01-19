
'use client'
import { APP_THEME_COLOR } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderActiveHoverComponent, getBuilderActiveLayer, updateBuilderActiveHoverComponent } from "@reduxSlices/siteBuilderState";
import getBackground from '@util/getBackgroundStyle';
import { getColourValue } from '@util/websiteBuilder';

function AudioComposer({ config, onClickAction }) {
    const componentConfig = { ...config };
    const { props } = componentConfig;
    const dispatch = useAppDispatch();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const activeHoverComponent = useAppSelector(getBuilderActiveHoverComponent);
    const activeLayer = useAppSelector(getBuilderActiveLayer);
    let allowedMode = "";

    return (
        <>
            <div
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
            >
                <iframe src={props.src} width="100%" style={{
                    minHeight: 200
                }} frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

            </div>
        </>
    )
}

export default AudioComposer