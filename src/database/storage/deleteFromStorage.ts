import { firebaseStorage } from "@lib/firebase/firebaseClient";
import { deleteObject, ref } from "firebase/storage";

export const deleteFileByUrl = (url: any) => {
    return new Promise(async (res, rej) => {
        try {
            const storageRef = ref(firebaseStorage, url);
            // Delete the file
            deleteObject(storageRef).then(() => {
                res(true)
            }).catch((error) => {
                res(true)
            });
        } catch (error) {
            console.log("error while deleting", error)
            res(true)
        }
    })
}