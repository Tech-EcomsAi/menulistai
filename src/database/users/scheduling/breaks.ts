import { SUCCESS_RESPONSE } from "@constant/common";
import { DB_COLLECTIONS } from "@constant/database";
import { collection, deleteDoc, getDoc, getDocs } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { addDoc, doc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.BREAKS;

let session = null;
const getCollectionRef = async () => {
    session = Boolean(session) ? session : await getActiveSession()
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

const getDocRef = async (docId: any) => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, docId)
}

export const getAllBreaks = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getAllBreaks"
    );
}

export const getBreakById = async (id: number) => {
    return await apiCallComposer(
        async () => {
            const collectionDocRef = await getDocRef(id);
            const docSnap = await getDoc(collectionDocRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null
            }
        },
        id,
        "getBreakById"
    );
}

export const addBreak = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const submitedData = await requestBodyComposer(data);
            const docRef = await addDoc(await getCollectionRef(), submitedData);
            submitedData.id = docRef.id
            return submitedData;
        },
        data,
        "addBreak"
    );
}

export const updateBreak = async (data: any) => {
    return await apiCallComposer(
        async () => {
            await updateDoc(await getDocRef(data.id), await requestBodyComposer(data));
            return await requestBodyComposer(data);
        },
        data,
        "updateBreak"
    );
}

export const deleteBreakById = async (id) => {
    return await apiCallComposer(
        async () => {
            const collectionDocRef = await getDocRef(id);
            await deleteDoc(collectionDocRef);
            return SUCCESS_RESPONSE
        },
        id, 
        "deleteBreakById"
    );
}
