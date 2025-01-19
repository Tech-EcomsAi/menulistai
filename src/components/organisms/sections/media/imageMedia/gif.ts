import { CATEGORIES_LIST, COMPONENTS_TYPE, SECTION_UID_SEPARATOR } from "@constant/builder";
import { BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, CONTENT_ALIGNMENT, PADDING, POSITION, SIZE } from "@constant/editorStylesProperties";
import { getUID } from "@util/utils";

// const UID = '2-1-1'
const GIFMediaConfig = (UID) => {
    return {
        id: getUID(),//id used for dnd
        sectionId: CATEGORIES_LIST.MEDIA,
        componentName: "GIF Container",
        unid: UID,
        thumbnail: "https://app.framerstatic.com/giphy-YRBZLNJT.png",

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
        "editable": { label: 'Container', style: [BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, PADDING, CONTENT_ALIGNMENT], props: [] },
        "component": COMPONENTS_TYPE.DIV,
        "children": [
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.IMAGE,
                "componentName": "GIF",
                "props": {
                    "src": "https://media.giphy.com/media/26ufmAlKt4ne2JDnq/giphy.gif"
                },
                "style": {
                    "width": '100%',
                    "height": '100%',
                },
                "editable": { label: 'GIF', style: [POSITION, BORDER_RADIUS, BOX_SHADOW, SIZE], propsLabel: "GIF source", props: ['src'] },
            },
        ]
    }
}
export default GIFMediaConfig