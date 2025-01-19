import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import styles from '@organismsCSS/sidebarComponent/appSettingsPanel.module.scss';
import { getDarkModeState, toggleDarkMode } from "@reduxSlices/clientThemeConfig";
import { showSuccessToast } from "@reduxSlices/toast";
import { Flex, Segmented, theme, Typography } from "antd";
import { LuMoon, LuSun } from "react-icons/lu";

const { Text } = Typography;

function ThemeModeSwitcher() {

    const isDarkMode = useAppSelector(getDarkModeState)
    const dispatch = useAppDispatch()
    const { token } = theme.useToken();
    const toggleDarkModeTheme = (from: string) => {
        if (from == 'light') {
            if (isDarkMode) {
                dispatch(toggleDarkMode(!isDarkMode));
                dispatch(showSuccessToast(`Light theme mode enabled`))
            }
        } else {
            if (!isDarkMode) {
                dispatch(toggleDarkMode(!isDarkMode));
                dispatch(showSuccessToast(`Dark theme mode enabled`))
            }
        }
    }

    return (
        <Flex vertical className={styles.appSettingsPanelWrap} gap={10}>
            <Text strong>Theme Mode</Text>
            <Segmented
                block
                value={isDarkMode ? "dark" : "light"}
                size="large"
                onChange={(value) => toggleDarkModeTheme(value.toString())}
                options={[
                    { label: "Dark Mode", icon: <LuMoon />, value: "dark" },
                    { label: "Light Mode", icon: <LuSun />, value: "light" }
                ]}
                style={{
                    boxShadow: token.boxShadowTertiary
                }}
            />
        </Flex>
    )
}

export default ThemeModeSwitcher