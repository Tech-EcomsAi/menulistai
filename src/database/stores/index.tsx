import { DB_COLLECTIONS } from "@constant/database";
import { updateStoresCountInPlatformSummary } from "@database/platformSummary";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.STORES;

const getCollectionRef = () => {
    return collection(firebaseClient, COLLECTION)
}

const getDocRef = (docId: any) => {
    return doc(firebaseClient, `${COLLECTION}`, `${docId}`)
}

export const getAllStores = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getAllStores"
    );
}

export const getAllStoresByTenantId = async (tenantId: any) => {
    return await apiCallComposer(
        async () => {
            const ref = query(await getCollectionRef(), where("tenantId", "==", tenantId));
            const querySnapshot = await getDocs(ref);
            if (querySnapshot.empty) {
                console.log(`${tenantId} : Stores not available getAllStoresByTenantId`);
                return ([]);
            } else {
                const list: any = [];
                querySnapshot.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id })
                });
                return (list)
            }
        },
        "getAllStores"
    );
}

export const getStoreById = async (id: number) => {
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
        "getStoreById"
    );
}

const updateLogoImage = async (data) => {

    let logoUrl: any = '';
    let imageType: any = data.imageType;
    let imageToUpdate: any = data.imageToUpdate;

    delete data.imageToUpdate;
    delete data.imageType;
    const docId = data.storeId//which is storeId
    const docRef = await getDocRef(`${docId}`);

    if (imageToUpdate) {
        if (imageToUpdate?.includes('base64')) {
            //upload logo image to firebase storage
            logoUrl = await uploadBase64ToStorage({
                fileId: docId,
                url: imageToUpdate,
                path: `${COLLECTION}/logos/${docId}`,
                type: imageType
            })
        }
        return logoUrl;
    } else return "";
}

export const addStore = async (data: any) => {
    return await apiCallComposer(
        async () => {

            data.id = data.storeId
            if (data.imageToUpdate) {
                const newUrl = await updateLogoImage(data)
                data.logo = newUrl;
                delete data.imageToUpdate;
                delete data.imageType;
            }
            await setDoc(getDocRef(data.id), await requestBodyComposer(data));
            await updateStoresCountInPlatformSummary()
            return ({ ...data })
        },
        data,
        "addStore"
    );
}

export const updateStore = async (data: any) => {
    return await apiCallComposer(
        async () => {

            data.id = data.storeId
            if (data.imageToUpdate) {
                const newUrl = await updateLogoImage(data)
                data.logo = newUrl;
                delete data.imageToUpdate;
                delete data.imageType;
            }
            await updateDoc(getDocRef(data.id), await requestBodyComposer(data));
            return data;
        },
        data,
        "updateStore"
    );
}