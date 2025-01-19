import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import dayjs from 'dayjs';

const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Kolkata",
};

export const getUTCDate = (d: Date = new Date()) => {
    const date = d || new Date();
    const currentTimeZone = "Asia/Kolkata";
    const utcDate = fromZonedTime(date, currentTimeZone)
    return {
        dateString: utcDate.toISOString(),
        newDate: utcDate
    }
}

export const getFormatedDateAndTime = (formatter, date: Date) => {
    const dateToFormat = date || getUTCDate().newDate
    return formatter.dateTime(dateToFormat,
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: "2-digit"
        })
}

export const getFormatedDate = (formatter, date: any) => {

    // const dateToFormat = date || getUTCDate().newDate
    if (!date) return null
    if (typeof date === 'string') return formatter.dateTime(dayjs(date).toDate(), "date");
    if (date instanceof Date) return formatter.dateTime(date, "date");
    return null;

}

export const getFormatedTime = (formatter, date: Date) => {
    if (!date) return null
    if (typeof date === 'string') return formatter.dateTime(dayjs(date).toDate(), "time");
    if (date instanceof Date) return formatter.dateTime(date, "time");
    return null;
}

export const formatInTimezone = (d: Date = new Date()) => {

    const date = d || new Date();
    const currentTimeZone = "Asia/Kolkata";
    const utcDate = fromZonedTime(date, currentTimeZone)
    const pattern = 'yyyy-MM-dd HH:mm:ssXXX';
    const timezone = "Europe/Berlin";

    return formatInTimeZone(utcDate, (timezone || currentTimeZone), pattern)
}

export const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push({
                label: timeString,
                value: timeString
            });
        }
    }
    return slots;
};