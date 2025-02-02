const antdComponentTheme = (token) => {
    return {
        Menu: {
            itemSelectedBg: "unset"
        },
        Segmented: {
            fontSize: 12,
            fontSizeLG: 13,
            controlHeight: 28,
            borderRadiusXS: 4,
            controlPaddingHorizontalSM: 10
        },
        Button: {
            contentFontSize: 13,
            // colorBorder: "transperant"
        },
        Drawer: {
            padding: 10,
            paddingLG: 15
        },
        Collapse: {
            // headerBg: token.colorBgLayout
        },
        // Typography: {
        //     // fontFamilyCode: '--primary-font'
        // },
        Dropdown: {
            fontSize: 14
        },
        Switch: {
            handleSize: 20,
            trackHeight: 30,
            trackMinWidth: 60,
            trackPadding: 5
        },
        Splitter: {
            splitBarSize: 4,
            splitBarDraggableSize: 80,
        }
    }
}
export default antdComponentTheme;
