'use client'
import { setUserTimeFormat } from "@lib/localization";
import { APP_TIME_FORMAT_COOKIES_KEY, defaultTimeFormatString, TIME_FORMATS } from "@lib/localization/config";
import { getUTCDate } from "@util/dateTime";
import { Flex, Select, Typography } from "antd";
import { getCookie } from 'cookies-next';
import { useFormatter } from "next-intl";
import { useEffect, useState, useTransition } from "react";
const { Text } = Typography;

function TimeFormatSwitcher() {

    const [currentFormat, setCurrentFormat] = useState()
    const [isPending, startTransition] = useTransition();
    const format = useFormatter();
    const now = getUTCDate().newDate;

    useEffect(() => {
        //get cookie value
        let current: any = getCookie(APP_TIME_FORMAT_COOKIES_KEY);
        if (!current) {
            //if cookies not present then use defult value
            current = defaultTimeFormatString;
        }
        setCurrentFormat(current)
    }, [])

    const onChange = (value) => {
        startTransition(() => {
            setUserTimeFormat(value)
            setCurrentFormat(value);
        });
    }

    return (
        <Flex gap={10} vertical>
            <Text strong>Time Format</Text>
            <Select
                showSearch
                placeholder="Select a time format"
                optionFilterProp="label"
                loading={isPending}
                defaultValue={currentFormat}
                value={currentFormat}
                style={{ width: "100%" }}
                onChange={(value: any) => onChange(value)}
                optionLabelProp="label"
                options={TIME_FORMATS.map((t) => ({ label: `${format.dateTime(now, t.value)} (${t.labelHelper})`, value: t.label }))}
            />
            {/* 
                Value resulted by when we switch format then cookies updated then
                src/providers/localisationProvider.tsx updated in this file
            */}
            {/* <Text>({format.dateTime(now, "time")})</Text> */}
        </Flex>
    )
}

export default TimeFormatSwitcher