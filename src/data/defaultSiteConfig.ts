import { COLOR_VARIABLES } from "@constant/builder";
import { DARK_COLORS, DEFAULT_PRIMARY_FONT, LIGHT_COLORS, LOGO_TEXT, NEON_COLORS, PASTEL_COLORS } from "@constant/common";
import { ActiveTemplateConfigType } from "@reduxSlices/siteBuilderState";

const defaultSiteConfig: ActiveTemplateConfigType = {
    id: '',
    version: '1.0',
    name: 'Default',
    createdOn: "",
    modifiedOn: "",
    logo: {
        type: 'TEXT',
        value: LOGO_TEXT
    },
    background: {
        value: 'colorBg',
        type: 'Color',
        src: 'https://orra.respark.in/assets/images/female/bg.png',
    },
    colors: [
        { label: 'Dark & Light', colors: [...DARK_COLORS, ...LIGHT_COLORS] },
        { label: 'Neon & Pastel', colors: [...NEON_COLORS, ...PASTEL_COLORS] },
    ],
    style: {
        padding: '0 0 0 0',
    },
    colorVariables: {
        [COLOR_VARIABLES.COLOR_BACKGROUND]: '#ffff',
        [COLOR_VARIABLES.COLOR_SURFACE]: '#dee1ec',
        [COLOR_VARIABLES.COLOR_TEXT]: '#04041B',
        [COLOR_VARIABLES.COLOR_PARAGRAPH]: '#868383',
        [COLOR_VARIABLES.COLOR_PRIMARY]: '#ff8dc7',
        [COLOR_VARIABLES.COLOR_PRIMARY_CONTRAST]: '#ffff',
    },
    textStyles: {
        "h1": { fontSize: "50px", fontFamily: DEFAULT_PRIMARY_FONT, color: "red", lineHeight: "75px" },
        "h2": { fontSize: "40px", fontFamily: DEFAULT_PRIMARY_FONT, color: "green", lineHeight: "60px" },
        "h3": { fontSize: "30px", fontFamily: DEFAULT_PRIMARY_FONT, color: "yellow", lineHeight: "45px" },
        "h4": { fontSize: "25px", fontFamily: DEFAULT_PRIMARY_FONT, color: "blue", lineHeight: "37.5px" },
        "h5": { fontSize: "20px", fontFamily: DEFAULT_PRIMARY_FONT, color: "orange", lineHeight: "30px" },
        "h6": { fontSize: "19px", fontFamily: DEFAULT_PRIMARY_FONT, color: "deeppink", lineHeight: "28.5px" },
        "p": { fontSize: "10px", fontFamily: DEFAULT_PRIMARY_FONT, color: "skyblue", lineHeight: "15px" },
    },
    templateState: null
};

export default defaultSiteConfig;