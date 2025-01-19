import { ECOMSAI_PLATFORM_STORE_ID, ECOMSAI_PLATFORM_TENANT_ID, ECOMSAI_PLATFORM_USER_ID, ECOMSAI_PLATFORM_USER_NAME, ECOMSAI_PLATFORM_USER_ROLE } from "@constant/user";
import getActiveSession from "@lib/auth/getActiveSession";
import { getUTCDate } from "@util/dateTime";
import { toDate } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz"; // Import from date-fns-tz
import { Timestamp } from "firebase/firestore";

//  Rename utcToZonedTime to toZonedTime to make it less confusing(comments welcome!)
//  Rename zonedTimeToUtc to fromZonedTime to make it less confusing(comments welcome!)

function replaceUndefined(obj) {
    // If the input is an array, loop through each element
    if (Array.isArray(obj)) {
        return obj.map(replaceUndefined);
    } else if (obj !== null && typeof obj === 'object') {
        // If the input is an object, loop through each key
        return Object.keys(obj).reduce((acc, key) => {
            acc[key] = replaceUndefined(obj[key]);
            return acc;
        }, {});
    } else if (obj === undefined) {
        // Replace undefined with an empty string
        return "";
    } else {
        // For other types (number, string, boolean, etc.), return the value as is
        return obj;
    }
}


export const requestBodyComposer = async (data: any) => {
    const now = getUTCDate().dateString
    const session = await getActiveSession()
    const dataCopy = {
        ...data,
        sId: (session?.sId == 0 || session?.sId) ? session?.sId : ECOMSAI_PLATFORM_STORE_ID,
        tId: (session?.tId == 0 || session?.tId) ? session?.tId : ECOMSAI_PLATFORM_TENANT_ID,
        role: session?.role || ECOMSAI_PLATFORM_USER_ROLE,
        uId: session?.uId || ECOMSAI_PLATFORM_USER_ID,
        modifiedOn: now,
        modifiedBy: session?.user?.name || ECOMSAI_PLATFORM_USER_NAME,
    }
    if (data && !data.id) {
        dataCopy.createdOn = now
        dataCopy.createdBy = session?.user?.name || ECOMSAI_PLATFORM_USER_NAME
    }
    console.log("bodddyyy", dataCopy)
    return replaceUndefined(dataCopy)
}

function convertNestedDates(obj, path = "") {

    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
        const newPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (value instanceof Timestamp) {
            const dateObject = toDate(value.seconds * 1000);
            const zonedDate = toZonedTime(dateObject, "Asia/Kolkata"); // Convert to IST
            obj[key] = formatInTimeZone(zonedDate, "Asia/Kolkata", "yyyy-MM-dd"); // Format in IST
        } else if (typeof value === "object") {
            convertNestedDates(value, newPath);
        }
    }
    return obj;
}

function revertNestedDates(obj, path = "") {
    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
        const newPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if ('seconds' in value && "nanoseconds" in value) {
            const firebaseTimestamp = Timestamp.fromMillis(value.seconds * 1000 + value.nanoseconds / 1000000);
            obj[key] = firebaseTimestamp
        } else if (typeof value === "object") {
            convertNestedDates(value, newPath);
        }
    }
}

export const datePareserForFirebaseDate = (data) => {
    return revertNestedDates(data)
}

export const datePareserForClientSide = (data) => {
    return convertNestedDates(data)
}