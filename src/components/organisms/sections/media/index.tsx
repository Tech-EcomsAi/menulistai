import { SectionType } from "../homePage";
import AppleAudioMediaConfig from "./audioMedia/appleMusic";
import AudioMediaConfig from "./audioMedia/audio";
import SpotifyAudioMediaConfig from "./audioMedia/spotify";
import GIFMediaConfig from "./imageMedia/gif";
import ImageMediaConfig from "./imageMedia/image";
import VideoMediaConfig from "./videoMedia/video";
import YTVideoMediaConfig from "./videoMedia/ytVideo";

const MEDIA_COMPONENTS_LIST = {
    IMAGE_MEDIA: "Image",
    GIF_MEDIA: "GIF",
    VIDEO_MEDIA: "Video",
    YT_VIDEO_MEDIA: "Youttube Video",
    AUDIO_MEDIA: "Audio",
    SPOTIFY_AUDIO_MEDIA: "Spotify Audio",
    APPLE_AUDIO_MEDIA: "Apple Music Audio",
}
const MediaSectionsList: SectionType[] = [//unid = 1 for home page
    {
        name: "Image",
        unid: "2-1",//2:media,1:image section
        components: [
            {
                unid: "2-1-1",
                name: MEDIA_COMPONENTS_LIST.IMAGE_MEDIA,
                thumbnail: "https://app.framerstatic.com/image-DTLYUL43.png",
                config: ImageMediaConfig("2-1-1"),
                // component: ComposerComponent, //not passed beacuse default component passed at src/utils/websiteBuilder.ts
                // editor: Editor //not passed beacuse default editor component passed at src/utils/websiteBuilder.ts
            },
            {
                unid: "2-1-2",
                name: MEDIA_COMPONENTS_LIST.GIF_MEDIA,
                thumbnail: "https://app.framerstatic.com/giphy-YRBZLNJT.png",
                config: GIFMediaConfig("2-1-2"),
            }
        ]
    },
    {
        name: "Video",
        unid: "2-2",//2:media,1:Video section
        components: [
            {
                unid: "2-2-1",
                name: MEDIA_COMPONENTS_LIST.VIDEO_MEDIA,
                thumbnail: "https://app.framerstatic.com/video-HTCATKDE.png",
                config: VideoMediaConfig("2-2-1")
            },
            {
                unid: "2-2-2",
                name: MEDIA_COMPONENTS_LIST.YT_VIDEO_MEDIA,
                thumbnail: "https://app.framerstatic.com/youtube-HA2DIBRU.png",
                config: YTVideoMediaConfig("2-2-2")
            }
        ]
    },
    {
        name: "Audio",
        unid: "2-3",//2:media,1:Video section
        components: [
            {
                unid: "2-3-1",
                name: MEDIA_COMPONENTS_LIST.AUDIO_MEDIA,
                thumbnail: "https://app.framerstatic.com/mp3-3ZJP6QY5.png",
                config: AudioMediaConfig("2-3-1")
            },
            {
                unid: "2-3-2",
                name: MEDIA_COMPONENTS_LIST.SPOTIFY_AUDIO_MEDIA,
                thumbnail: "https://app.framerstatic.com/spotify-IOHGOJCF.png",
                config: SpotifyAudioMediaConfig("2-3-2")
            },
            {
                unid: "2-3-3",
                name: MEDIA_COMPONENTS_LIST.APPLE_AUDIO_MEDIA,
                thumbnail: "https://app.framerstatic.com/apple-music-OZSEJK56.png",
                config: AppleAudioMediaConfig("2-3-3")
            }
        ]
    }
]

export default MediaSectionsList;