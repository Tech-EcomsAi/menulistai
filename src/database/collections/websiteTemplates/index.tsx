import { DB_COLLECTIONS } from "@constant/database";
import { addDoc, collection, doc, getDoc, getDocs } from "@firebase/firestore";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { addTemplateConfig, getTemplateConfigById } from "../websiteTemplateConfig";

const COLLECTION = DB_COLLECTIONS.WEBSITE_TEMPLATES;

const getCollectionRef = async () => {
    const session = await getActiveSession();
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

const getDocRef = async (templateId: any) => {
    const session = await getActiveSession()
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, templateId)
}

export const addTemplate = (templateDetails: any) => {
    return new Promise(async (res, rej) => {
        const docRef = await addDoc(await getCollectionRef(), templateDetails);
        const templateId = docRef.id
        console.log("Document written with ID: ", templateId);
        await addTemplateConfig({ config: "" }, templateId).then(() => {
            console.log("Config updated successfully")
            res(docRef.id)
        });
    })
}

export const getTemplate = () => {
    return new Promise(async (res, rej) => {
        const querySnapshot = await getDocs(await getCollectionRef());
        const templatesList = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            templatesList.push({ ...doc.data(), id: doc.id })
        });
        res(templatesList);
    })
}

export const getTemplateById = (templateId) => {
    return new Promise(async (res, rej) => {
        const ref = await getDocRef(templateId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            res(docSnap.data())
            console.log("Document data:", docSnap.data());
        } else {
            rej()
            // docSnap.data() will be undefined in this case
            console.log("No such document! getTemplateById");
        }

    })
}

export const getTemplateWithConfigById = (templateId) => {
    return new Promise(async (res, rej) => {
        const ref = await getDocRef(templateId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            try {
                const templateConfig: any = await getTemplateConfigById(templateId);
                if (Boolean(templateConfig)) {
                    const templateDetails: any = { ...docSnap.data(), id: templateId, templateConfig }
                    res(templateDetails)
                } else {
                    res(null)
                }
            } catch (error) {
                rej()
            }
        } else {
            rej()
            // docSnap.data() will be undefined in this case
            console.log("No such document! getTemplateWithConfigById");
        }
    })
}