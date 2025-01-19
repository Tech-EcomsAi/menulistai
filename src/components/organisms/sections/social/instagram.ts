import { CATEGORIES_LIST, COMPONENTS_TYPE, SECTION_UID_SEPARATOR } from "@constant/builder";
import { BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, CONTENT_ALIGNMENT, PADDING } from "@constant/editorStylesProperties";
import { getUID } from "@util/utils";

// const UID = '3-1-1'
const InstagramSocialConfig = (UID) => {
    return {
        id: getUID(),//id used for dnd
        sectionId: CATEGORIES_LIST.SOCIAL,
        componentName: "Instagram Profile",
        unid: UID,
        thumbnail: "https://app.framerstatic.com/instagram-ZB2QAVDX.png",

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
                "component": COMPONENTS_TYPE.SOCIAL_LINK,
                "componentName": "Instagram",
                "props": {
                    "src": "https://www.instagram.com/p/CteMsH8M67r/embed/"
                },
                "style": {
                    "width": '100%',
                    "height": '400px',
                    "display": "flex",
                    "justifyContent": "center",
                    "alignItems": "center"
                },
                "editable": { propsLabel: "Embed Url", props: ['src'] },
            },
        ]
    }
}
export default InstagramSocialConfig