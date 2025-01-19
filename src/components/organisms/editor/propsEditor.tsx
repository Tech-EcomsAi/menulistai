import TextEditorElement from '@molecules/propsElement/textEditorElement';
import VideoPropsEditor from '@molecules/propsElement/videoPropsEditor';
import styles from '@organismsCSS/editor/propsEditor.module.scss';
import { removeObjRef } from '@util/utils';
import React, { useCallback } from 'react';

function PropsEditor({ config, onConfigUpdate }) {

    const handlePropsChange = (from, value) => {
        const configCopy = removeObjRef(config);
        configCopy.props = { ...configCopy.props, [from]: value };
        onConfigUpdate(configCopy);
    };

    const getPropsComponent = (property: string, value: any) => {
        let component = null;
        switch (property) {
            case 'text':
                component = <TextEditorElement label={config?.editable?.propsLabel || 'Update Text'} value={value} onChange={(value) => handlePropsChange(property, value)} placeholder={config?.editable?.propsLabel || 'Update Text'} />
                break;

            case 'src':
                component = <TextEditorElement label={config?.editable?.propsLabel || 'Update Source'} value={value} onChange={(value) => handlePropsChange(property, value)} placeholder={config?.editable?.propsLabel || 'Update Text'} />
                break;

            case 'thumbnail':
                component = <TextEditorElement label={'Thumbnail'} value={value} onChange={(value) => handlePropsChange('poster', value)} placeholder={config?.editable?.propsLabel || 'Update Thumbnail'} />
                break;

            case 'videoProps':
                component = <VideoPropsEditor label={config?.editable?.propsLabel || 'Update Properties'} config={config.props} onChange={handlePropsChange} placeholder={config?.editable?.propsLabel || 'Update Properties'} />
                break;

            default:
                break;
        }
        return component;
    }

    const renderComponent = useCallback(
        () => <div className={styles.propsEditor}>
            {config?.editable?.props?.map((property, index) => {
                return <React.Fragment key={index}>
                    {getPropsComponent(property, config.props ? config.props[property] : "")}
                </React.Fragment>
            })}
        </div>,
        [config],
    )

    return renderComponent()
}

export default PropsEditor