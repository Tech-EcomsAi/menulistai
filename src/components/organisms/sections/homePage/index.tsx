import { NAVIGATION_COMPONENTS_LIST } from "./navigation/constants";
import NavigationOneComponent from "./navigation/navigationOne/component";
import NavigationOneConfg from "./navigation/navigationOne/config";
import NavigationOneEditorComponent from "./navigation/navigationOne/editor";

// 111 = Page:Sections:Section-version

export type ComponentType = {
    name: string,
    unid: string,
    thumbnail: string,
    config: any,
    component?: any,
    editor?: any,
}
export type SectionType = {
    name: string,
    unid: string,
    components: ComponentType[]
}

const HomePageSectionsList: SectionType[] = [//unid = 1 for home page
    {
        name: "Navigation",
        unid: "1-1",//1:homepage,1:Hero section
        components: [
            {
                unid: "1-1-1",
                name: NAVIGATION_COMPONENTS_LIST.NAVIGATION_ONE,
                thumbnail: "https://firebasestorage.googleapis.com/v0/b/ecomsai.appspot.com/o/sections%2Fhomepage%2Fnavigation%2FTwitter%20post%20-%202.jpg?alt=media&token=ada5c811-9f9f-4a8b-95da-0bc8ed0bf46c",
                config: NavigationOneConfg("1-1-1"),
                component: NavigationOneComponent,
                editor: NavigationOneEditorComponent
            },
            {
                unid: "1-1-2",
                name: NAVIGATION_COMPONENTS_LIST.NAVIGATION_TWO,
                thumbnail: "https://firebasestorage.googleapis.com/v0/b/ecomsai-templates.appspot.com/o/templates%2F1-1-1%2Fone?alt=media&token=54fc0276-462a-4d88-b02f-2fdd335f563b",
                config: NavigationOneConfg("1-1-2"),
                component: NavigationOneComponent,
                editor: NavigationOneEditorComponent
            },
        ]
    }
]

export default HomePageSectionsList;