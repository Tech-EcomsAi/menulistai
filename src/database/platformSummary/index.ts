import { DB_COLLECTIONS } from "@constant/database";
import { collection, getDocs } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { addDoc, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.PLATFORM_SUMMARY;

const getCollectionRef = () => {
    return collection(firebaseClient, COLLECTION)
}

const getPlatformSummaryDocRef = (docId: any) => {
    return doc(firebaseClient, `${COLLECTION}`, docId)
}

export const getPlatformSummary = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getPlatformSummary"
    );
}

export const addPlatformSummary = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const docRef = await addDoc(getCollectionRef(), await requestBodyComposer(data));
            const docId = docRef.id
            return ({ ...data, id: docId })
        },
        data,
        "addPlatformSummary"
    );
}

export const updateTenantsCountInPlatformSummary = async () => {
    return await apiCallComposer(
        async () => {

            const ref = await getPlatformSummaryDocRef(DB_COLLECTIONS.TENANTS);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                console.log("docSnap.data()", docSnap.data())
                await updateDoc(ref, { count: increment(1) });
            } else {
                //for the first time in life
                await setDoc(ref, { count: 0 });
            }
            return true;
        },
        "updateTenantsCountInPlatformSummary"
    );
}


export const updateStoresCountInPlatformSummary = async () => {
    return await apiCallComposer(
        async () => {

            const ref = await getPlatformSummaryDocRef(DB_COLLECTIONS.STORES);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                console.log("docSnap.data()", docSnap.data())
                await updateDoc(ref, { count: increment(1) });
            } else {
                //for the first time in life
                await setDoc(ref, { count: 0 });
            }
            return true;
        },
        "updateStoresCountInPlatformSummary"
    );
}