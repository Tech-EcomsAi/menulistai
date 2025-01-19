'use server';

import { cookies } from 'next/headers';
import { APP_DATE_FORMAT_COOKIES_KEY, APP_LOCALE_COOKIES_KEY, APP_TIME_FORMAT_COOKIES_KEY, APP_TIMEZONE_COOKIES_KEY, defaultDateFormat, defaultLocale, defaultTimeFormat, Locale } from './config';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.

export async function getUserLocale() {
    return cookies().get(APP_LOCALE_COOKIES_KEY)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    cookies().set(APP_LOCALE_COOKIES_KEY, locale);
}

export async function setUserTimezone(timeZone: string) {
    cookies().set(APP_TIMEZONE_COOKIES_KEY, timeZone);
}

export async function setUserDateFormat(format: any) {
    cookies().set(APP_DATE_FORMAT_COOKIES_KEY, format);
}

export async function setUserTimeFormat(format: any) {
    cookies().set(APP_TIME_FORMAT_COOKIES_KEY, format);
}

export async function getUserDateFormat() {
    const userFormatFromCookies = cookies().get(APP_DATE_FORMAT_COOKIES_KEY)?.value || '';
    if (userFormatFromCookies) {
        const [day, month, year] = userFormatFromCookies.split("|");
        return { day, month, year }
    } else return defaultDateFormat
}

export async function getUserTimeFormat() {
    const userFormatFromCookies = cookies().get(APP_TIME_FORMAT_COOKIES_KEY)?.value || '';
    if (userFormatFromCookies) {
        const [hour, minute, hour12] = userFormatFromCookies.split("|");
        return { hour, minute, hour12: Boolean(hour12.includes('true')) }
    } else return defaultTimeFormat
}