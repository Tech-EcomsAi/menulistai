import { DEFAULT_CRAFT_TEMPLATE_ID } from "@constant/craftBuilder";
import { AI_OPERATIONS_COLLECTIONS, DB_COLLECTIONS } from "@constant/database";
import { datePareserForClientSide, requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { TextSuggestionResponseType } from "@template/craftBuilder/types";
import { addDoc, collection, getDocs } from "firebase/firestore";

const COLLECTION = `${DB_COLLECTIONS.AI_OPERATIONS}/${AI_OPERATIONS_COLLECTIONS.TEXT_SUGGESTIONS}`;

const getCollectionRef = async (templateId: any) => {
    const session = await getActiveSession();
    const templateString = templateId == DEFAULT_CRAFT_TEMPLATE_ID ? "template" : "generic";//need to do this because firebase not allowed even number of path routing
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}/${session.uId}/${templateString}/${templateId}`)
}

export const addUserTextSugestionsTransaction = async (data: TextSuggestionResponseType, templateId: string) => {
    return await apiCallComposer(
        async () => {
            //add 
            const docRef = await addDoc(await getCollectionRef(templateId), await requestBodyComposer(data));
            console.log("Document written with ID: ", docRef.id);
            return docRef.id
        },
        data,
        templateId,
        "addUserTextSugestionsTransaction"
    );
}

export const getUserTemplateTextSuggestions = async (templateId: any) => {
    return await apiCallComposer(
        async () => {
            const querySnapshot = await getDocs(await getCollectionRef(templateId));
            if (querySnapshot.empty) {
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
        templateId,
        "getUserUploadedFiles"
    );
}