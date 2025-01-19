import { CATEGORIES_LIST, COMPONENTS_TYPE, SECTION_UID_SEPARATOR } from "@constant/builder";
import { BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, CONTENT_ALIGNMENT, PADDING, POSITION, SIZE } from "@constant/editorStylesProperties";
import { getUID } from "@util/utils";

// const UID = '2-1-1'
const ImageMediaConfig = (UID) => {
    return {
        id: getUID(),//id used for dnd
        sectionId: CATEGORIES_LIST.MEDIA,
        componentName: "Image Container",
        unid: UID,
        thumbnail: "https://app.framerstatic.com/image-DTLYUL43.png",

        uid: `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,

        "classNames": "",
        "appearance": { "mobile": true, "desktop": true },
        "style": {
            "display": "flex",
            "width": '100%',
            "height": '100%',
            "overflow": "hidden",
        },
        "background": {
            value: ['#000'],
            type: 'Color',
        },
        "animations": {
            onAppear: {
                "name": "fadeOut",
                "duration": "1s",
                "timingFunction": "ease-in-out"
            }
        },
        "editable": { label: 'Container', style: [BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, PADDING, CONTENT_ALIGNMENT], props: [] },
        "component": COMPONENTS_TYPE.DIV,
        "children": [
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.IMAGE,
                "componentName": "Image",
                "props": {
                    "src": "https://images.pexels.com/photos/843226/pexels-photo-843226.jpeg?auto=compress&cs=tinysrgb&w=600"
                },
                "style": {
                    "width": '100%',
                    "height": '100%',
                },
                "editable": { label: 'Image', style: [POSITION, BORDER_RADIUS, BOX_SHADOW, SIZE], propsLabel: "Image source", props: ['src'] },
            },
        ]
    }
}
export default ImageMediaConfig