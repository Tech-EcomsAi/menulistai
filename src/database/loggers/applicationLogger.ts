import { DB_COLLECTIONS } from "@constant/database";
import { requestBodyComposer } from "@lib/apiHelper";
import { firebaseDatabase } from "@lib/firebase/firebaseClient";
import { child, get, onValue, ref, set } from "firebase/database";

const COLLECTION = DB_COLLECTIONS.APPLICATION_LOGS;

const getCollectionRef = (logId) => {
    return ref(firebaseDatabase, `${COLLECTION}/${logId}`)
}

const getDocRef = (docId) => {
    return ref(firebaseDatabase, `${COLLECTION}/${docId}`)
}

export const addApplicationLog = (logDetails) => {
    return new Promise(async (res, rej) => {
        const logId = new Date().getTime();
        set(getCollectionRef(logId), await requestBodyComposer(logDetails)).then((docRef: any) => {
            res(logId)
        }).catch((err) => {
            console.log("err"), err
        })
    })
}

export const getRealtimeApplicationLogs = (filters: any) => {
    return new Promise((res, rej) => {
        const starCountRef = ref(firebaseDatabase, COLLECTION);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            res(data);
        });
    })
}
// Read data once with get()
export const getApplicationLog = (filters: any) => {
    return new Promise(async (res, rej) => {
        get(child(ref(firebaseDatabase), COLLECTION)).then((snapshot) => {
            if (snapshot.exists()) {
                res(snapshot.val())
            } else {
                res(null)
            }
        }).catch((error) => {
            res(null)
            console.error(error);
        });


    })
}

export const updateApplicationLog = (logDetails) => {
    return new Promise(async (res, rej) => {
        const response = await set(getDocRef(logDetails.id), await requestBodyComposer(logDetails))
        res(response)
    })
}

export const getApplicationLogById = (logId) => {
    return new Promise(async (res, rej) => {
        get(child(ref(firebaseDatabase), `${COLLECTION}/${logId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                res({ ...(snapshot.val()), logId })
            } else {
                res(null)
            }
        }).catch((error) => {
            console.error(error);
        });
    })
}


export const deleteApplicationLog = (logId) => {
    return new Promise(async (res, rej) => {
        const response = await set(getDocRef(logId), null)
        res(response)
    })
}
