import axios, { AxiosResponse } from "axios";

async function getFormDataFromURL(url: string) {
    //Fetch image data from url 
    const formData = new FormData();
    const imageData = await fetch(url);
    //Create blob of image data
    const imageBlob = await imageData.blob();
    const file = new File([imageBlob], 'image', {
        type: imageBlob.type,
    });
    formData.append('image', file);
    debugger
    return imageBlob
};

export const generateImage: any = (promptData) => {//if template id is not avai;able then 
    return new Promise((res, rej) => {
        axios.post(`/api/craftBuilder/imageGeneration`, { promptData })
            .then(async (response: AxiosResponse) => {
                const { data } = response;
                if (Boolean(data) && !data.error) {
                    res(data.data)
                } else {
                    console.log(`Error in imageGeneration = `, data.error);
                    rej(data.error);
                }
            }).catch(function (error) {
                console.log(`Error in imageGeneration = `, error);
                rej(error);
            });
    })
}