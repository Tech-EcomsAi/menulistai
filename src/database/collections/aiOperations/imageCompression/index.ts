import { AI_OPERATIONS_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { UploadedImageFileDatatype } from "@template/craftBuilder/types";
import { addDoc, collection } from "firebase/firestore";

const COLLECTION = `${DB_COLLECTIONS.AI_OPERATIONS}/${AI_OPERATIONS_COLLECTIONS.IMAGE_COMPRESSION}`;

const getCollectionRef = async () => {
    const session = await getActiveSession();
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}/${session.uId}`)
}

export const addUserImageCompressionTransaction = async (fileDetails: UploadedImageFileDatatype) => {
    return await apiCallComposer(
        async () => {
            //add 
            delete fileDetails.base64Url;
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer(fileDetails));
            console.log("Document written with ID: ", docRef.id);
            return docRef.id
        },
        fileDetails,
        "addUserImageCompressionTransaction"
    );
}