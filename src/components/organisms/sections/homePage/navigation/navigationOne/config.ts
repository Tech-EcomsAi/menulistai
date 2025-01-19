import { CATEGORIES_LIST, COLOR_VARIABLES, COMPONENTS_TYPE, SECTION_UID_SEPARATOR } from "@constant/builder";
import { APPEAR_ANIMATIONS, BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, MARGIN, PADDING, POSITION, STYLES, TEXT_STYLES } from "@constant/editorStylesProperties";
import { getUID } from "@util/utils";
import { NAVIGATION_COMPONENTS_LIST } from "../constants";

const NavigationOneConfg = (UID) => {
    return {

        // ******** basic metadata of config ********
        sectionId: CATEGORIES_LIST.HOME_PAGE,
        componentName: NAVIGATION_COMPONENTS_LIST.NAVIGATION_ONE,
        thumbnail: "https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/sections%2Fhomepage%2Fnavigation%2FTwitter%20post%20-%202.jpg?alt=media&token=ada5c811-9f9f-4a8b-95da-0bc8ed0bf46c",
        unid: UID,
        //this parameter use for drag and drop component ( here 1: Home page 1: Navigation 1: navigation one => 111) :: Page:Section:Section-Version

        // ******** basic metadata of config ********

        uid: `1-1-1${SECTION_UID_SEPARATOR}${getUID()}`,
        "component": COMPONENTS_TYPE.DIV,
        "classNames": "navigationComponentWrapper",
        "appearance": { "mobile": true, "desktop": true },
        "style": {
            "width": '100%',
            "height": '100%',
            "boxShadow": 'unset',
            "padding": {
                paddingTop: '50px',
                paddingBottom: '50px',
                paddingLeft: '50px',
                paddingRight: '50px'
            },
            "color": 'black',
        },
        "background": {
            colorVariable: COLOR_VARIABLES.COLOR_BACKGROUND,
            value: ['#000'],
            type: 'Color',
        },
        "animations": {
            onAppear: {
                "name": "fadeIn",
                "duration": "1s",
                "timingFunction": "ease-in-out"
            }
        },
        "editable": { label: 'Container', style: [APPEAR_ANIMATIONS, POSITION, STYLES, BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, MARGIN, PADDING], props: [] },
        "children": [
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.H1,
                componentName: "Heading",
                "props": {
                    "text": "Heading for navigation"
                },
                "background": {
                    colorVariable: COLOR_VARIABLES.COLOR_SURFACE,
                    value: ['#000'],
                    type: 'Color',
                },
                "editable": { label: 'Heading', style: [TEXT_STYLES, BACKGROUND, BORDER_RADIUS, BOX_SHADOW], props: ['text'] },
                "style": {
                    "color": "deeppink",
                    colorVariable: COLOR_VARIABLES.COLOR_TEXT,
                    "fontSize": "30px",
                },
                textStyleVariable: 'h1'
            },
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.DIV,
                "componentName": "Sub Heading",
                "props": {
                    "text": "Subheading for navigation"
                },
                "background": {
                    value: ['#000'],
                    type: 'Color',
                },
                "editable": { label: 'Sub Heading', style: [TEXT_STYLES, BACKGROUND, BORDER_RADIUS, BOX_SHADOW], props: ['text'] },
                "style": {
                    "color": "deepskyblue",
                    colorVariable: COLOR_VARIABLES.COLOR_PARAGRAPH,
                    "fontSize": "20px"
                },
                textStyleVariable: 'p'
            },
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.DIV,
                "componentName": "CTA Button",
                "props": {
                    "text": "Call To Action"
                },
                "background": {
                    value: ["#0000"],
                    colorVariable: COLOR_VARIABLES.COLOR_PRIMARY,
                    type: 'Color',
                },
                "editable": { label: 'CTA Button', style: [TEXT_STYLES, BACKGROUND, BORDER_RADIUS, BOX_SHADOW], props: ['text'] },
                "style": {
                    width: "auto",
                    "height": '50px',
                    "boxShadow": 'unset',
                    "padding": {
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '20px',
                        paddingRight: '20px'
                    },
                    colorVariable: COLOR_VARIABLES.COLOR_PRIMARY_CONTRAST,
                    "fontSize": "20px"
                }
            }
        ]
    }
}
export default NavigationOneConfg;