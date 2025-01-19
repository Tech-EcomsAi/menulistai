"use client";
import { useAppSelector } from "@hook/useAppSelector";
import { getDarkColorState, getDarkModeState, getLightColorState, getRTLDirectionState } from '@reduxSlices/clientThemeConfig';
import { ConfigProvider, theme } from "antd";
import en_US from 'antd/locale/en_US';
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { poppinsFont } from "src/fonts/poppins";
import antdComponentTheme from "./componentTheme";

const AntdClient = ({ children, removeComponent }: any) => {
    const isDarkMode = useAppSelector(getDarkModeState)
    const lightThemeColor = useAppSelector(getLightColorState)
    const darkThemeColor = useAppSelector(getDarkColorState)
    const isRTLDirection = useAppSelector(getRTLDirectionState)
    const { token } = theme.useToken();
    const appLocale = useLocale();
    const [antdLocale, setAntdLocale] = useState(en_US)

    const getAntdLocale = async (locale) => {
        locale = locale.replace("-", "_");
        const antdLocale = await import(`antd/locale/${locale}`);
        if (antdLocale) setAntdLocale(antdLocale);
    }

    useEffect(() => {
        if (appLocale) getAntdLocale(appLocale)
    }, [appLocale])

    return (
        <>
            <ConfigProvider
                direction={isRTLDirection ? "rtl" : "ltr"}
                locale={antdLocale}
                theme={{
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: isDarkMode ? darkThemeColor : lightThemeColor,
                        borderRadius: 5,
                        wireframe: false,
                        fontSize: 13,
                        fontFamily: poppinsFont.style.fontFamily
                    },
                    components: removeComponent ? {} : antdComponentTheme(token),
                }}
            >
                <ConfigProvider
                    theme={{
                        token: {
                            borderRadius: 4,
                        }
                    }}
                >
                    {children}
                </ConfigProvider>
            </ConfigProvider>
        </>
    )
}

export default AntdClient;