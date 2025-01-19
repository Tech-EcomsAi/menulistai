import { DB_COLLECTIONS } from "@constant/database";
import { updateTenantsCountInPlatformSummary } from "@database/platformSummary";
import { deleteFileByUrl } from "@database/storage/deleteFromStorage";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.TENANTS;

const getCollectionRef = () => {
    return collection(firebaseClient, COLLECTION)
}

const getDocRef = (docId: any) => {
    return doc(firebaseClient, `${COLLECTION}`, `${docId}`)
}

export const getAllTenants = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef());
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id })
            });
            return (list);
        },
        "getAllTenants"
    );
}

export const getTenantByEmail = (email: string) => {
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

export const getTenantById = async (id: number) => {
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
        "getTenantById"
    );
}
export const addTenant = async (data: any) => {
    return await apiCallComposer(
        async () => {

            let logoUrl: any = '';
            let imageType: any = data.imageType;
            let imageToUpdate: any = data.imageToUpdate;

            delete data.imageToUpdate;
            delete data.imageType;
            const docId = data.tenantId//which is tenantId
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
                data.logo = logoUrl;
            }
            data.storesList = [];
            await setDoc(docRef, await requestBodyComposer(data));
            await updateTenantsCountInPlatformSummary()
            return ({ ...data, id: docId })
        },
        data,
        "addTenant"
    );
}

export const updateTenant = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const docId = data.tenantId//which is tenantId
            if (data.imageToUpdate) {

                let logoUrl: any = data.logo;

                let imageType: any = data.imageType;
                let imageToUpdate: any = data.imageToUpdate;
                delete data.imageToUpdate;
                delete data.imageType;

                if (imageToUpdate?.includes('base64')) {
                    if (data.logo) {
                        await deleteFileByUrl(data.logo);
                    }
                    //upload logo image to firebase storage
                    logoUrl = await uploadBase64ToStorage({
                        fileId: docId,
                        url: imageToUpdate,
                        path: `${COLLECTION}/logos/${docId}`,
                        type: imageType
                    })
                }
                data.logo = logoUrl;
            }
            const collectionDocRef = doc(firebaseClient, `${COLLECTION}`, `${docId}`);
            await updateDoc(collectionDocRef, await requestBodyComposer(data));
            return data;
        },
        data,
        "updateTenant"
    );
}

export const updateTenantsStoreslist = async (data) => {
    return await apiCallComposer(
        async () => {
            await setDoc(await getDocRef(data.tenantId), { "storesList": data.storesList }, { merge: true });
            return true
        },
        data,
        "updateTenantsStoreslist"
    );
}

// export const deleteTenantById = async (templateDetails: TenantDataType) => {
//     return await apiCallComposer(
//         async () => {
//             if (templateDetails.logo) {
//                 await deleteFileByUrl(templateDetails.logo);
//                 console.log("Tenant Logo Deleted")
//             }
//             const collectionDocRef = await getDocRef(templateDetails.id);
//             const templateDoc = await deleteDoc(collectionDocRef);
//             console.log("Tenant Deleted")
//             return ({ status: 200, data: true })
//         },
//         templateDetails, "deleteTemplateById"
//     );
// }