import { BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, CONTENT_ALIGNMENT, MARGIN, OBJECT_FIT, PADDING, POSITION, SIZE, STYLES, TEXT_STYLES } from '@constant/editorStylesProperties';
import { useAppSelector } from '@hook/useAppSelector';
import AnimationsStyles from '@molecules/styleElement/animations';
import Border from '@molecules/styleElement/border';
import BoxShadow from '@molecules/styleElement/boxShadow';
import ContentAlignment from '@molecules/styleElement/contentAlignment';
import DirectionProperty from '@molecules/styleElement/directionProperty';
import ObjectFit from '@molecules/styleElement/objectFit';
import PaddingMargin from '@molecules/styleElement/paddingMargin';
import Position from '@molecules/styleElement/position';
import SizeAdjustment from '@molecules/styleElement/sizeAdjustment';
import Styles from '@molecules/styleElement/styles';
import TextStyles from '@molecules/styleElement/textStyles';
import styles from '@organismsCSS/editor/stylesEditor.module.scss';
import { ActiveTemplateConfigType, getActiveTemplateConfig } from '@reduxSlices/siteBuilderState';
import { removeObjRef } from '@util/utils';
import React from 'react';
import BackgroundEditor from './backgroundEditor';

function StylesEditor({ config, onConfigUpdate }) {
    const activeTemplateConfig: ActiveTemplateConfigType = useAppSelector(getActiveTemplateConfig);

    const handleStyleChange = (property, value) => {
        const configCopy = removeObjRef(config);
        configCopy.style = { ...configCopy.style, [property]: value };
        onConfigUpdate(configCopy);
    };

    const handleStyleVariableChange = (value) => {
        const configCopy = removeObjRef(config);
        configCopy.textStyleVariable = value;
        if (Boolean(value)) {
            configCopy.component = value;
            configCopy.style = { ...configCopy.style, ...activeTemplateConfig.textStyles[value] };
        }
        onConfigUpdate(configCopy);
    };

    const handleAnimationChange = (value) => {
        const configCopy = removeObjRef(config);
        configCopy.animations = value;
        onConfigUpdate(configCopy);
    };

    const getStyleComponent = (property: string) => {
        let component = null;
        switch (property) {
            // case APPEAR_ANIMATIONS:
            //     component = <AnimationsStyles animationConfig={config.animations} onConfigUpdate={handleAnimationChange} />
            //     break;
            case BACKGROUND:
                component = <BackgroundEditor config={config} onConfigUpdate={onConfigUpdate} />
                break;
            case STYLES:
                component = <Styles config={config} onChange={handleStyleChange} />
                break;
            case SIZE:
                component = <SizeAdjustment config={config} onChange={handleStyleChange} />
                break;
            case BORDER:
                component = <Border value={config?.style?.border || '0px solid #dee1ec'} onChange={handleStyleChange} />
                break;
            case BOX_SHADOW:
                component = <BoxShadow value={config?.style?.boxShadow} onChange={handleStyleChange} />
                break;
            case BORDER_RADIUS:
                component = <DirectionProperty label="Border Radius" propertyType={BORDER_RADIUS} value={config?.style?.borderRadius} onChange={handleStyleChange} />
                break;
            case POSITION:
                component = <Position config={config} onChange={handleStyleChange} />
                break;
            case TEXT_STYLES:
                component = <TextStyles config={config} onChange={handleStyleChange} handleStyleVariableChange={handleStyleVariableChange} />
                break;
            case PADDING:
                component = <PaddingMargin propertyType={PADDING} value={config?.style?.padding} onChange={handleStyleChange} />
                break;
            case MARGIN:
                component = <PaddingMargin propertyType={MARGIN} value={config?.style?.margin} onChange={handleStyleChange} />
                break;
            case CONTENT_ALIGNMENT:
                component = <ContentAlignment onChange={(value) => handleStyleChange('justifyContent', value)} value={config?.style?.justifyContent} />
                break;
            case OBJECT_FIT:
                component = <ObjectFit value={config?.style?.objectFit} onChange={handleStyleChange} />
                break;

            default:
                break;
        }
        return component;
    }

    return (
        <div className={styles.stylesEditor}>
            {config?.editable?.style.map((property, index) => {
                return <React.Fragment key={index}>
                    {/* <AppearAnimationProvider> */}
                    {getStyleComponent(property)}
                    {/* </AppearAnimationProvider> */}
                </React.Fragment>
            })}
            <AnimationsStyles animationConfig={config.animations} onConfigUpdate={handleAnimationChange} />
        </div>
    )
}

export default StylesEditor