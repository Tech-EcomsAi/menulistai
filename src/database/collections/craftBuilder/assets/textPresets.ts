import { DB_COLLECTIONS } from "@constant/database";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { addDoc, collection } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { doc, getDocs, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.CRAFT_ASSETS_TEXT_PRESETS;

const getCollectionRef = async () => {
    const session = await getActiveSession();
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

export const addTextPresets = async (templateDetails: any) => {
    return await apiCallComposer(
        async () => {
            if (templateDetails.preview) {
                const id = new Date().getTime()
                let previewUrl = await uploadBase64ToStorage({
                    fileId: id,
                    url: templateDetails.preview,
                    path: `${DB_COLLECTIONS.CRAFT_BUILDER}/${DB_COLLECTIONS.CRAFT_ASSETS_TEXT_PRESETS}/${id}`,
                    type: "jpeg"
                })
                templateDetails.preview = previewUrl;
            }
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer(templateDetails));
            const templateId = docRef.id
            console.log("Document written with ID: ", templateId);
            return templateId;
        },
        templateDetails,
        "addTextPresets"
    );
}

export const updateTextPreset = async (templateDetails: any) => {
    return await apiCallComposer(
        async () => {
            const session = await getActiveSession();
            const collectionDocRef = doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, templateDetails.id);
            const docRef = await updateDoc(collectionDocRef, await requestBodyComposer(templateDetails));
            console.log("Document written with ID: ", collectionDocRef.id);
            return docRef;
        },
        templateDetails,
        "updateTextPreset"
    );
}

export const getAllTextPresets = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getAllTextPresets"
    );
}
