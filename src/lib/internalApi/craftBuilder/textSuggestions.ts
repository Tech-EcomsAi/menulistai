import { DEFAULT_CRAFT_TEMPLATE_ID } from "@constant/craftBuilder";
import axios, { AxiosResponse } from "axios";

export const getTextSuggestions: any = (keywords, type = "", templateId = DEFAULT_CRAFT_TEMPLATE_ID) => {//if template id is not avai;able then 
    return new Promise((res, rej) => {
        console.log("userPrompt", keywords)
        axios.post(`/api/craftBuilder/textSuggestions`, { keywords, type, templateId })
            .then(async (response: AxiosResponse) => {
                const { data } = response;
                console.log("response:api/craftBuilder/textSuggestions", response)
                if (Boolean(data) && !data.error) {
                    res(data)
                } else {
                    console.log(`Error in textSuggestions = `, data.error);
                    res(null)
                }
            }).catch(function (error) {
                console.log(`Error in removeImageBackground = `, error);
                rej(error);
            });
    })
}