
import { firebaseStorage } from "@lib/firebase/firebaseClient";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
// const storageRef = ref(storage, 'templates');

// Data URL string
// const message4 = 'data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
// uploadString(storageRef, message4, 'data_url').then((snapshot) => {
//     console.log('Uploaded a data_url string!');
// });


type fileData = {
    fileId: any,
    url: any,
    path: any,
    type: "jpeg" | "png" | "svg"
}
const uploadBase64ToStorage = (fileData: fileData) => {
    return new Promise((resolve: any, reject: any) => {

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            fileId: fileData.fileId,
            contentType: 'image/jpeg'
        };

        let fileType: any = "data_url";
        let fileName = fileData.path;

        if (!Boolean(fileData.type) || fileData.type?.includes("jpeg")) {
            fileType = "data_url";
            fileName = `${fileName}.jpeg`
            metadata.contentType = 'image/jpeg'
        } else if (fileData.type.includes("png")) {
            fileType = "data_url";
            fileName = `${fileName}.png`
            metadata.contentType = 'image/png'
        } else if (fileData.type.includes("svg")) {
            fileType = "raw";
            fileName = `${fileName}.svg`
            metadata.contentType = 'image/svg+xml'
        }

        const storageRef = ref(firebaseStorage, fileName);
        const uploadTask = uploadString(storageRef, fileData.url, fileType, metadata);
        uploadTask.then(() => {
            getDownloadURL(storageRef).then((downloadURL) => {
                console.log('File available at', downloadURL);
                resolve(downloadURL)
            })
        })
            .catch((error: any) => {
                console.log("error while uploading file", error)
                resolve(null);
            })
    })
}
export default uploadBase64ToStorage;