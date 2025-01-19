import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import styles from '@organismsCSS/sidebarComponent/appSettingsPanel.module.scss';
import { getDarkModeState, toggleDarkMode } from "@reduxSlices/clientThemeConfig";
import { showSuccessToast } from "@reduxSlices/toast";
import { Button, Flex, theme, Typography } from "antd";
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
            <Flex justify="space-between" gap={10}>
                <Button onClick={() => toggleDarkModeTheme("dark")} style={{ width: "100%", boxShadow: isDarkMode ? token.boxShadow : token.boxShadowTertiary }} size="large" type={isDarkMode ? "primary" : "default"} icon={<LuMoon />}>Dark Mode</Button>
                <Button onClick={() => toggleDarkModeTheme("light")} style={{ width: "100%", boxShadow: !isDarkMode ? token.boxShadow : token.boxShadowTertiary }} size="large" type={isDarkMode ? "default" : "primary"} icon={<LuSun />}>Light Mode</Button>
            </Flex>
        </Flex>
    )
}

export default ThemeModeSwitcher