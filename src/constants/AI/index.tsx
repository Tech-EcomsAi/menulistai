
export const AI_OPERATIONS_LIST = {
    BACKGROUND_REMOVAL: "Background_Removal",
    IMAGE_GENERATION: "Image_Generation",
    IMAGE_COMPRESSION: "Image_Compression",
    TEXT_SUGGESTIONS_GENERATOR: "Design_Text_Suggestions",
}

export const OPENAI_ENDPOINT = "https://api.openai.com/v1/"

export const TEXT_SUGESTIONS_API = {
    MODAL: "gpt-3.5-turbo-instruct"
};

export const IMAGE_GENRATION_API = {
    MODAL: "dall-e-3",
    STYLES: "natural",
    QUALITY: "standard",
    IMAGE_SIZES: {
        "dall-e-2": "512x512",
        "dall-e-3": "1024x1024",
    }
}

