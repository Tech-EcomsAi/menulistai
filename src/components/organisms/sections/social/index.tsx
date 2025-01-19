import { SectionType } from "../homePage";
import FacebookSocialConfig from "./facebook";
import GoogleMapsSocialConfig from "./googleMaps";
import InstagramSocialConfig from "./instagram";
import TwitterSocialConfig from "./twitter";

const MEDIA_COMPONENTS_LIST = {
    INSTAGRAM: "Instagram",
    FACEBOOK: "Facebook",
    TWITTER: "Twitter",
    GOOGLE_MAPS: "Google Maps",
}
const SocialSectionsList: SectionType[] = [//unid = 1 for home page
    {
        name: "Social Media Profiles",
        unid: "3-1",//3:social,1: section
        components: [
            {
                unid: "3-1-1",
                name: MEDIA_COMPONENTS_LIST.INSTAGRAM,
                thumbnail: "https://app.framerstatic.com/instagram-ZB2QAVDX.png",
                config: InstagramSocialConfig("3-1-1"),
            },
            {
                unid: "3-1-2",
                name: MEDIA_COMPONENTS_LIST.FACEBOOK,
                thumbnail: "https://app.framerstatic.com/facebook-JX27QJ3U.png",
                config: FacebookSocialConfig("3-1-2"),
            },
            {
                unid: "3-1-3",
                name: MEDIA_COMPONENTS_LIST.TWITTER,
                thumbnail: "https://app.framerstatic.com/twitter-HBDUWK7W.png",
                config: TwitterSocialConfig("3-1-3"),
            },
            {
                unid: "3-1-4",
                name: MEDIA_COMPONENTS_LIST.GOOGLE_MAPS,
                thumbnail: "https://app.framerstatic.com/google-maps-X6BQJZHR.png",
                config: GoogleMapsSocialConfig("3-1-4"),
            }
        ]
    }
]

export default SocialSectionsList;