import { DB_COLLECTIONS } from "@constant/database";
import { collection, deleteDoc, doc, getDoc, getDocs, or, query, setDoc, where } from "@firebase/firestore";
import { requestBodyComposer } from "@lib/apiHelper";
import { apiCallComposer } from "@lib/apiHelper/apiCallComposer";
import getActiveSession from "@lib/auth/getActiveSession";
import { firebaseClient } from "@lib/firebase/firebaseClient";
import { addDoc } from "firebase/firestore";

const COLLECTION = DB_COLLECTIONS.TODOS;

interface TodoConfig {
    statuses: Array<{
        id: string;
        name: string;
        color: string;
    }>;
    tags: Array<{
        id: string;
        name: string;
        color: string;
    }>;
}

let session: any = null;

const getCollectionRef = async () => {
    session = Boolean(session) ? session : await getActiveSession()
    return collection(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`)
}

const getDocRef = async (docId: string) => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, docId)
}

const getTodoConfigDocRef = async () => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${DB_COLLECTIONS.TODOS_METADATA}/data/${session.tId}/${session.sId}`)
}

export const addTodo = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const submitData = await requestBodyComposer({ ...data, active: true, deleted: false });
            const docRef = await addDoc(await getCollectionRef(), submitData);
            return { ...submitData, id: docRef.id };
        },
        data,
        "addTodo"
    );
}

export const updateTodo = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const updateData = await requestBodyComposer(data);
            await setDoc(await getDocRef(data.id), updateData, { merge: true });
            return updateData;
        },
        data,
        "updateTodo"
    );
}

export const getTodoById = async (id: string) => {
    return await apiCallComposer(
        async () => {
            const docRef = await getDocRef(id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { ...docSnap.data(), id: docSnap.id };
            }
            return null;
        },
        id,
        "getTodoById"
    );
}

export const getAllTodos = async () => {
    return await apiCallComposer(
        async () => {
            const q = query(
                await getCollectionRef(), or(
                    where("uId", "==", session.uId),
                    where("assignee", "array-contains", session.uId)
                )
            );
            const querySnapshot = await getDocs(q);
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            return list;
        },
        "getAllTodos"
    );
}

export const getTodoConfig = async () => {
    return await apiCallComposer(
        async () => {
            const docSnap = await getDoc(await getTodoConfigDocRef());
            if (docSnap.exists()) {
                return docSnap.data() as TodoConfig;
            }
            return null;
        },
        null,
        "getTodoConfig"
    );
}

export const updateTodoConfig = async (data: Partial<TodoConfig>) => {
    return await apiCallComposer(
        async () => {
            await setDoc(await getTodoConfigDocRef(), data, { merge: true });
            return data;
        },
        data,
        "updateTodoConfig"
    );
}


export const deleteTodo = async (data: any) => {
    return await apiCallComposer(
        async () => {
            const docRef = await getDocRef(data.id);
            await deleteDoc(docRef);
            return null;
        },
        data,
        "deleteTodo"
    );
}

export const updateTodoStatuses = async (statuses: TodoConfig['statuses']) => {
    return await updateTodoConfig({ statuses });
}

export const getTodoTags = async () => {
    const config = await getTodoConfig();
    return config.tags;
}

export const updateTodoTags = async (tags: TodoConfig['tags']) => {
    return await updateTodoConfig({ tags });
}
