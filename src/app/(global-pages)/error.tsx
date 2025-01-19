'use client' // Error components must be Client Components
import { addErrorLog } from "@database/loggers/errorLogger";
import { clearBrowserCache, isProduction } from "@util/utils";
import { Button, Flex, Result, Tooltip, Typography } from "antd";
import { useEffect } from 'react';
import { LuMessageCircle, LuRefreshCcw, LuRotateCw } from "react-icons/lu";
import logger from "src/loggers";
const { Text } = Typography

const enableDatabaseLogging = isProduction();

const EmptyErrorState = {
    type: "",
    name: "",
    message: "",
    cause: "",
    stack: "",
    location: "",
}

export default function Error({ error, reset }: {
    error: Error & { digest?: string }, reset: () => void
}) {

    useEffect(() => {

        // Log the error to an error reporting service

        const payload = {
            ...EmptyErrorState,
            userAgent: window?.navigator?.userAgent || "",
            type: "error",
            message: error?.message,
            cause: error?.cause,
            name: error?.name,
            stack: error?.stack,
            location: window?.location?.href
        }
        if (enableDatabaseLogging) {
            //log error when running in production
            addErrorLog(payload).then((docId: any) => logger.error("error log", { docId }))
        }

    }, [error])

    return (
        <Flex vertical justify="center" align="center" style={{ width: "100vw", height: "calc(100vh - 72px)" }}>
            <Result
                status="500"
                title="Oops! Something went wrong."
                subTitle={<Flex vertical justify="center" align="center">
                    <Text>{`We're sorry, the app has encountered an error. We're working on a fix and apologize for any inconvenience.`}</Text>
                    <Text strong>Please try refreshing the app. If the issue persists, click here</Text>
                    <Button type="link" icon={<LuRefreshCcw />} onClick={() => clearBrowserCache(true)}>Reload Page</Button>
                </Flex>}
            />
            <Flex gap={10}>
                <Button type="default" icon={<LuMessageCircle />} onClick={() => reset()}>Contact Us</Button>
                <Tooltip title="You won't lose your current context in case of a refresh!">
                    <Button type="primary" icon={<LuRotateCw />} onClick={() => reset()}>Refresh</Button>
                </Tooltip>
            </Flex>
        </Flex>
    )
}