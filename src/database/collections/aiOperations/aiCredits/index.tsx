import { AI_OPERATIONS_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { AiCreditTransactionType } from "@template/craftBuilder/types";
import { addDoc, collection } from "firebase/firestore";

const COLLECTION = `${DB_COLLECTIONS.AI_OPERATIONS}/${AI_OPERATIONS_COLLECTIONS.AI_CREDIT_TRANSACTIONS}`;

const getCollectionRef = async () => {
    const session = await getActiveSession();
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}/${session.uId}`)
}

export const addUserAiCreditTransaction = async (transactionDetails: AiCreditTransactionType, transactionType: string) => {//transactionType = ai operation type
    return await apiCallComposer(
        async () => {
            //add 
            delete transactionDetails.base64Url;
            const docRef = await addDoc(await getCollectionRef(), await requestBodyComposer({ ...transactionDetails, transactionType }));
            console.log("Document written with ID: ", docRef.id);
            return docRef.id
        },
        transactionDetails,
        transactionType,
        "addUserAiCreditTransaction"
    );
}