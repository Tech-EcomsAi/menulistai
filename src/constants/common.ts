import HorizontalLogo from "@assets/logo/horizontal.svg";

export const APP_NAME = 'MenulistAi'
export const APP_TAGLINE = 'Your Second Brain'
export const APP_THEME_COLOR = "#0054D0";
export const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';
export const BUILDER_CONTAINER = 'BUILDER';
export const OVERLAY_CONTAINER = 'OVERLAY';
export const PREVIEW_CONTAINER = 'PREVIEW';
export const SECTION_PAGE = 'SECTION';
export const CRAFT_BUILDER_APP = 'CRAFT BUILDER';
export const WEBSITE_BUILDER_APP = 'WEBSITE BUILDER';
export const PREVIEW_PAGE_LINK = 'PREVIEW_LINK';
export const PATTERN_PAGE = 'PATTERN';
export const EMPTY_ERROR = { id: '', message: '' };
export const NO_COLOR_VALUE = '#ffffff00';
export const SEARCHED_IMAGES_COUNT_PER_REQUEST_UNSPLASH = 30;
export const SEARCHED_IMAGES_COUNT_PER_REQUEST_PEXELS = 80;
export const SEARCHED_IMAGES_COUNT_PER_REQUEST_PIXABAY = 200;
export const IMAGE_COMPRESSION_LIMIT = 500000;//500kb
export const BGRCreditValueInPrice = 100;//1 credit = 100 paise(1rs) // used only when purchasing credits
export const BGRCreditValueInTokens = 500;//1 credit = 500 token (ex. 1mb image = 1000kb cost 1000token/500 = 2credits = 2rs)

// export const LOGO = IconLogo;
export const HORIZONTAL_LOGO = HorizontalLogo;
export const LOGO = 'https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/ecomsAi%2Flogo%2Flogo.png?alt=media&token=af824138-7ebb-4a72-b873-57298fd0a430'
export const LOGO_TEXT = 'MenulistAi'
export const LOGO_LARGE = 'https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/ecomsAi%2Flogo%2Fhorizontal.svg?alt=media&token=aee07ecb-c9ce-4a65-b3e1-1bea2a3f12ef';
export const LOGO_SMALL = 'https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/ecomsAi%2Flogo%2Fsquare_transperant.png?alt=media&token=8389d9c9-7b79-4c49-aa33-c2c24e15acd5';
export const LOGO_ANIMATED = 'https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/ecomsAi%2Flogo%2FecomsAi.gif?alt=media&token=6ce6e52d-7ac5-4e46-b68f-fdd1e11cba07';
export const BACKGROUND_IMAGES_ORIENTATIONS = {
    LANDSCAPE: 'landscape',
    PORTRAIT: 'portrait',
    SQUARE: 'square',
}

export const ERROR_TYPES = {
    FUNCTIONAL: "FUNCTIONAL"
}

export const BACKGROUND_TYPES = {
    COLOR: 'Color',
    GRADIENT: 'Gradient',
    IMAGE: 'image',
}

export const BACKGROUND_IMAGES_TYPES = {
    SMALL: 'small',
    LARGE: 'large',
    SQUARE: 'square',
}

export const AVAILABLE_LANGUAGES: any = [
    {
        value: 'en',
        label: 'English',
        // languageLabel: 'English',
    },
    {
        value: 'hi',
        label: 'Hindi',
        languageLabel: 'हिंदी',
    },
    {
        value: 'ar',
        label: 'Arebic',
        languageLabel: 'عربي',
    },
];

export const DEFAULT_PRIMARY_FONT = "poppins"
export const DEFAULT_LIGHT_COLOR = '#002864';
export const DEFAULT_DARK_COLOR = '#00C9A7';
export const DARK_COLORS = ['#00bfff', '#bd83b8', '#66a8cf', '#F1916D', '#f5d7db', '#00C9A7', '#116D6E', '#D4ADFC', '#F4EEE0', '#B6EADA', '#E9A6A6'];
export const LIGHT_COLORS = ['#00bfff', '#cb2b83', '#bd83b8', '#1d1a39', '#26425a', '#451952', '#1b3358', '#072e33', '#F1916D', '#0C134F', '#363062', '#610C9F', '#E19898'];
export const NEON_COLORS = ['#79E0EE', '#FFB84C', '#FF55BB', '#F6F1E9', '#F0FF42', '#060047'];
export const PASTEL_COLORS = ['#C4DFDF', '#F5F0BB', '#ACB1D6', '#DDFFBB', '#B9F3E4'];

export const SUCCESS_RESPONSE = {
    status: 200,
    data: "",
    message: "success",
    apiStatus: true// true|| false
}

export const ERROR_RESPONSE = {
    status: 400,
    data: "",
    message: "failed",
    apiStatus: false// true|| false
}

export const APP_LANGUAGES = [
    { label: "English (British English spelling)", value: "en-GB" },
    { label: "English (American English spelling)", value: "en-US" },
    { label: "हिन्दी (Hindi)", value: "hi-IN" },
]

export const PAGE_HEADING_FONT_SIZE = "var(--fz-xxl)"
export const HEADING_FONT_SIZE = "var(--fz-xl)"
export const SUBHEADING_FONT_SIZE = "var(--fz-lg)"

export const DATE_TIME_FORMAT_PATTERNS = {
    "yyyy-MM-dd HH:mm:ssXXX": "yyyy-MM-dd HH:mm:ssXXX",
    "01/08/2024, 08:56 am": "01/08/2024, 08:56 am",
    "01/08/2024": "01/08/2024",
}

export const BUSINESS_TYPES = [
    { label: "Salon", value: "salon" },
    { label: "Spa", value: "spa" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Tattoo Artist", value: "tattoo_artist" },
]