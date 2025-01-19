import { COMPONENTS_TYPE } from "@constant/builder";
import { OVERLAY_CONTAINER } from "@constant/common";
import { getStyleValueAndType } from "@util/getColorsValue";

export const estimateTextColor = (config: any) => {
    if (Boolean(config?.color)) return { color: config.color };
}

const getDeviceRatio = (deviceType) => {
    let ratio = 1;
    if (deviceType == "Mobile") ratio = 0.75;
    else if (deviceType == "Tablet") ratio = 0.85;
    return ratio;
}

export const estimatePaddings = (componentConfig, deviceType = "Desktop") => {
    let padding = componentConfig.style?.padding || {};
    let ratio = getDeviceRatio(deviceType)
    padding = {
        paddingTop: `${Number(getStyleValueAndType(padding?.paddingTop).value || 0) * ratio}${getStyleValueAndType(padding?.paddingTop).type}`,
        paddingRight: `${Number(getStyleValueAndType(padding?.paddingRight).value || 0) * ratio}${getStyleValueAndType(padding?.paddingRight).type}`,
        paddingBottom: `${Number(getStyleValueAndType(padding?.paddingBottom).value || 0) * ratio}${getStyleValueAndType(padding?.paddingBottom).type}`,
        paddingLeft: `${Number(getStyleValueAndType(padding?.paddingLeft).value || 0) * ratio}${getStyleValueAndType(padding?.paddingLeft).type}`,
    };
    return { ...padding };
};

export const estimateMargins = (componentConfig, deviceType = "Desktop") => {
    let margin = componentConfig.style?.margin || {};
    let ratio = getDeviceRatio(deviceType)
    margin = {
        marginTop: `${Number(getStyleValueAndType(margin?.marginTop).value || 0) * ratio}${getStyleValueAndType(margin?.marginTop).type}`,
        marginRight: `${Number(getStyleValueAndType(margin?.marginRight).value || 0) * ratio}${getStyleValueAndType(margin?.marginRight).type}`,
        marginBottom: `${Number(getStyleValueAndType(margin?.marginBottom).value || 0) * ratio}${getStyleValueAndType(margin?.marginBottom).type}`,
        marginLeft: `${Number(getStyleValueAndType(margin?.marginLeft).value || 0) * ratio}${getStyleValueAndType(margin?.marginLeft).type}`,
    };
    return { ...margin };
};

const RANDOM_NUMBER = Math.random();

export const estimateFontSize = (componentConfig, deviceType = "Desktop", ComponentType) => {
    console.log("deviceType", deviceType)
    const desktopFontSize = Number(getStyleValueAndType(componentConfig?.style?.fontSize).value || 0);
    let fontSize = desktopFontSize;
    if (deviceType == "Mobile") {
        let mobileRatio;
        if (ComponentType.includes(COMPONENTS_TYPE.H1, COMPONENTS_TYPE.H2, COMPONENTS_TYPE.H3, COMPONENTS_TYPE.H4, COMPONENTS_TYPE.H5, COMPONENTS_TYPE.H6)) {
            mobileRatio = 0.7 + RANDOM_NUMBER * 0.1; // Random value between 0.7 - 0.8
        } else {
            mobileRatio = 0.8 + RANDOM_NUMBER * 0.2; // Random value between 0.8 - 1.0
        }
        mobileRatio = mobileRatio.toFixed(2);
        fontSize = (desktopFontSize * mobileRatio);
    } else if (deviceType == "Tablet") {
        let tabletRatio;
        if (ComponentType.includes(COMPONENTS_TYPE.H1, COMPONENTS_TYPE.H2, COMPONENTS_TYPE.H3, COMPONENTS_TYPE.H4, COMPONENTS_TYPE.H5, COMPONENTS_TYPE.H6)) {
            tabletRatio = 0.8 + RANDOM_NUMBER * 0.1; // Random value between 0.8 - 0.9
        } else {
            tabletRatio = 0.9 + RANDOM_NUMBER * 0.1; // Random value between 0.9 - 1.0
        }
        tabletRatio = tabletRatio.toFixed(2);
        fontSize = (desktopFontSize * tabletRatio);
    }

    return { fontSize: `${fontSize / 16}rem`, lineHeight: `${((fontSize / 16) * 1.5)}rem` }
}

export const estimateOnAppearAnimations = (currentContainer, componentConfig, isVisible) => {
    let style = {};
    if (currentContainer !== OVERLAY_CONTAINER) { //aply animation when components rendered in left side builder area
        if (Boolean(componentConfig?.animations?.onAppear) && isVisible) {
            style = {
                animation: `${componentConfig?.animations?.onAppear?.name} ${componentConfig?.animations?.onAppear?.duration} ${componentConfig?.animations?.onAppear?.timingFunction}`,
                animationDelay: componentConfig?.animations?.onAppear?.delay || "19ms", //componentConfig?.animations?.onAppear?.duration,
            }
        }
    }
    return style;
}

export const estimateOnHoverAnimations = (currentContainer, componentConfig, isHovered) => {
    let style = {};
    if (currentContainer !== OVERLAY_CONTAINER) { //aply animation when components rendered in left side builder area

        if (Boolean(componentConfig?.animations?.onHover)) style = { ...style, transition: "all 0.3s ease-in" }

        if (Boolean(componentConfig?.animations?.onHover) && Boolean(isHovered) && Boolean(componentConfig?.uid)) {
            style = {
                ...style,
                ...componentConfig?.animations?.onHover
            }
        }
    }
    return style;
}
