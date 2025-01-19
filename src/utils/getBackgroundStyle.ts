import { BACKGROUND_TYPES } from "@constant/common";
import { BackgroundType } from "@reduxSlices/siteBuilderState";
import { getGradientValue } from "./getColorsValue";
import { getBackgroundColor } from "./websiteBuilder";

const getBackgroundGradient = (config) => {

    return { background: getGradientValue(config) };
}

const getBackgroundImage = (config) => {
    return {
        backgroundImage: `url(${config.src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    }
}

const getBackground = (backgroundConfig: BackgroundType) => {

    const backgroundConfigSample = {
        value: '#000',
        type: 'Color'
    }

    switch (backgroundConfig?.type) {
        case BACKGROUND_TYPES.COLOR:
            return getBackgroundColor(backgroundConfig)
        case BACKGROUND_TYPES.GRADIENT:
            return getBackgroundGradient(backgroundConfig);
        case BACKGROUND_TYPES.IMAGE:
            return getBackgroundImage(backgroundConfig);
        default:
            break;
    }
}


// const getBodyBackground = (config) => {
//     switch (config?.type) {
//         case BACKGROUND_TYPES.COLOR:
//             return getBackgroundColor(config)
//         case BACKGROUND_TYPES.GRADIENT:
//             return getBackgroundGradient(config);
//         case BACKGROUND_TYPES.IMAGE:
//             return getBackgroundImage(config)
//     }
// }

export default getBackground;