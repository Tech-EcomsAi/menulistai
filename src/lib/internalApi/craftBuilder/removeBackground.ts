import axios from "axios";

export const removeImageBackground: any = (selectedFile) => {
    return new Promise((res, rej) => {

        const formData = new FormData();
        formData.append('file', selectedFile.file);

        axios.post(`/api/craftBuilder/removeBg`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            // axios.post(`/api/craftBuilder/removeBg`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' })
            .then(async (response) => {
                const { data } = response;
                if (Boolean(data) && !data.error) {
                    res(data.data)
                } else {
                    console.log(`Error in removeImageBackground = `, data.error);
                    rej(data.error);
                }
            }).catch(function (error) {
                console.log(`Error in removeImageBackground = `, error);
                rej(error);
            });
    })
}