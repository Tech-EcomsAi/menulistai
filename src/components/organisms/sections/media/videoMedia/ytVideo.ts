import { CATEGORIES_LIST, COMPONENTS_TYPE, SECTION_UID_SEPARATOR } from "@constant/builder";
import { BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, CONTENT_ALIGNMENT, OBJECT_FIT, PADDING, SIZE } from "@constant/editorStylesProperties";
import { getUID } from "@util/utils";

const YTVideoMediaConfig = (UID) => {
    return {
        id: getUID(),//id used for dnd
        sectionId: CATEGORIES_LIST.MEDIA,
        componentName: "Youtube Video Container",
        thumbnail: "https://app.framerstatic.com/youtube-HA2DIBRU.png",
        unid: UID,//this parameter use for drag and drop component ( here 1: Media 1: common ,2: video

        //uniqe id used for internal identifications => sectionId + "#" + componentName
        uid: `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,

        "classNames": "videoComponentWrap",
        "appearance": {
            "mobile": true,
            "desktop": true
        },
        "style": {
            "display": "flex",
            "width": '100%',
            "height": '100%',
        },
        "background": {
            value: ['#ffff'],
            type: 'Color',
        },
        "editable": { label: 'Container', style: [BACKGROUND, BORDER, BORDER_RADIUS, BOX_SHADOW, PADDING, CONTENT_ALIGNMENT], props: [] },
        "component": COMPONENTS_TYPE.DIV,
        "children": [
            {
                "uid": `${UID}${SECTION_UID_SEPARATOR}${getUID()}`,
                "component": COMPONENTS_TYPE.YTVIDEO,
                "componentName": "Youtube Video",
                "props": {
                    autoPlay: false,//Specifies that the video will start playing as soon as it is ready
                    controls: true,//Specifies that video controls should be displayed (such as a play/pause button etc).
                    loop: true,//Specifies that the video will start over again, every time it is finished
                    poster: "",//Specifies an image to be shown while the video is downloading, or until the user hits the play button
                    controlsList: "nodownload noplaybackrate nofullscreen", //nofullscreen nodownload noremoteplayback noplaybackrate
                    // crossOrigin: "true",
                    // mediaGroup:true,
                    muted: true,//Specifies that the audio output of the video should be muted
                    // playsInline: true, //Mobile browsers, will play the video right where it is instead of the default, which is to open it up fullscreen while it plays.
                    // preload:true,
                    "src": "https://www.youtube.com/embed/smPos0mJvh8?si=fLcSlwhvTUiY6_R6"
                },
                "editable": { label: 'Video', style: [BORDER_RADIUS, BOX_SHADOW, SIZE, OBJECT_FIT], propsLabel: "Youtube Video source", props: ['src', 'thumbnail', 'videoProps'] },
                "style": {
                    "display": "flex",
                    width: "100%",
                    objectFit: "cover",
                    height: "100%",
                    "color": "green",
                    "overflow": "hidden",
                    "fontSize": "30px"
                }
            },
        ]
    }
}
export default YTVideoMediaConfig