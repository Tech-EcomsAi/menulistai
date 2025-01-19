import { SUCCESS_RESPONSE } from "@constant/common";
import { CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { deleteFileByUrl } from "@database/storage/deleteFromStorage";
import uploadJSONToStorage from "@database/storage/uploadJSONToStorage";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseStorage, firebaseStorageUrl } from "@lib/firebase/firebaseClient";
import { getDownloadURL, ref } from "firebase/storage";

const getTemplatesStateStoragePath = async (templateId) => {
    const session = await getActiveSession()
    return `${DB_COLLECTIONS.CRAFT_BUILDER}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.ROOT}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.STATE}/${session.tId}/${session.sId}/${templateId}`
}

export const addUpdateTemplateState = async (templateStateDetails: any, templateId: any) => {
    return await apiCallComposer(
        async () => {
            const stateUrl = await uploadJSONToStorage({
                id: templateId,
                data: templateStateDetails,
                path: await getTemplatesStateStoragePath(templateId)
            })
            console.log("Document written with ID: ", stateUrl);
            return stateUrl
        },
        templateStateDetails, templateId, "addUpdateTemplateState"
    );
}

export const getTemplateStateById = async (templateId: any) => {
    return await apiCallComposer(
        async () => {

            const templateUrl = `${firebaseStorageUrl}/${await getTemplatesStateStoragePath(templateId)}`
            console.log("getTemplateStateById templateUrl", templateUrl)
            const storageRef = ref(firebaseStorage, templateUrl);
            try {
                const url = await getDownloadURL(storageRef);
                const response = await fetch(url);
                const jsonData = await response.json();
                if (jsonData) {
                    return { ...jsonData, id: templateId };
                } else return null;
            } catch (error) {
                console.error('Error downloading file:', error);
                throw error; // Re-throw the error for handling in your component
            }
        },
        templateId, "getTemplateStateById"
    );
}

export const deleteTemplateStateById = async (templateId) => {
    return await apiCallComposer(
        async () => {
            const templateUrl = `${firebaseStorageUrl}/${await getTemplatesStateStoragePath(templateId)}`;
            const deleted = await deleteFileByUrl(templateUrl);
            return SUCCESS_RESPONSE
        },
        templateId
    );
}