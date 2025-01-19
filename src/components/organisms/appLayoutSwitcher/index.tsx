import Saperator from "@atoms/Saperator";
import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import { getBreadcrumbLayoutState, getSidebarLayoutState, getSidebarState, toggleSidbar, toggleSidebarLayout } from "@reduxSlices/clientThemeConfig";
import { Flex, Segmented, theme, Typography } from "antd";
import { LuLayoutPanelLeft, LuLayoutPanelTop, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

const { Text } = Typography;

function AppLayoutSwitcher() {

    const isVerticalSidebarLayout = useAppSelector(getSidebarLayoutState)
    const isVerticalBreadcrumbLayout = useAppSelector(getBreadcrumbLayoutState)
    const dispatch = useAppDispatch()
    const isCollapsed = useAppSelector(getSidebarState)
    const { token } = theme.useToken();
    console.log("isVerticalBreadcrumbLayout", isVerticalBreadcrumbLayout)

    return (
        <>
            <Flex vertical gap={10}>
                <Text strong>Dashboard Layout</Text>
                <Segmented
                    block
                    size="large"
                    value={isVerticalSidebarLayout ? "vertical" : "horizontal"}
                    onChange={(value) => dispatch(toggleSidebarLayout(value === "vertical"))}
                    options={[
                        { label: "Vertical", icon: <LuLayoutPanelLeft />, value: "vertical" },
                        { label: "Horizontal", icon: <LuLayoutPanelTop />, value: "horizontal" }
                    ]}
                    style={{ boxShadow: token.boxShadowTertiary }}
                />
            </Flex>
            <Saperator />
            {isVerticalSidebarLayout && <>
                <Flex vertical gap={10}>
                    <Text strong>Sidebar Layout</Text>
                    <Segmented
                        block
                        size="large"
                        value={isCollapsed ? "collapsed" : "expanded"}
                        onChange={(value) => dispatch(toggleSidbar(value === "collapsed"))}
                        options={[
                            { label: "Collapased", icon: <LuPanelLeftClose />, value: "collapsed" },
                            { label: "Expanded", icon: <LuPanelLeftOpen />, value: "expanded" }
                        ]}
                        style={{ boxShadow: token.boxShadowTertiary }}
                    />
                </Flex>
                <Saperator />
            </>}
        </>
    )
}

export default AppLayoutSwitcher