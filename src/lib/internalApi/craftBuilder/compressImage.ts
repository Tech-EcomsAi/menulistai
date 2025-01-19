import { getCompressedImage } from "@util/utils";
import axios from "axios";

export const compressImage: any = (selectedFile) => {
    return new Promise(async (res, rej) => {

        //this is only ,imic the feature
        //we are doing compression on front end side only
        const formData = new FormData();
        formData.append('file', selectedFile.file);
        const base64: any = await getCompressedImage(selectedFile.file)
        formData.append('base64', base64);

        axios.post(`/api/craftBuilder/imageCompression`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(async (response) => {
                const { data } = response;
                if (Boolean(data) && !data.error) {
                    res(data.data)
                } else {
                    console.log(`Error in removeImagimageCompressioneBackground = `, data.error);
                    rej(data.error);
                }
            }).catch(function (error) {
                console.log(`Error in imageCompression = `, error);
                rej(error);
            });
    })
}