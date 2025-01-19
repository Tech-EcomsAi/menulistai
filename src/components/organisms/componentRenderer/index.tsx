import { ConfigType } from '@constant/builder';
import styles from '@organismsCSS/componentRenderer/componentRenderer.module.scss';
import { getSectionRendererComponent } from '@util/websiteBuilder';
import { useCallback } from 'react';

function ComponentRenderer(props) {

    const getComponent = useCallback((componentConfig: ConfigType) => {
        let Component: any = getSectionRendererComponent(componentConfig);

        if (Boolean(Component)) {
            return <Component
                key={componentConfig.uid}
                config={componentConfig}
                currentContainer={props.currentContainer}
                uid={componentConfig.uid}
                deviceType={props.deviceType}
            />
        }
        return null;
    }, [])

    return (
        <div className={`componentRenderer ${styles.wrap}`} ref={props.setNodeRef} style={props.style}>
            {/* here props means passed data from builder container as
             <ComponentRenderer
                builderState={builderState}
                lastChild={builderState[stateId].length - 1 == index}
                index={index}
                uid={item?.uid}
                currentContainer={BUILDER_CONTAINER}
                componentConfig={item}
                deviceType={deviceType}
            />
            */}
            {getComponent(props.componentConfig)}
        </div >
    )
}

export default ComponentRenderer