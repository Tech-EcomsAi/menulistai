import { SUCCESS_RESPONSE } from "@constant/common";
import { CRAFT_BUILDER_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { deleteFileByUrl } from "@database/storage/deleteFromStorage";
import uploadBase64ToStorage from "@database/storage/uploadBase64ToStorage";
import { datePareserForClientSide, requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { UploadedImageFileDatatype } from "@template/craftBuilder/types";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

// updateDoc : update specific keys
// setDoc : Override doc if id present else create new doc
// adddDoc : Create new doc

//referances
// https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
//
const COLLECTION = `${DB_COLLECTIONS.COMMON}/${CRAFT_BUILDER_COLLECTIONS.USERUPLOADED}`;

const getDocRef = async (docId: any) => {
    const session = await getActiveSession();
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}/${session.uId}`, docId)
}

const getCollectionRef = async () => {
    const session = await getActiveSession();
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}/${session.uId}`)
}

//isBGR == is background remove
export const addUserUploadedFile = async (fileDetails: UploadedImageFileDatatype, type: any) => {
    return await apiCallComposer(
        async () => {
            //add 
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer({ ...fileDetails, base64Url: "", type }));//create fresh document with basic data
            const userTxnId = docRef.id
            const id = new Date().getTime()
            const uploadedUrl = await uploadBase64ToStorage({
                fileId: userTxnId,
                url: fileDetails.base64Url,
                path: `${COLLECTION}/${type}/${id}`,///common/userUploaded/Image_Generation/DsasiBnJglkorx9GgcxY
                type: "jpeg"
            })
            const collectionDocRef = await getDocRef(userTxnId);
            await updateDoc(collectionDocRef, { uploadedUrl });//update created document (line 34) with uploadedUrl
            console.log("Document written with ID: ", userTxnId);
            return { userTxnId, uploadedUrl }
        },
        fileDetails,
        type,
        "addUserUploadedFile"
    );
}

export const getUserUploadedFiles = async () => {
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
                    const fileData = datePareserForClientSide(doc.data())
                    list.push({ ...fileData, id: doc.id })
                });
                return (list)
            }
        },
        "getUserUploadedFiles"
    );
}

export const deletUploadedFileTxn = async (userTxnId, src = "") => {
    return await apiCallComposer(
        async () => {
            if (src) {
                await deleteFileByUrl(src);
            }
            const collectionDocRef = await getDocRef(userTxnId);
            await deleteDoc(collectionDocRef);
            return SUCCESS_RESPONSE
        },
        userTxnId, src, "deletUploadedFileTxn"
    );
}