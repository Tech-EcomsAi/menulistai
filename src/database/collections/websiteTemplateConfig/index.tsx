import { DB_COLLECTIONS } from "@constant/database";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.WEBSITE_TEMPLATES_CONFIG;

const getCollectionRef = async (templateId: any) => {
    const session = await getActiveSession();
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, templateId);
}

//referances
// https://firebase.google.com/docs/firestore/manage-data/add-data
//

export const addTemplateConfig = (templateConfigDetails: any, templateId: any) => {
    return new Promise(async (res, rej) => {
        const collectionDocRef = await getCollectionRef(templateId);
        const docRef = await setDoc(collectionDocRef, templateConfigDetails);
        console.log("Document written with ID: ", docRef);
        res(docRef)
    })
}

export const updateTemplateConfig = (templateConfigDetails: any, templateId: any) => {
    return new Promise(async (res, rej) => {
        const collectionDocRef = await getCollectionRef(templateId);
        const docRef = await updateDoc(collectionDocRef, templateConfigDetails);
        console.log("Document written with ID: ", collectionDocRef.id);
        res(docRef)
    })
}

//referances
// https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
//
export const getTemplateConfigById = (templateId: any) => {
    return new Promise(async (res, rej) => {
        const collectionDocRef = await getCollectionRef(templateId);
        const docSnap = await getDoc(collectionDocRef);
        if (docSnap.exists()) {
            res({ ...docSnap.data(), id: templateId });
        } else {
            console.log("No such document! getTemplateConfigById");
            res(null)
            // docSnap.data() will be undefined in this case
        }
    })
}