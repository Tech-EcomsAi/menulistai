import { SUCCESS_RESPONSE } from "@constant/common";
import { CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { deleteFileByUrl } from "@database/storage/deleteFromStorage";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "@firebase/firestore";
import { datePareserForClientSide, requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { CraftTemplateType } from "@template/craftBuilder/types";
import { or, query, updateDoc, where } from "firebase/firestore";
import { addUpdateTemplateState, deleteTemplateStateById, getTemplateStateById } from "./craftTemplateState";


// // Replace with your Firebase configuration
// const db = /* your Firebase app and firestore instance */;

// const documentId = "your-desired-document-id"; // Replace with your ID
// const data = { // Your document data
//     name: "Document Name",
//     // ... other fields
// };

// // Create a reference to the document with the provided ID
// const docRef = doc(collection(db, "your-collection-name"), documentId);

// // Add the document with the provided ID and merge data:
// await setDoc(docRef, data, { merge: true }); // Optional: Set `merge: true` to update existing fields

// console.log("Document written with ID:", documentId);


const COLLECTION = `${DB_COLLECTIONS.CRAFT_BUILDER}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.ROOT}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.CONFIG}`;

const getTemplatesPreviewStoragePath = async (templateId) => {
    const session = await getActiveSession()
    return `${DB_COLLECTIONS.CRAFT_BUILDER}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.ROOT}/${CRAFT_BUILDER_TEMPLATES_DB_COLLECTIONS.PREVIEW}/${session.tId}/${session.sId}/${templateId}`
}

const getCollectionRef = async (session: any = null) => {
    session = Boolean(session) ? session : await getActiveSession()
    console.log("sessionnn", session)
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

const getDocRef = async (templateId: any) => {
    const session = await getActiveSession()
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, templateId)
}

export const addTemplate = async (templateDetails: CraftTemplateType) => {
    return await apiCallComposer(
        async () => {
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer(templateDetails));
            const templateId = docRef.id
            console.log("Document written with ID: ", templateId);
            return (templateId)
        },
        templateDetails,
        "addTemplate"
    );
}

export const createTemplateWithState = async (templateDetails: any, templateState: any) => {
    return await apiCallComposer(
        async () => {
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer(templateDetails));
            const templateId = docRef.id
            console.log("New Template created with id: ", templateId);
            await addUpdateTemplateState(templateState, templateId);
            console.log("New Template State added successfully for id: ", templateId)
            return templateId
        },
        templateDetails, templateState,
        "createTemplateWithState"
    );
}

export const cloneTemplateWithState = async (templateDetails: CraftTemplateType) => {
    return await apiCallComposer(
        async () => {
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer(templateDetails));
            const templateId = docRef.id
            console.log("Template created with: ", templateId);
            const templateState = await getTemplateStateById(templateId);
            console.log("Original template state get done: ", templateState);

            await addUpdateTemplateState(templateState, templateId).then(() => {
                console.log("New template state added: ", templateId);
                return (templateId)
            });
        },
        templateDetails,
        "cloneTemplateWithState"
    );
}

export const updateTemplateValue = async (templateDetails: CraftTemplateType, data: any) => {
    return await apiCallComposer(
        async () => {
            if (Object.keys(data).length) {
                const collectionDocRef = await getDocRef(templateDetails.id);
                const docRef = await updateDoc(collectionDocRef, data);
                console.log(`Document updated for: doc: ${docRef}, where key: ${data.key} & value:${data.value}`);
                return ({ ...SUCCESS_RESPONSE, message: "Template marked as favourite", data: { ...templateDetails, ...data } })
            } else {
                return ({
                    status: 400,
                    data: data,
                    message: "Key not available in request",
                    apiStatus: false
                })
            }
        },
        templateDetails, data, "updateTemplateValue"
    );
}

export const updateTemplateAndState = async (templateDetails: any, templateStateDetails: any) => {
    return await apiCallComposer(
        async () => {
            const collectionDocRef = await getDocRef(templateDetails.id);
            let docRef;
            let previewUrl: any = templateDetails.preview;
            let deleteOldPreview = null;
            try {
                if (templateDetails.updatedPreview?.includes('base64')) {
                    if (templateDetails.preview) {
                        deleteOldPreview = await deleteFileByUrl(templateDetails.preview);
                    }
                    //upload preview image to firebase storage
                    previewUrl = await uploadBase64ToStorage({
                        fileId: templateDetails?.id,
                        url: templateDetails.updatedPreview,
                        path: await getTemplatesPreviewStoragePath(templateDetails.id),
                        type: "jpeg"
                    })
                }
            } catch (error) {
                console.log("error", error);
                return (error)
            }
            templateDetails.preview = previewUrl || templateDetails.preview;//in case new template preview upload failed then use previous one
            delete templateDetails.updatedPreview;
            if (templateDetails.id) {
                docRef = await updateDoc(collectionDocRef, templateDetails);
            } else {
                docRef = await addTemplate(templateDetails);
            }
            const updatedStateUrl = await addUpdateTemplateState(templateStateDetails, templateDetails.id);
            console.log("State updated suucessfully: ", docRef, updatedStateUrl);
            return (docRef)
        },
        templateDetails, templateStateDetails, "updateTemplateValue"
    );
}

export const getTemplatesBySectionId = async (sectionId, categoryId: any) => {
    return await apiCallComposer(
        async () => {
            const ref = query(await getCollectionRef(), where("sectionId", "==", sectionId), where("categoryId", "==", categoryId));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                console.log(`${sectionId} Templates not available getTemplatesBySectionId`);
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    const templateData = datePareserForClientSide(doc.data())
                    list.push({ ...templateData, id: doc.id })
                });
                return (list)
            }
        },
        sectionId, categoryId, "getTemplatesBySectionId"
    );
}

export const getCuratedTemplates = async (sectionKey: any = "") => {//sectionKey == isFeatured || isTrending || isNew

    return await apiCallComposer(
        async () => {
            let ref = query(await getCollectionRef(), or(where("isFeatured", '==', true), where("isTrending", '==', true), where("isNew", '==', true)));
            if (sectionKey) {
                ref = query(await getCollectionRef(), where(`${sectionKey}`, '==', true));
            }
            const querySnapshot = await getDocs(ref);

            const list: any = [];
            querySnapshot.forEach((doc) => {
                const templateData = datePareserForClientSide(doc.data())
                list.push({ ...templateData, id: doc.id })
            });
            return (list)
            // if (querySnapshot.empty) {
            //     return ([]);
            // } else {
            // }
        },
        "getCuratedTemplates"
    );
}

export const getTemplatesByCurationId = async (curationKey) => {
    return await apiCallComposer(
        async () => {
            let queryParam = where(curationKey, "==", true);
            const ref = query(await getCollectionRef(), queryParam);
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    const templateData = datePareserForClientSide(doc.data())
                    list.push({ ...templateData, id: doc.id })
                });
                return (list)
            }
        },
        curationKey, "getTemplatesByCurationId"
    );
}

export const getRecentTemplates = async () => {
    return await apiCallComposer(
        async () => {
            const session = await getActiveSession();
            const ref = query(await getCollectionRef(), where("uId", "==", session.uId));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                console.log(`${session.uId} Templates not available getRecentTemplates`);
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id })
                });
                return (list)
            }
        },
        "getRecentTemplates"
    );
}

export const getAllTemplates = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const platformTemplates = [];
            const userTemplates = [];
            querySnapshot.forEach((doc) => {
                platformTemplates.push({ ...doc.data(), id: doc.id })
            });
            const session = await getActiveSession()
            if (session.tId !== 0) {
                const querySnapshot = await getDocs(await getCollectionRef(session));
                querySnapshot.forEach((doc) => {
                    userTemplates.push({ ...doc.data(), id: doc.id })
                })
            }
            return ({ platformTemplates, userTemplates });
        },
        "getAllTemplates",
        true//isPublicApi or not
    );
}

export const getUserFavouriteTemplates = async () => {
    const session = await getActiveSession()
    return await apiCallComposer(
        async () => {
            const ref = query(await getCollectionRef(), where("favouriteList", "array-contains", session.uId));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    const templateData = datePareserForClientSide(doc.data())
                    list.push({ ...templateData, id: doc.id })
                });
                return (list)
            }
        },
        session, "getUserFavouriteTemplates"
    );
}

export const getTemplateById = async (templateId: any) => {
    return await apiCallComposer(
        async () => {
            const collectionDocRef = await getDocRef(templateId);
            const docSnap = await getDoc(collectionDocRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null
            }
        },
        templateId, "getTemplateById"
    );
}

export const getTemplateSuggestionsForEditor = async (resolution: any) => {
    return await apiCallComposer(
        async () => {
            const ref = query(await getCollectionRef(), where("width", "==", resolution.width), where("height", "==", resolution.height));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    const templateData = datePareserForClientSide(doc.data())
                    list.push({ ...templateData, id: doc.id })
                });
                return (list)
            }
        },
        resolution, "getEditorResolutionTemplate"
    );
}

export const deleteTemplateById = async (templateDetails: CraftTemplateType) => {
    return await apiCallComposer(
        async () => {
            if (templateDetails.preview) {
                const previewDeleted = await deleteFileByUrl(templateDetails.preview);
                console.log("Preview Image Deleted")
            }
            const collectionDocRef = await getDocRef(templateDetails.id);
            const templateDoc = await deleteDoc(collectionDocRef);
            console.log("Template config Deleted")

            const templateStateDoc = await deleteTemplateStateById(templateDetails.id);
            console.log("Template state Deleted")
            return ({ status: 200, data: true })
        },
        templateDetails, "deleteTemplateById"
    );
}

export const getTemplateWithStateById = async (templateId: any) => {
    return await apiCallComposer(
        async () => {
            const collectionDocRef = await getDocRef(templateId);
            const docSnap: any = await getDoc(collectionDocRef);
            !docSnap.exists() && console.log("No such document! getTemplateWithStateById docSnap.exists()", docSnap.exists());
            if (docSnap.exists()) {

                let templateDetails: any = { ...docSnap.data(), id: templateId };
                console.log("templateDetails templateDetails", templateDetails)

                try {
                    //convert all timestamp to formated date string
                    templateDetails = datePareserForClientSide(templateDetails)
                    console.log("converted time templateDetails", templateDetails)
                    const templateState: any = await getTemplateStateById(templateId);
                    console.log("templateState fetched", templateState)
                    if (Boolean(templateState)) {
                        return ({ templateDetails, templateState })
                    } else {
                        console.log("templateState not found :getTemplateWithConfigById");
                        return ({ templateDetails })
                    }
                } catch (error) {
                    console.log(":getTemplateWithConfigById catch");
                    return null;
                }
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document! getTemplateWithConfigById");
                return null;
            }
        },
        templateId, "getTemplateWithStateById"
    );
}