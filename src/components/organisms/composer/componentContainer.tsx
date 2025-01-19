import { COMPONENTS_TYPE } from "@constant/builder"
import { APP_THEME_COLOR, BACKGROUND_TYPES, BUILDER_CONTAINER, PREVIEW_CONTAINER } from "@constant/common"
import { useAppDispatch } from "@hook/useAppDispatch"
import { useAppSelector } from "@hook/useAppSelector"
import TextQuickActions from "@organisms/editor/textQuickActions"
import { getActiveEditorComponent } from "@reduxSlices/activeEditorComponent"
import { getBuilderActiveHoverComponent, getBuilderActiveLayer, updateBuilderActiveHoverComponent } from "@reduxSlices/siteBuilderState"
import { SectionRendererContext } from "@template/websiteBuilder/dndKitUtility/sortablePresentation"
import getBackground from "@util/getBackgroundStyle"
import { removeObjRef } from "@util/utils"
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useInView } from 'react-intersection-observer'
import ComposerComponent from "./composerComponent"
import { estimateFontSize, estimateMargins, estimateOnAppearAnimations, estimateOnHoverAnimations, estimatePaddings, estimateTextColor } from "./styleUtils"

const GetComponentContent = (currentContainer, componentConfig: any, onClickAction: any) => {
    // console.log("GetComponentContent rendered")

    const dispatch = useAppDispatch();
    const activeComponent = useAppSelector(getActiveEditorComponent);
    const activeHoverComponent = useAppSelector(getBuilderActiveHoverComponent);
    const activeLayer = useAppSelector(getBuilderActiveLayer);
    const { component: ComponentType, props, children } = componentConfig;
    let ComponentToRender = null;
    const [hoverdComponent, setHoverdComponent] = useState<any>('');
    const { deviceType } = useContext(SectionRendererContext);

    const [isVisible, setIsVisible] = useState(false);
    const { ref, inView } = useInView({ threshold: 0.5 });
    useEffect(() => { (inView && Boolean(componentConfig?.animations?.onAppear)) && setIsVisible(true) }, [inView]);

    const isHovered = useMemo(() => hoverdComponent?.uid == componentConfig.uid, [hoverdComponent])

    useCallback(() => (currentContainer == BUILDER_CONTAINER) && dispatch(updateBuilderActiveHoverComponent(hoverdComponent)), [hoverdComponent])

    const getFontSize = useCallback(() => estimateFontSize(componentConfig, deviceType, ComponentType), [deviceType, componentConfig]);

    const getTextColor = useCallback(() => estimateTextColor(componentConfig), [componentConfig]);

    const getPadding = useCallback(() => estimatePaddings(componentConfig, deviceType), [deviceType, componentConfig]);

    const getMargin = useCallback(() => estimateMargins(componentConfig, deviceType), [deviceType, componentConfig]);

    const getOnAppearAnimations = useCallback(() => estimateOnAppearAnimations(currentContainer, componentConfig, isVisible), [isVisible]);

    const getOnHoverAnimations = useCallback(() => estimateOnHoverAnimations(currentContainer, componentConfig, isHovered), [isHovered]);

    const getBoxShadow = useCallback(() => ({ boxShadow: (currentContainer !== PREVIEW_CONTAINER && (isHovered || [activeLayer?.uid, activeComponent?.uid].includes(componentConfig.uid))) ? `inset 0px 0px 0px 2px ${APP_THEME_COLOR}` : "unset", }), [isHovered, activeLayer, activeComponent])

    const getStyles = useCallback(() => {
        let styles = removeObjRef(componentConfig.style);
        //delete redundant styles
        delete styles.padding;
        delete styles.boxShadow;
        delete styles.background;
        delete styles.fontSize;
        delete styles.margin;
        delete styles.color;
        styles = {
            ...styles,//default styles from editor
            ...getBoxShadow(),
            ...getTextColor(),
            ...getBackground(componentConfig.background),
            ...getOnAppearAnimations(),
            ...getOnHoverAnimations(),
            ...getFontSize(),
            ...getPadding(),
            ...getMargin(),
        }
        return styles;
    }, [activeHoverComponent, isVisible, componentConfig])

    const getProps = useCallback(() => {

        //get all dynamic props
        let componentProps: any = {
            ref: ref,
            id: componentConfig.uid,
            className: `composerWrap`,
            onMouseEnter: () => setHoverdComponent(componentConfig),
            onMouseLeave: () => setHoverdComponent(''),
        }

        //only for builder container
        if (currentContainer == BUILDER_CONTAINER) {
            componentProps = {
                ...componentProps,
                onClick: (e) => onClickAction(e, 'EDIT', componentConfig)
            }
        }

        //only for preview container
        if (currentContainer == BUILDER_CONTAINER) {
            componentProps = {
                ...componentProps,
                // onClick: (e) => onClickAction(e, 'EDIT', componentConfig)
            }
        }

        if (COMPONENTS_TYPE.VIDEO == ComponentType || Boolean(componentConfig.props)) {
            componentProps = {
                ...componentProps,
                width: "100%",
                height: "100%",
                preload: "none",
                ...componentConfig.props
            }
        }

        return componentProps;
    }, [])

    if (ComponentType == COMPONENTS_TYPE.IMAGE) {
        ComponentToRender = <ComponentType {...getProps()} style={{ ...getStyles() }} src={props.src} />
    } else {

        //get component content
        let Component = ComponentType;
        if ([COMPONENTS_TYPE.YTVIDEO, COMPONENTS_TYPE.AUDIO, COMPONENTS_TYPE.SOCIAL_LINK].includes(ComponentType)) {
            Component = 'div'
        }
        ComponentToRender = <Component {...getProps()} style={{ ...getStyles() }} >

            {/* for text base component */}
            {props?.text && <>
                {currentContainer == BUILDER_CONTAINER ? <TextQuickActions config={componentConfig} /> : <>{props?.text}</>}
            </>}

            {/* for video component */}
            {props?.src && COMPONENTS_TYPE.VIDEO == ComponentType && <>
                <source src={props.src} type="video/mp4" />
            </>}

            {/* for all iframe base media */}
            {[COMPONENTS_TYPE.YTVIDEO, COMPONENTS_TYPE.AUDIO, COMPONENTS_TYPE.SOCIAL_LINK].includes(ComponentType) && <>
                <iframe
                    src={props.src}
                    width="100%"
                    style={{ minHeight: 200, width: "100%", height: "100%" }}
                    allowFullScreen={true}
                    allow='autoplay; encrypted-media'
                />
            </>}
            {/* for nested child commponents */}
            {children ? children?.map((childConfig, index) => {
                return <React.Fragment key={index}>
                    <ComposerComponent config={childConfig} currentContainer={currentContainer} uid={componentConfig.uid} />
                </React.Fragment>
            }) : null}
        </Component>
    }
    return ComponentToRender;
}

function ComponentContainer({ currentContainer, componentConfig, onClickAction }) {
    // console.log("ComponentContainer rendered")
    return (
        <React.Fragment>
            {(componentConfig?.background?.type == BACKGROUND_TYPES.IMAGE) && <style dangerouslySetInnerHTML={{
                __html: `
                #${componentConfig.uid}{
                    position:relative;
                }
                #${componentConfig.uid}:after {
                        content: ' ';
                        display: block;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        opacity:${componentConfig?.background?.opacity || 1};
                        background:url(${componentConfig?.background?.src});
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                    }`
            }}></style>}
            {GetComponentContent(currentContainer, componentConfig, onClickAction)}
        </React.Fragment>
    )
}

export default memo(ComponentContainer)