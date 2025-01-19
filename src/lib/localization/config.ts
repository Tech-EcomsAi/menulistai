import { APP_LANGUAGES } from "@constant/common";
import { DateTimeFormatOptions } from "next-intl";

export const APP_LOCALE_COOKIES_KEY = `e-locale`
export const APP_TIMEZONE_COOKIES_KEY = `e-timezone`
export const APP_DATE_FORMAT_COOKIES_KEY = `e-date-format`;
export const APP_TIME_FORMAT_COOKIES_KEY = `e-time-format`;

export type Locale = (typeof AppSupportedLocales)[number];
export const AppSupportedLocales = APP_LANGUAGES.map(l => l.value);
export const defaultLocale: Locale = 'en-US';
export const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const defaultDateFormat = {
    day: Intl.DateTimeFormat().resolvedOptions().day as any,
    month: Intl.DateTimeFormat().resolvedOptions().month as any,
    year: Intl.DateTimeFormat().resolvedOptions().year as any
}
export const defaultDateFormatString = `${Intl.DateTimeFormat().resolvedOptions().day}|${Intl.DateTimeFormat().resolvedOptions().month}|${Intl.DateTimeFormat().resolvedOptions().year}`

export const defaultTimeFormat: any = { hour: "2-digit", minute: "2-digit", hour12: true }
export const defaultTimeFormatString = `2-digit|2-digit|true`;

type DATE_TIME_FORMATS_TYPE = { label: string; value: DateTimeFormatOptions }

export const DATE_FORMATS: DATE_TIME_FORMATS_TYPE[] = [
    { label: "numeric|numeric|numeric", value: { day: 'numeric', month: 'numeric', year: 'numeric' } },
    { label: "numeric|numeric|2-digit", value: { day: 'numeric', month: 'numeric', year: '2-digit' } },
    { label: "2-digit|2-digit|numeric", value: { day: '2-digit', month: '2-digit', year: 'numeric' } },
    { label: "2-digit|short|numeric", value: { day: '2-digit', month: 'short', year: 'numeric' } },
    { label: "2-digit|short|2-digit", value: { day: '2-digit', month: 'short', year: '2-digit' } },
    { label: "2-digit|long|numeric", value: { day: '2-digit', month: 'long', year: 'numeric' } },
    { label: "2-digit|long|2-digit", value: { day: '2-digit', month: 'long', year: '2-digit' } },
]

export const TIME_FORMATS: any[] = [
    { labelHelper: "12 Hr format", label: "numeric|numeric|true", value: { hour: 'numeric', minute: 'numeric', hour12: true } },
    { labelHelper: "12 Hr format", label: "2-digit|2-digit|true", value: { hour: '2-digit', minute: '2-digit', hour12: true } },
    { labelHelper: "24 Hr format", label: "numeric|numeric|false", value: { hour: 'numeric', minute: 'numeric', hour12: false } },
    { labelHelper: "24 Hr format", label: "2-digit|2-digit|false", value: { hour: '2-digit', minute: '2-digit', hour12: false } },
]