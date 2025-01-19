import { CRAFT_BUILDER_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { BrandKitType } from "@template/craftBuilder/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

const COLLECTION = `${DB_COLLECTIONS.CRAFT_BUILDER}/${CRAFT_BUILDER_COLLECTIONS.BRAND_KIT}`;

const getDocRef = async () => {
    const session = await getActiveSession();
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

export const updateBrandKit = async (type, value) => {
    return await apiCallComposer(
        async () => {
            const docRef = await setDoc(await getDocRef(), { [type]: value }, { merge: true });
            return true
        },
        type, value, "updateBrandKit"
    );
}

export const getBrandKit = async () => {
    return await apiCallComposer(
        async () => {
            const querySnapshot: any = await getDoc(await getDocRef());
            let brandKitData: BrandKitType = null;
            if (querySnapshot.exists()) {
                brandKitData = querySnapshot.data()
            }
            return (brandKitData);
        },
        "getBrandKit"
    );
}