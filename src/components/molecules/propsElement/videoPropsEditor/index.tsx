import Saperator from "@atoms/Saperator"
import { Checkbox, Flex, Typography } from "antd"
import { memo } from "react"
const { Text } = Typography

const props = {
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
    "src": "https://player.vimeo.com/progressive_redirect/playback/918754374/rendition/360p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=7315baa0d8769365f0babe63aaf857bf3bd95fb8098c80bb055f95e2ef44eab5"
}

function VideoPropsEditor({ config, onChange, label = '', placeholder, minRows = 1, maxRows = 3 }) {

    const onChangeFullscreenMode = (active) => {
        if (active) {
            onChange("controlsList", config.controlsList.split(" nofullscreen")[0])
        } else {
            onChange("controlsList", `${config.controlsList} nofullscreen`)
        }
    }
    return (
        <Flex vertical gap={10}>
            <Text strong>{label}</Text>
            <Checkbox checked={config.autoPlay} onChange={(e) => onChange("autoPlay", e.target.checked)}>AutoPlay</Checkbox>
            <Checkbox checked={config.controls} onChange={(e) => onChange("controls", e.target.checked)}>Show Controls</Checkbox>
            <Checkbox checked={config.loop} onChange={(e) => onChange("loop", e.target.checked)}>Play in loop</Checkbox>
            <Checkbox checked={config.muted} onChange={(e) => onChange("muted", e.target.checked)}>Default Muted</Checkbox>
            <Checkbox checked={!config.controlsList.includes('nofullscreen')} onChange={(e) => onChangeFullscreenMode(e.target.checked)}>Show Fullscreen Option</Checkbox>
            <Saperator />
        </Flex>
    )
}

export default memo(VideoPropsEditor)