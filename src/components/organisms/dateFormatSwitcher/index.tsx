'use client'
import { setUserDateFormat } from "@lib/localization";
import { APP_DATE_FORMAT_COOKIES_KEY, DATE_FORMATS, defaultDateFormatString } from "@lib/localization/config";
import { getUTCDate } from "@util/dateTime";
import { Flex, Select, Typography } from "antd";
import { getCookie } from 'cookies-next';
import { useFormatter } from "next-intl";
import { useEffect, useState, useTransition } from "react";

const { Text } = Typography;

function DateFormatSwitcher() {

    const [currentFormat, setCurrentFormat] = useState()
    const [isPending, startTransition] = useTransition();
    const format = useFormatter();
    const [availableDateFormats, setAvailableDateFormats] = useState(DATE_FORMATS);
    const now = getUTCDate().newDate;

    useEffect(() => {
        //get cookie value
        let current: any = getCookie(APP_DATE_FORMAT_COOKIES_KEY);
        if (!current) {
            //if cookies not present then use defult value
            current = defaultDateFormatString;
        }

        // local format
        let isPresent = availableDateFormats.find(t => t.label == current);
        if (!Boolean(isPresent)) {
            const [day, month, year] = current.split("|");
            setAvailableDateFormats([{ label: current, value: { day, month, year } }, ...DATE_FORMATS])
        }
        setCurrentFormat(current)
    }, [])

    const onChange = (value) => {
        startTransition(() => {
            setUserDateFormat(value)
            setCurrentFormat(value);
        });
    }

    return (
        <Flex gap={10} vertical>
            <Text strong>Date Format</Text>
            <Select
                showSearch
                placeholder="Select a date format"
                optionFilterProp="label"
                loading={isPending}
                defaultValue={currentFormat}
                value={currentFormat}
                style={{ width: 130 }}
                onChange={(value: any) => onChange(value)}
                optionLabelProp="label"
                options={availableDateFormats.map((t) => ({ label: format.dateTime(now, t.value), value: t.label }))}
            />
            {/* 
                Value resulted by when we switch format then cookies updated then
                src/providers/localisationProvider.tsx updated in this file
            */}
            {/* <Text>({format.dateTime(new Date(), "date")})</Text> */}
        </Flex>
    )
}

export default DateFormatSwitcher;