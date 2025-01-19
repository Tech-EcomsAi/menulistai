import { SECTION_UID_SEPARATOR, UNID_SEPARATOR } from "@constant/builder";
import { BACKGROUND_TYPES } from "@constant/common";
import { useAppSelector } from "@hook/useAppSelector";
import ComposerComponent from "@organisms/composer/composerComponent";
import Editor from "@organisms/editor";
import AllSectionsWithMetaDataList from "@organisms/sections";
import { ComponentType, SectionType } from "@organisms/sections/homePage";
import { ActiveTemplateConfigType, BackgroundType, getActiveTemplateConfig } from "@reduxSlices/siteBuilderState";
import getBackground from "./getBackgroundStyle";
import { removeObjRef } from "./utils";

export const getSectionEditorComponent = (componentConfig: any) => {// componentConfig.unid = `1-1-1`
    if (componentConfig && Boolean(Object.keys(componentConfig).length)) {
        const component = getComponentUsingNumberUnid(getUnidAsNumber(componentConfig.unid));
        return component.editor || Editor;
    } else return null;
}

export const getSectionRendererComponent = (componentConfig: any) => {
    if (componentConfig && Boolean(Object.keys(componentConfig).length)) {
        const component = getComponentUsingNumberUnid(getUnidAsNumber(componentConfig.unid));
        return component.component || ComposerComponent;
    } else return null;
}

export const getComponentUsingNumberUnid = (unNumberId: number) => {
    const categoryId = `${unNumberId}`[0];// "1" => home Page

    const sectionDetails: SectionType[] = AllSectionsWithMetaDataList[categoryId] //[HomePageSectionsList]

    let componentDetails: ComponentType = null;
    sectionDetails.map((section: SectionType) => {
        if (!componentDetails) componentDetails = section.components.find((component: ComponentType) => getUnidAsNumber(component.unid) == unNumberId);
    })
    return componentDetails;
}
export const getUnidAsNumber = (unid: string) => {
    let id = unid;
    if (unid.includes(SECTION_UID_SEPARATOR)) {
        id = unid.split(SECTION_UID_SEPARATOR)[0]
    }
    const [n1, n2, n3] = id.split(UNID_SEPARATOR);
    return Number(`${n1}${n2}${n3}`)
}

export const GetSiteColorVariables = () => {
    const activeTemplateConfig: ActiveTemplateConfigType = useAppSelector(getActiveTemplateConfig);
    return activeTemplateConfig?.colorVariables;
}

export const getBackgroundColor = (config: BackgroundType) => {
    if (Boolean(config?.value?.length)) return { background: config.value[0] };
}

export const getColourValue = (config: any, colorVariables = null) => {
    if (Boolean(config?.color)) return config.color;
}

export const getFontSize = (config: any, colorVariables = null) => {
    if (Boolean(config?.fontSize)) return config.fontSize;
}

export const updateConfigVariablesColors = (variables, config) => {

    if (Boolean(config.children?.length)) {
        config.children.map((child: any) => {
            child = updateConfigVariablesColors(variables, child);
        })
    }
    //update bg colors
    if (Boolean(config?.background?.type) && Boolean(config?.background?.colorVariable) && config.background.type == BACKGROUND_TYPES.COLOR) {
        config.background.value = [variables[config?.background?.colorVariable]]
    }

    //update text colors
    if (Boolean(config?.style?.colorVariable)) {
        config.style.color = variables[config?.style?.colorVariable]
    }

    return config;

}

export const ForceUpdateStateColorVariables = (builderState, colorVariables) => {
    const stateId = Object.keys(builderState)[0];
    const builderStateCopy = removeObjRef(builderState)
    builderStateCopy[stateId].map((config) => {
        config = updateConfigVariablesColors(colorVariables, config)
    })
    return builderStateCopy;
}


export const updateConfigTextStyles = (config, variable, textStyles) => {

    if (Boolean(config.children?.length)) {
        config.children.map((child: any) => {
            child = updateConfigTextStyles(child, variable, textStyles);
        })
    }
    //update text styles
    if (Boolean(config?.props?.text) && Boolean(config?.textStyleVariable) && config?.textStyleVariable == variable) {
        config.style = { ...config.style, ...textStyles }
    }

    return config;

}

export const ForceUpdateStateTextStyles = (builderState, variable, textStyles) => {
    const stateId = Object.keys(builderState)[0];
    const builderStateCopy = removeObjRef(builderState)
    builderStateCopy[stateId].map((config) => {
        config = updateConfigTextStyles(config, variable, textStyles)
    })
    return builderStateCopy;
}

export const getBodyStyles = (activeTemplateConfig) => {
    const styles = {
        ...activeTemplateConfig?.style,
        ...getBackground(activeTemplateConfig.background),
        minHeight: 500
    };
    return styles;
}