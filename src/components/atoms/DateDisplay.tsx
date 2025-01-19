import { getFormatedDate } from '@util/dateTime';
import { Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useFormatter } from 'next-intl';
import React from 'react';

const { Text } = Typography;

interface DateDisplayProps {
    date?: string | Date;
    label?: string;
    showLabel?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({
    date,
    label,
    showLabel = true
}) => {
    const formatter = useFormatter();

    if (!date) return null;

    return (
        <Space>
            {showLabel && label && <Text type="secondary">{label}:</Text>}
            <Text type="secondary">{getFormatedDate(formatter, dayjs(date).toDate())}</Text>
        </Space>
    );
};

export default DateDisplay;
