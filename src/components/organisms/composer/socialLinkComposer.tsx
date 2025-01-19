
'use client'
import { APP_THEME_COLOR } from '@constant/common';
import { useAppDispatch } from '@hook/useAppDispatch';
import { useAppSelector } from '@hook/useAppSelector';
import { getActiveEditorComponent } from '@reduxSlices/activeEditorComponent';
import { getBuilderActiveHoverComponent, getBuilderActiveLayer, updateBuilderActiveHoverComponent } from "@reduxSlices/siteBuilderState";
import getBackground from '@util/getBackgroundStyle';
import { getColourValue } from '@util/websiteBuilder';

function SocialLinkComposer({ config, onClickAction }) {
    const componentConfig = { ...config };
    const { props } = componentConfig;
    const dispatch = useAppDispatch();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const activeHoverComponent = useAppSelector(getBuilderActiveHoverComponent);
    const activeLayer = useAppSelector(getBuilderActiveLayer);

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
                className={`composerWrap iframeWrapper`}
                onClick={(e) => onClickAction(e, 'EDIT', componentConfig)}
                {...componentConfig.props}
            >
                <iframe
                    src={props.src}
                    width="100%"
                    style={{ minHeight: 200, width: "100%", height: "100%" }}
                    allowFullScreen={true}
                ></iframe>
            </div>
        </>
    )
}

export default SocialLinkComposer