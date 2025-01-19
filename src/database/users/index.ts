import { DB_COLLECTIONS } from "@constant/database";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { objectNullCheck } from "@util/utils";
import { addDoc, doc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.USERS;

const getCollectionRef = () => {
    return collection(firebaseClient, COLLECTION)
}

const getDocRef = (docId: any) => {
    return doc(firebaseClient, `${COLLECTION}`, docId)
}

export const getUserByEmail = (email: string) => {
    console.log("getUserByEmail", email)
    return new Promise(async (res, rej) => {
        const q = query(getCollectionRef(), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log('User not found.');
            res(null);
        } else {
            querySnapshot.forEach(doc => res({ ...doc.data(), id: doc.id }));
        }
    })
}

const uploadImage = async (data, type = '') => {

    let newUrl: any = '';
    let imageType: any = data.imageType;
    let imageToUpdate: any = data.imageToUpdate;
    const docId = data.id;

    if (imageToUpdate) {
        if (imageToUpdate?.includes('base64')) {
            //upload logo image to firebase storage
            newUrl = await uploadBase64ToStorage({
                fileId: docId,
                url: imageToUpdate,
                path: `${COLLECTION}/${type}/${docId}`,
                type: imageType
            })
        }
        return newUrl
    } else return ''
}

const updateUser = async (data) => {

    //upload user profile image
    if (data.imageToUpdate) {
        const newUrl = await uploadImage(data)
        data.profileImage = newUrl;
        delete data.imageToUpdate;
        delete data.imageType;
    }

    //upload additional documents files
    const additionalFileToUpload = data.additionalDocuments?.filter(doc => doc.url.includes('base64')) || [];
    if (additionalFileToUpload.length) {
        for (let i = 0; i < data.additionalDocuments.length; i++) {
            if (data.additionalDocuments[i].url.includes('base64')) {
                data.additionalDocuments[i].url = await uploadImage({ imageType: data.additionalDocuments[i].type, imageToUpdate: data.additionalDocuments[i].url }, 'additionalDocuments')
            }
        }
    }

    if (objectNullCheck(data)) {
        await updateDoc(getDocRef(data.id), data);
    }
    return data;
}

export const addPlatoformUser = async (data: any) => {
    return await apiCallComposer(
        async () => {
            //add user first
            const userToadd = await requestBodyComposer(data)
            const docRef = await addDoc(getCollectionRef(), userToadd);
            userToadd.id = docRef.id;
            return await updateUser(userToadd);
        },
        data,
        "addPlatoformUser"
    );
}

export const updatePlatformUser = async (data: any) => {
    return await apiCallComposer(
        async () => {
            return await updateUser(data);
        },
        data,
        "updatePlatformUser"
    );
}

export const getAllPlatformUsers = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getAllPlatformUsers"
    );
}

export const getUsersByStoreId = async (storeId) => {

    return await apiCallComposer(
        async () => {
            const ref = query(await getCollectionRef(), where("storeIds", "array-contains", storeId));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                console.log(`${storeId} Templates not available getTemplatesBySectionId`);
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id })
                });
                return (list)
            }
        },
        storeId,
        "getUsersByStoreId"
    );
}