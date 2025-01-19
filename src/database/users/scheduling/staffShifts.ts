import { DB_COLLECTIONS } from '@constant/database';
import { OperationStats, logDatabaseOperation, logOperationResult } from '@database/loggers/databaseOperation';
import getActiveSession from '@lib/auth/getActiveSession';
import { firebaseClient } from '@lib/firebase/firebaseClient';
import { Break, RegularBreak, RegularShift, Shift, StaffShift, WeekDayBreak, WeekDayShift } from '@type/userShiftAndBreaks';
import dayjs from 'dayjs';
import {
    deleteDoc,
    deleteField,
    doc,
    getDoc,
    setDoc,
    writeBatch
} from 'firebase/firestore';

const COLLECTION = `${DB_COLLECTIONS.USERS_SCHEDULES}`;

// Firebase collection reference
let session = null;
const getDocRef = async (id: any) => {
    session = Boolean(session) ? session : await getActiveSession()
    return doc(firebaseClient, `${COLLECTION}/${session.tId}/${session.sId}`, id)
}

// Cache for date shifts to minimize reads
const shiftCache: { [date: string]: { [staffId: string]: StaffShift } } = {};

// Cache for dates to minimize reads
const datesCache: string[] = [];

// Helper to create cache key
const getCacheKey = (date: string) => date;

export const resetOperationStats = () => {
    operationStats = [];
    console.log('Operation stats reset');
};
let operationStats: OperationStats[] = [];

// Get shifts for a specific date
export const getShiftsByDate = async (date: string): Promise<StaffShift[]> => {
    logDatabaseOperation('READ', 'shiftData', { date });

    try {
        const cacheKey = getCacheKey(date);
        //if data alread in cache ND FETCHED FROM database
        if (shiftCache[cacheKey] && datesCache.includes(date)) {
            Object.keys(shiftCache[cacheKey]).forEach(staffId => {
                const staffShift = shiftCache[cacheKey][staffId]
                shiftCache[cacheKey][staffId] = {
                    ...staffShift,
                    staffId,
                    shifts: staffShift.shifts || [],
                    breaks: staffShift.breaks || [],
                    regularShifts: staffShift.regularShifts || []
                };
            });
            return Object.values(shiftCache[cacheKey]);
        }

        const docSnap = await getDoc(await getDocRef(date));
        datesCache.push(date);

        if (!docSnap.exists()) {
            shiftCache[cacheKey] = {};
            logOperationResult('getShiftsByDate', []);
            return [];
        }

        const dateShifts = docSnap.data() as { [staffId: string]: StaffShift };
        Object.keys(dateShifts).forEach(staffId => {
            dateShifts[staffId] = {
                ...dateShifts[staffId],
                staffId,
                shifts: dateShifts[staffId].shifts || [],
                breaks: dateShifts[staffId].breaks || [],
                regularShifts: dateShifts[staffId].regularShifts || []
            };
        });
        shiftCache[cacheKey] = dateShifts;
        return Object.values(shiftCache[cacheKey]);
    } catch (error) {
        logOperationResult('getShiftsByDate', null, error);
        throw error;
    }
};

// Update or create a shift
export const upsertShift = async (date: string, staffShift: StaffShift): Promise<void> => {
    logDatabaseOperation('WRITE', 'shiftData', { date, staffShift });

    try {
        const { staffId } = staffShift;
        console.log('Upserting shift:', { date, staffId });

        // Ensure breaks array exists
        staffShift.breaks = staffShift.breaks || [];

        // Update Firestore using merge
        await setDoc(await getDocRef(date), {
            [staffId]: staffShift
        }, { merge: true });

        // Update cache
        const cacheKey = getCacheKey(date);
        if (shiftCache[cacheKey]) {
            shiftCache[cacheKey][staffId] = staffShift;
        }
    } catch (error) {
        logOperationResult('upsertShift', null, error);
        throw error;
    }
};

// Delete a shift
export const deleteShift = async (staffId: string, date: string): Promise<void> => {
    logDatabaseOperation('DELETE', 'shiftData', { staffId, date });

    try {
        console.log('Deleting shift:', { staffId, date });

        // Update Firestore by removing the staff member's data
        await setDoc(await getDocRef(date), { [staffId]: deleteField() }, { merge: true });

        // Update cache
        const cacheKey = getCacheKey(date);
        if (shiftCache[cacheKey]) {
            delete shiftCache[cacheKey][staffId];
            // If no more shifts in cache for this date, remove the cache entry
            if (Object.keys(shiftCache[cacheKey]).length === 0) {
                delete shiftCache[cacheKey];
            }
        }
    } catch (error) {
        logOperationResult('deleteShift', null, error);
        throw error;
    }
};

// Check if staff is active for a specific date and time slot
export const isStaffActive = async (
    staffId: string,
    date: string,
    time: string
): Promise<boolean> => {
    const cacheKey = getCacheKey(date);

    // Try cache first
    let staffShift: StaffShift | undefined;
    if (shiftCache[cacheKey]) {
        staffShift = shiftCache[cacheKey][staffId];
    } else {
        const shifts = await getShiftsByDate(date);
        staffShift = shifts.find(shift => shift.staffId === staffId);
    }

    if (!staffShift) return false;

    const checkTime = dayjs(`2000-01-01 ${time}`);

    // Check if time falls within any shift
    for (const shift of staffShift.shifts) {
        const startTime = dayjs(`2000-01-01 ${shift.startTime}`);
        const endTime = dayjs(`2000-01-01 ${shift.endTime}`);

        if (checkTime.isBetween(startTime, endTime, null, '[]')) {
            // Check if time falls within any break
            for (const breakPeriod of staffShift.breaks || []) {
                const breakStart = dayjs(`2000-01-01 ${breakPeriod.startTime}`);
                const breakEnd = dayjs(`2000-01-01 ${breakPeriod.endTime}`);

                if (checkTime.isBetween(breakStart, breakEnd, null, '[]')) {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
};

// Helper function to get all dates between start and end date
export const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    let currentDate = dayjs(startDate);
    const lastDate = dayjs(endDate);

    while (currentDate.isSameOrBefore(lastDate)) {
        dates.push(currentDate.format('YYYY-MM-DD'));
        currentDate = currentDate.add(1, 'day');
    }

    return dates;
};

// Helper function to get week number (1-4) for a date
const getWeekNumberInMonth = (date: dayjs.Dayjs): number => {
    const firstDayOfMonth = date.startOf('month');
    const weekDiff = date.diff(firstDayOfMonth, 'week');
    return Math.min(Math.floor(weekDiff) + 1, 4);
};

// Update breaks for a staff member
export const updateBreaks = async (
    date: string,
    staffId: string,
    breaks: Break[]
): Promise<void> => {
    logDatabaseOperation('WRITE', 'shiftData', { date, staffId, breaks });

    try {
        const cacheKey = getCacheKey(date);
        const cachedData = shiftCache[cacheKey]?.[staffId];

        // Check if there are no shifts and breaks
        if (breaks.length === 0 && (!cachedData?.shifts || cachedData.shifts.length === 0)) {
            // Delete the staff document since there are no shifts or breaks
            await setDoc(await getDocRef(date), { [staffId]: deleteField() }, { merge: true });
        } else {
            // Update only the breaks array using merge
            await setDoc(await getDocRef(date), {
                [staffId]: {
                    breaks
                }
            }, { merge: true });
        }

        // Update cache
        if (shiftCache[cacheKey]) {
            shiftCache[cacheKey][staffId] = {
                ...shiftCache[cacheKey][staffId],
                breaks
            };
        }
    } catch (error) {
        logOperationResult('updateBreaks', null, error);
        throw error;
    }
};

// Update shifts for a staff member
export const updateShifts = async (
    date: string,
    staffId: string,
    shifts: Shift[]
): Promise<void> => {
    logDatabaseOperation('WRITE', 'shiftData', { date, staffId, shifts });

    try {
        const cacheKey = getCacheKey(date);

        // Initialize cache for this date if it doesn't exist
        if (!shiftCache[cacheKey]) {
            shiftCache[cacheKey] = {};
        }

        const cachedData = shiftCache[cacheKey][staffId];

        // If we have cached data, use it to check for breaks
        const hasBreaks = cachedData?.breaks && cachedData.breaks.length > 0;

        // Check if there are no shifts and breaks
        if (shifts.length === 0 && !hasBreaks) {
            // Delete the staff document since there are no shifts or breaks
            await setDoc(await getDocRef(date), { [staffId]: deleteField() }, { merge: true });

            // Clean up cache
            if (shiftCache[cacheKey]) {
                delete shiftCache[cacheKey][staffId];
                // If no more staff in cache for this date, remove the date entry
                if (Object.keys(shiftCache[cacheKey]).length === 0) {
                    delete shiftCache[cacheKey];
                }
            }
        } else {
            // If we have cached data, preserve other fields
            const updatedData = cachedData
                ? { ...cachedData, shifts }
                : { staffId, shifts, breaks: [] };

            // Update the document with merged data
            await setDoc(await getDocRef(date), {
                [staffId]: updatedData
            }, { merge: true });

            // Update cache
            shiftCache[cacheKey][staffId] = updatedData;
        }
    } catch (error) {
        logOperationResult('updateShifts', null, error);
        throw error;
    }
};

// Delete all shifts and breaks within a date range
export const deleteAllShiftsInRange = async (
    startDate: string,
    endDate: string
): Promise<void> => {
    logDatabaseOperation('DELETE_RANGE', 'shiftData', { startDate, endDate });

    try {
        // Get all dates between start and end date
        const dates = getDatesBetween(startDate, endDate);
        const batch = writeBatch(firebaseClient);

        // Add each date's document to the batch delete operation
        dates.forEach(async date => {
            batch.delete(await getDocRef(date));

            // Clear cache for this date
            const cacheKey = getCacheKey(date);
            if (shiftCache[cacheKey]) {
                delete shiftCache[cacheKey];
            }
        });

        // Commit the batch
        await batch.commit();
    } catch (error) {
        logOperationResult('deleteAllShiftsInRange', null, error);
        throw error;
    }
};

/**
 * Delete document for a specific date from the shifts collection
 * @param date string, date in 'YYYY-MM-DD' format
 */
export const deleteShiftsForDate = async (date: string): Promise<void> => {
    logDatabaseOperation('DELETE', 'shiftData', { date });

    try {
        await deleteDoc(await getDocRef(date));

        // Clear cache for this date
        const cacheKey = getCacheKey(date);
        if (shiftCache[cacheKey]) {
            delete shiftCache[cacheKey];
        }
    } catch (error) {
        logOperationResult('deleteShiftsForDate', null, error);
        throw error;
    }
};

//******regular shifts logic


// Set regular shifts for a staff member
export const setRegularShifts = async (
    staffId: string,
    regularShift: RegularShift
): Promise<void> => {
    logDatabaseOperation('WRITE', 'shiftData', { staffId, regularShift });

    try {
        // If endDate not provided, set it to 30 days from startDate
        const endDate = regularShift.endDate ||
            dayjs(regularShift.startDate).add(30, 'days').format('YYYY-MM-DD');

        // Get all dates between start and end
        const dates = getDatesBetween(regularShift.startDate, endDate);

        // Prepare batch operations
        const batches: any[] = [];
        let currentBatch = writeBatch(firebaseClient);
        let operationsCount = 0;

        for (const date of dates) {
            let shiftsForDate: WeekDayShift[] = [];

            if (regularShift.weekPattern) {
                // Get week number and day name for the date
                const currentDate = dayjs(date);
                const weekNumber = getWeekNumberInMonth(currentDate);
                const dayName = currentDate.format('dddd');

                // Get shifts from week pattern if they exist
                shiftsForDate = regularShift.weekPattern[weekNumber]?.[dayName] || [];
            } else if (regularShift.startTime && regularShift.endTime && regularShift.shiftType) {
                // Use simple pattern
                shiftsForDate = [{
                    startTime: regularShift.startTime,
                    endTime: regularShift.endTime,
                    shiftType: regularShift.shiftType
                }];
            }

            // Only create document if there are shifts for this date
            if (shiftsForDate.length > 0) {
                const data = {
                    [staffId]: {
                        regularShifts: [{
                            ...regularShift,
                            shifts: shiftsForDate
                        }]
                    }
                };

                currentBatch.set(await getDocRef(date), data, { merge: true });
                operationsCount++;
            }

            // Firestore batches are limited to 500 operations
            if (operationsCount === 500) {
                batches.push(currentBatch);
                currentBatch = writeBatch(firebaseClient);
                operationsCount = 0;
            }
        }

        // Add the last batch if it has operations
        if (operationsCount > 0) {
            batches.push(currentBatch);
        }

        // Commit all batches
        await Promise.all(batches.map(batch => batch.commit()));
    } catch (error) {
        logOperationResult('setRegularShifts', null, error);
        throw error;
    }
};

// Update regular shifts for a staff member
export const updateRegularShifts = async (staffId: string, regularShift: RegularShift): Promise<void> => {
    try {
        const endDate = regularShift.endDate ||
            dayjs(regularShift.startDate).add(30, 'days').format('YYYY-MM-DD');
        const dates = getDatesBetween(regularShift.startDate, endDate);

        const batches: any[] = [];
        let currentBatch = writeBatch(firebaseClient);
        let operationsCount = 0;

        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            const data = {
                [staffId]: { regularShifts: [regularShift] }
            };

            currentBatch.set(await getDocRef(date), data, { merge: true });
            operationsCount++;

            if (operationsCount === 500) {
                batches.push(currentBatch);
                currentBatch = writeBatch(firebaseClient);
                operationsCount = 0;
            }
        }

        if (operationsCount > 0) {
            batches.push(currentBatch);
        }

        await Promise.all(batches.map(batch => batch.commit()));

        // Update the cache for all affected dates
        for (const date of dates) {
            const cacheKey = getCacheKey(date);
            const existingCache = shiftCache[cacheKey] || {};
            shiftCache[cacheKey] = {
                ...existingCache,
                [staffId]: {
                    ...existingCache[staffId],
                    regularShifts: [regularShift],
                    staffId
                }
            };
        }
    } catch (error) {
        console.error('Error updating regular shifts:', error);
        throw error;
    }
};

// Delete regular shift for a staff member
export const deleteRegularShift = async (
    staffId: string,
    regularShift: RegularShift,
    selectedDate: string,
    deleteAll: boolean = false
): Promise<void> => {
    try {
        // First get the regular shift details to determine date range

        if (!regularShift) {
            console.warn('No regular shift found to delete');
            return;
        }

        if (deleteAll) {
            // Delete for all dates between start and end date of the regular shift
            const endDate = regularShift.endDate ||
                dayjs(regularShift.startDate).add(30, 'days').format('YYYY-MM-DD');
            const dates = getDatesBetween(regularShift.startDate, endDate);

            const batches: any[] = [];
            let currentBatch = writeBatch(firebaseClient);
            let operationsCount = 0;

            for (const date of dates) {
                currentBatch.set(await getDocRef(date), { [staffId]: { regularShifts: [] } }, { merge: true });
                operationsCount++;

                if (operationsCount === 500) {
                    batches.push(currentBatch);
                    currentBatch = writeBatch(firebaseClient);
                    operationsCount = 0;
                }
            }

            if (operationsCount > 0) {
                batches.push(currentBatch);
            }

            await Promise.all(batches.map(batch => batch.commit()));

            // Update cache for all affected dates
            for (const date of dates) {
                let cacheKey = getCacheKey(date);
                const existingCache = shiftCache[cacheKey];
                if (existingCache && existingCache[staffId]) {
                    shiftCache[cacheKey] = {
                        ...existingCache,
                        [staffId]: {
                            ...existingCache[staffId],
                            regularShifts: [],
                            staffId
                        }
                    };
                }
            }
        } else {
            // Delete only for the selected date

            await setDoc(await getDocRef(selectedDate), { [staffId]: { regularShifts: [] } }, { merge: true });

            // Update cache for the selected date
            const cacheKey = getCacheKey(selectedDate);
            const existingCache = shiftCache[cacheKey];
            if (existingCache && existingCache[staffId]) {
                shiftCache[cacheKey] = {
                    ...existingCache,
                    [staffId]: {
                        ...existingCache[staffId],
                        regularShifts: [],
                        staffId
                    }
                };
            }
        }
    } catch (error) {
        console.error('Error deleting regular shift:', error);
        throw error;
    }
};


//******regular breaks logic

// Set regular breaks for a staff member
export const setRegularBreaks = async (
    staffId: string,
    regularBreak: RegularBreak
): Promise<void> => {
    logDatabaseOperation('WRITE', 'shiftData', { staffId, regularBreak });

    try {
        // If endDate not provided, set it to 30 days from startDate
        const endDate = regularBreak.endDate ||
            dayjs(regularBreak.startDate).add(30, 'days').format('YYYY-MM-DD');

        // Get all dates between start and end
        const dates = getDatesBetween(regularBreak.startDate, endDate);

        // Prepare batch operations
        const batches: any[] = [];
        let currentBatch = writeBatch(firebaseClient);
        let operationsCount = 0;

        for (const date of dates) {
            let breaksForDate: WeekDayBreak[] = [];

            if (regularBreak.weekPattern) {
                // Get week number and day name for the date
                const currentDate = dayjs(date);
                const weekNumber = getWeekNumberInMonth(currentDate);
                const dayName = currentDate.format('dddd');

                // Get shifts from week pattern if they exist
                breaksForDate = regularBreak.weekPattern[weekNumber]?.[dayName] || [];
            } else if (regularBreak.startTime && regularBreak.endTime && regularBreak.breakType) {
                // Use simple pattern
                breaksForDate = [{
                    startTime: regularBreak.startTime,
                    endTime: regularBreak.endTime,
                    breakType: regularBreak.breakType
                }];
            }

            // Only create document if there are shifts for this date
            if (breaksForDate.length > 0) {
                const data = {
                    [staffId]: {
                        regularBreaks: [{
                            ...regularBreak,
                            breaks: breaksForDate
                        }]
                    }
                };

                currentBatch.set(await getDocRef(date), data, { merge: true });
                operationsCount++;
            }

            // Firestore batches are limited to 500 operations
            if (operationsCount === 500) {
                batches.push(currentBatch);
                currentBatch = writeBatch(firebaseClient);
                operationsCount = 0;
            }
        }

        // Add the last batch if it has operations
        if (operationsCount > 0) {
            batches.push(currentBatch);
        }

        // Commit all batches
        await Promise.all(batches.map(batch => batch.commit()));
    } catch (error) {
        logOperationResult('setRegularBreaks', null, error);
        throw error;
    }
};

// Update regular breaks for a staff member
export const updateRegularBreaks = async (staffId: string, regularBreak: RegularBreak): Promise<void> => {
    try {
        const endDate = regularBreak.endDate ||
            dayjs(regularBreak.startDate).add(30, 'days').format('YYYY-MM-DD');
        const dates = getDatesBetween(regularBreak.startDate, endDate);

        const batches: any[] = [];
        let currentBatch = writeBatch(firebaseClient);
        let operationsCount = 0;

        for (let i = 0; i < dates.length; i++) {
            const date = dates[i];
            const data = {
                [staffId]: { regularBreaks: [regularBreak] }
            };

            currentBatch.set(await getDocRef(date), data, { merge: true });
            operationsCount++;

            if (operationsCount === 500) {
                batches.push(currentBatch);
                currentBatch = writeBatch(firebaseClient);
                operationsCount = 0;
            }
        }

        if (operationsCount > 0) {
            batches.push(currentBatch);
        }

        await Promise.all(batches.map(batch => batch.commit()));

        // Update the cache for all affected dates
        for (const date of dates) {
            const cacheKey = getCacheKey(date);
            const existingCache = shiftCache[cacheKey] || {};
            shiftCache[cacheKey] = {
                ...existingCache,
                [staffId]: {
                    ...existingCache[staffId],
                    regularBreaks: [regularBreak],
                    staffId
                }
            };
        }
    } catch (error) {
        console.error('Error updating regular breaks:', error);
        throw error;
    }
};

// Delete regular shift for a staff member
export const deleteRegularBreak = async (
    staffId: string,
    regularBreak: RegularBreak,
    selectedDate: string,
    deleteAll: boolean = false
): Promise<void> => {
    try {
        // First get the regular shift details to determine date range

        if (!regularBreak) {
            console.warn('No regular break found to delete');
            return;
        }

        if (deleteAll) {
            // Delete for all dates between start and end date of the regular shift
            const endDate = regularBreak.endDate ||
                dayjs(regularBreak.startDate).add(30, 'days').format('YYYY-MM-DD');
            const dates = getDatesBetween(regularBreak.startDate, endDate);

            const batches: any[] = [];
            let currentBatch = writeBatch(firebaseClient);
            let operationsCount = 0;

            for (const date of dates) {
                currentBatch.set(await getDocRef(date), { [staffId]: { regularBreaks: [] } }, { merge: true });
                operationsCount++;

                if (operationsCount === 500) {
                    batches.push(currentBatch);
                    currentBatch = writeBatch(firebaseClient);
                    operationsCount = 0;
                }
            }

            if (operationsCount > 0) {
                batches.push(currentBatch);
            }

            await Promise.all(batches.map(batch => batch.commit()));

            // Update cache for all affected dates
            for (const date of dates) {
                let cacheKey = getCacheKey(date);
                const existingCache = shiftCache[cacheKey];
                if (existingCache && existingCache[staffId]) {
                    shiftCache[cacheKey] = {
                        ...existingCache,
                        [staffId]: {
                            ...existingCache[staffId],
                            regularBreaks: [],
                            staffId
                        }
                    };
                }
            }
        } else {
            // Delete only for the selected date
            await setDoc(await getDocRef(selectedDate), { [staffId]: { regularBreaks: [] } }, { merge: true });

            // Update cache for the selected date
            const cacheKey = getCacheKey(selectedDate);
            const existingCache = shiftCache[cacheKey];
            if (existingCache && existingCache[staffId]) {
                shiftCache[cacheKey] = {
                    ...existingCache,
                    [staffId]: {
                        ...existingCache[staffId],
                        regularBreaks: [],
                        staffId
                    }
                };
            }
        }
    } catch (error) {
        console.error('Error deleting regular break:', error);
        throw error;
    }
};