import Saperator from "@atoms/Saperator";
import { useAppDispatch } from "@hook/useAppDispatch";
import { useAppSelector } from "@hook/useAppSelector";
import { getBreadcrumbLayoutState, getSidebarLayoutState, getSidebarState, toggleBreadcrumbLayout, toggleSidbar, toggleSidebarLayout } from "@reduxSlices/clientThemeConfig";
import { Button, Flex, theme, Typography } from "antd";
import { LuLayoutPanelLeft, LuLayoutPanelTop, LuMoreHorizontal, LuMoreVertical, LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

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
                <Flex gap={10}>
                    <Button
                        block
                        onClick={() => dispatch(toggleSidebarLayout(true))}
                        size="large"
                        type={isVerticalSidebarLayout ? "primary" : "default"}
                        ghost={isVerticalSidebarLayout}
                        icon={<LuLayoutPanelLeft />}>
                        Vertical
                    </Button>
                    <Button
                        block
                        onClick={() => dispatch(toggleSidebarLayout(false))}
                        size="large"
                        type={isVerticalSidebarLayout ? "default" : "primary"}
                        ghost={!isVerticalSidebarLayout}
                        icon={<LuLayoutPanelTop />}>
                        Horizontal
                    </Button>
                </Flex>
            </Flex>
            <Saperator />
            {isVerticalSidebarLayout && <>
                <Flex vertical gap={10}>
                    <Text strong>Sidebar Layout</Text>
                    <Flex gap={10}>
                        <Button
                            block
                            onClick={() => dispatch(toggleSidbar(true))}
                            size="large"
                            type={isCollapsed ? "primary" : "default"}
                            ghost={isCollapsed}
                            icon={<LuPanelLeftClose />}>
                            Collapased
                        </Button>
                        <Button
                            block
                            onClick={() => dispatch(toggleSidbar(false))}
                            size="large"
                            type={isCollapsed ? "default" : "primary"}
                            ghost={!isCollapsed}
                            icon={<LuPanelLeftOpen />}>
                            Expanded
                        </Button>
                    </Flex>
                </Flex>
                <Saperator />
            </>}
            <Flex vertical gap={10}>
                <Text strong>Breadcrumb Layout</Text>
                <Flex gap={10}>
                    <Button
                        block
                        onClick={() => dispatch(toggleBreadcrumbLayout(true))}
                        size="large"
                        type={isVerticalBreadcrumbLayout ? "primary" : "default"}
                        ghost={isVerticalBreadcrumbLayout}
                        icon={<LuMoreVertical />}>
                        Dropdown List
                    </Button>
                    <Button
                        block
                        onClick={() => dispatch(toggleBreadcrumbLayout(false))}
                        size="large"
                        type={isVerticalBreadcrumbLayout ? "default" : "primary"}
                        ghost={!isVerticalBreadcrumbLayout}
                        icon={<LuMoreHorizontal />}>
                        Spread List
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}

export default AppLayoutSwitcher