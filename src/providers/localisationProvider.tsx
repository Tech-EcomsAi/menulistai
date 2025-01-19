import { getUserDateFormat, getUserTimeFormat } from '@lib/localization';
import { Formats, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

type Props = {
    children: React.ReactNode;
}

export default async function LocalisationProvider({ children }: Props) {
    // Providing all messages to the client side is the easiest way to get started
    const messages = await getMessages();

    const APP_LOCALISATION_FORMATTERS: Formats = {
        dateTime: {
            // date: {day: '2-digit',month: 'short',year: 'numeric'}
            date: await getUserDateFormat(),
            time: await getUserTimeFormat()
        },
        number: {
            amount: {
                maximumFractionDigits: 5,
                style: "currency",// "currency" | "unit" | "decimal" | "percent"
                currency: 'INR'
            },
            precise: {
                maximumFractionDigits: 5
            }
        },
        list: undefined
    }
    return (
        <NextIntlClientProvider
            formats={APP_LOCALISATION_FORMATTERS}
            messages={messages}
        >
            {children}
        </NextIntlClientProvider>
    )
}