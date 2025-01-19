
import { IoAnalyticsSharp } from 'react-icons/io5';
import { LuBookOpen, LuCalendarCheck, LuCalendarClock, LuCalendarHeart, LuCreditCard, LuEye, LuFileEdit, LuFileText, LuHeadphones, LuHeartHandshake, LuHeartPulse, LuHelpingHand, LuLayoutDashboard, LuLayoutList, LuLineChart, LuList, LuListOrdered, LuListTodo, LuMail, LuMessageSquare, LuNewspaper, LuPiggyBank, LuScrollText, LuSettings, LuShoppingCart, LuTags, LuTimer, LuTimerOff, LuUser2, LuUserCog, LuUsers, LuUsers2, LuUserSquare2, LuWalletCards } from 'react-icons/lu';
import { MdOutlineCampaign } from 'react-icons/md';
import { RiAppsLine, RiArticleLine } from 'react-icons/ri';
import { RxDashboard } from 'react-icons/rx';
import { TbBug, TbChartPie, TbDeviceMobileShare, TbHelpCircle, TbMessageChatbot, TbMoneybag, TbUsers, TbWorldBolt } from 'react-icons/tb';


export const HOME_ROUTING = `/`;
export const CLIENT_DASHBOARD_HOME_ROUTING = `/control`;

export const NAVIGARIONS_ROUTINGS = {
    //generic dashboard or home 
    HOME: '/',

    //Dashboard routings
    DASHBOARDS: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboards`,
    DASHBOARDS_SUMMARY: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboards/summary`,
    DASHBOARDS_SALES: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboards/sales`,
    DASHBOARDS_USERS: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboards/users`,
    DASHBOARDS_ANALYTICS: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboards/analytics`,

    //App routings
    APPS_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/dashboard`,
    APP_TODO: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/todo`,
    APP_NOTES: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/notes`,
    APP_CHATS: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/chatbot`,
    APP_BLOGS: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/blogs`,
    APP_EMAILS: `${CLIENT_DASHBOARD_HOME_ROUTING}/apps/email`,

    //Reports
    REPORTS: `${CLIENT_DASHBOARD_HOME_ROUTING}/reports`,
    REPORTS_SUMMARY: `${CLIENT_DASHBOARD_HOME_ROUTING}/reports/summary`,
    REPORTS_SALES: `${CLIENT_DASHBOARD_HOME_ROUTING}/reports/sales`,
    REPORTS_USERS: `${CLIENT_DASHBOARD_HOME_ROUTING}/reports/users`,
    REPORTS_ANALYTICS: `${CLIENT_DASHBOARD_HOME_ROUTING}/reports/analytics`,

    WEBSITE_BUILDER_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/websites/dashboard`,
    WEBSITE_BUILDER_EDITOR: `${CLIENT_DASHBOARD_HOME_ROUTING}/websites/editor`,
    WEBSITE_BUILDER_PREVIEW: `${CLIENT_DASHBOARD_HOME_ROUTING}/websites/preview`,
    WEBSITE_BUILDER_SETTINGS: `${CLIENT_DASHBOARD_HOME_ROUTING}/websites/settings`,
    WEBSITE_BUILDER_PWA: `${CLIENT_DASHBOARD_HOME_ROUTING}/websites/pwa`,

    USERS_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/dashboard`,
    USERS_LIST: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/list`,
    USERS_SCHEDULING: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/scheduling`,
    USERS_PERMISSIONS: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/permissions`,
    USERS_SHIFTS: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/shifts`,
    USERS_BREAKS: `${CLIENT_DASHBOARD_HOME_ROUTING}/users/breaks`,

    MARKETING_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/marketing/dashboard`,
    MARKETING_PROMOTIONS: `${CLIENT_DASHBOARD_HOME_ROUTING}/marketing/promotions`,

    EXPENSE_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/expense/dashboard`,
    EXPENSE_LIST: `${CLIENT_DASHBOARD_HOME_ROUTING}/expense/list`,
    EXPENSE_CATEGORY: `${CLIENT_DASHBOARD_HOME_ROUTING}/expense/category`,
    EXPENSE_ACCOUNTS: `${CLIENT_DASHBOARD_HOME_ROUTING}/expense/accounts`,

    SETTINGS: `${CLIENT_DASHBOARD_HOME_ROUTING}/settings/buisiness`,
    SETTINGS_GENERAL: `${CLIENT_DASHBOARD_HOME_ROUTING}/settings/general`,

    CATALOG: `${CLIENT_DASHBOARD_HOME_ROUTING}/catalog`,
    CATALOG_SERVICES: `${CLIENT_DASHBOARD_HOME_ROUTING}/catalog/services`,
    CATALOG_PRODUCTS: `${CLIENT_DASHBOARD_HOME_ROUTING}/catalog/products`,
    CATALOG_INVENTORY: `${CLIENT_DASHBOARD_HOME_ROUTING}/catalog/inventory`,

    QUICK_SALE_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/quicksale/dashboard`,
    QUICK_SALE_BILLING: `${CLIENT_DASHBOARD_HOME_ROUTING}/quicksale/billing`,
    QUICK_SALE_INVOICES: `${CLIENT_DASHBOARD_HOME_ROUTING}/quicksale/invoices`,

    APPOINTMENT_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/appointment/dashboard`,
    APPOINTMENT_CALENDAR: `${CLIENT_DASHBOARD_HOME_ROUTING}/appointment/calendar`,
    APPOINTMENT_LIST: `${CLIENT_DASHBOARD_HOME_ROUTING}/appointment/list`,

    CRM_DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/crm/dashboard`,
    CRM_LIST: `${CLIENT_DASHBOARD_HOME_ROUTING}/crm/list`,

    PROMOTIONS: `${CLIENT_DASHBOARD_HOME_ROUTING}/promotions`,
    DOCUMENTATION: `${CLIENT_DASHBOARD_HOME_ROUTING}/documentation`,
    PLATFORM: `/platform`,

    NOTIFICATIONS: `${CLIENT_DASHBOARD_HOME_ROUTING}/notifications`,
    MESSAGES: `${CLIENT_DASHBOARD_HOME_ROUTING}/messages`,
    SIGNIN: `/signin`,
    FORGOT_PASSWORD: 'forgot-password',
}

export const CRAFT_BUILDER_NAVIGARIONS_ROUTINGS = {
    ROOT: `/craft-builder`,
    HOME: "/",
    EDITOR: "editor",
    PROFILE: "profile",
    FAVOURITE: "favourite",
    RECENT: "recent",
    TEMPLATES: "templates",
    SETTING: "setting"
}

// export const BLOGS_APP_ROUTINGS = {
//     DASHBOARD: `${NAVIGARIONS_ROUTINGS.APP_BLOGS}/dashboard`,
//     BLOG_DETAILS: `${NAVIGARIONS_ROUTINGS.APP_BLOGS}/blogDetails`,
//     LISTING: `${NAVIGARIONS_ROUTINGS.APP_BLOGS}/listing`,
//     CATEGORIES: `${NAVIGARIONS_ROUTINGS.APP_BLOGS}/categories`,
// }

export const PLATFORM_NAVIGARIONS_ROUTINGS = {
    HOME: "platform",
    ASSETS: `assets`,
    ILLUSTRATION: "illustartion",
    IMAGES: "images",
    GRAPHICS: "graphics",
}

export const ADMIN_NAVIGARIONS_ROUTINGS = {
    ROOT: `/admin`,
    HOME: "/",
    LOGS: "logs",
}
//add routings here in which you want to skip the client app layout
export const SKIP_CLIENT_APP_LAYOUT_ROUTINGS = [CRAFT_BUILDER_NAVIGARIONS_ROUTINGS.ROOT, NAVIGARIONS_ROUTINGS.SIGNIN, CLIENT_DASHBOARD_HOME_ROUTING];

export type NavItemType = { key?: any, label: string, route: string, defaultRoute?: string, icon: any, isChild?: boolean, subNav?: NavItemType[], showSubNav?: boolean, active?: boolean, subNavActive?: boolean };

export const DASHBOARD_MENU: NavItemType[] = [
    {
        label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.DASHBOARDS, icon: RxDashboard,
        subNav: [
            { label: 'Summary', route: NAVIGARIONS_ROUTINGS.DASHBOARDS_SUMMARY, icon: TbChartPie },
            { label: 'Sales', route: NAVIGARIONS_ROUTINGS.DASHBOARDS_SALES, icon: LuLineChart },
            { label: 'Users', route: NAVIGARIONS_ROUTINGS.DASHBOARDS_USERS, icon: TbUsers },
            { label: 'Analytics', route: NAVIGARIONS_ROUTINGS.DASHBOARDS_ANALYTICS, icon: IoAnalyticsSharp },
        ]
    },
]

export const REPORTS_MENU: NavItemType[] = [
    {
        label: 'Reports', route: NAVIGARIONS_ROUTINGS.REPORTS, icon: LuLineChart,
        subNav: [
            { label: 'Summary', route: NAVIGARIONS_ROUTINGS.REPORTS_SUMMARY, icon: TbChartPie },
            { label: 'Sales', route: NAVIGARIONS_ROUTINGS.REPORTS_SALES, icon: LuLineChart },
            { label: 'Users', route: NAVIGARIONS_ROUTINGS.REPORTS_USERS, icon: TbUsers },
            { label: 'Analytics', route: NAVIGARIONS_ROUTINGS.REPORTS_ANALYTICS, icon: IoAnalyticsSharp },
        ]
    },
]

export const WEBSITE_MENU: NavItemType[] = [
    {
        label: 'Websites', route: "", icon: TbWorldBolt,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'Editor', route: NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_EDITOR, icon: LuFileEdit },
            { label: 'Preview', route: NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_PREVIEW, icon: LuEye },
            { label: 'Settings', route: NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_SETTINGS, icon: LuSettings },
            { label: 'PWA', route: NAVIGARIONS_ROUTINGS.WEBSITE_BUILDER_PWA, icon: TbDeviceMobileShare },
        ]
    },
]

export const APPS_MENU: NavItemType[] = [
    {
        label: 'Apps', route: 'apps', icon: RiAppsLine,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.APPS_DASHBOARD, icon: TbChartPie },
            { label: 'Chat', route: NAVIGARIONS_ROUTINGS.APP_CHATS, icon: LuMessageSquare },
            { label: 'Blog', route: NAVIGARIONS_ROUTINGS.APP_BLOGS, icon: RiArticleLine },
            { label: 'Email', route: NAVIGARIONS_ROUTINGS.APP_EMAILS, icon: LuMail },
            { label: 'To Do', route: NAVIGARIONS_ROUTINGS.APP_TODO, icon: LuCalendarCheck },
            { label: 'Notes', route: NAVIGARIONS_ROUTINGS.APP_NOTES, icon: LuListTodo },
        ]
    },
]

export const USERS_MENU: NavItemType[] = [
    {
        label: 'Users', route: 'users', icon: LuUserSquare2,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.USERS_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'List', route: NAVIGARIONS_ROUTINGS.USERS_LIST, icon: LuUsers },
            { label: 'Scheduling', route: NAVIGARIONS_ROUTINGS.USERS_SCHEDULING, icon: LuCalendarClock },
            { label: 'Shift Types', route: NAVIGARIONS_ROUTINGS.USERS_SHIFTS, icon: LuTimer },
            { label: 'Break Types', route: NAVIGARIONS_ROUTINGS.USERS_BREAKS, icon: LuTimerOff },
            { label: 'Permissions', route: NAVIGARIONS_ROUTINGS.USERS_PERMISSIONS, icon: LuUserCog },
        ]
    },
]

export const CATALOG_MENU: NavItemType[] = [
    {
        label: 'Backoffice', route: 'catalog', icon: LuBookOpen,
        subNav: [
            { label: 'Services', route: NAVIGARIONS_ROUTINGS.CATALOG_SERVICES, icon: LuList },
            { label: 'Products', route: NAVIGARIONS_ROUTINGS.CATALOG_PRODUCTS, icon: LuLayoutList },
            { label: 'Inventory', route: NAVIGARIONS_ROUTINGS.CATALOG_INVENTORY, icon: LuShoppingCart },
        ]
    },
]

export const MARKETING_MENU: NavItemType[] = [
    {
        label: 'Marketing', route: 'marketing', icon: LuHeartHandshake,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.MARKETING_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'Promotions', route: NAVIGARIONS_ROUTINGS.MARKETING_PROMOTIONS, icon: MdOutlineCampaign },
        ]
    },
]

export const EXPENSE_MENU: NavItemType[] = [
    {
        label: 'Expense', route: 'expense', icon: LuPiggyBank, defaultRoute: NAVIGARIONS_ROUTINGS.EXPENSE_DASHBOARD,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.EXPENSE_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'List', route: NAVIGARIONS_ROUTINGS.EXPENSE_LIST, icon: LuWalletCards },
            { label: 'Category', route: NAVIGARIONS_ROUTINGS.EXPENSE_CATEGORY, icon: LuLayoutList },
            { label: 'Accounts', route: NAVIGARIONS_ROUTINGS.EXPENSE_ACCOUNTS, icon: LuCreditCard },
        ]
    },
]

export const CRM_MENU: NavItemType[] = [
    {
        label: 'Customers', route: 'customers', icon: LuUser2, defaultRoute: NAVIGARIONS_ROUTINGS.CRM_DASHBOARD,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.CRM_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'List', route: NAVIGARIONS_ROUTINGS.CRM_LIST, icon: LuUsers2 },
        ]
    },
]

export const APPOINTMENT_MENU: NavItemType[] = [
    {
        label: 'Appointment', route: 'appointment', icon: LuCalendarHeart, defaultRoute: NAVIGARIONS_ROUTINGS.APPOINTMENT_CALENDAR,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.APPOINTMENT_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'Calendar', route: NAVIGARIONS_ROUTINGS.APPOINTMENT_CALENDAR, icon: LuCalendarCheck },
        ]
    },
]

export const QUICK_SALE_MENU: NavItemType[] = [
    {
        label: 'Quick Sale', route: 'quicksale', icon: LuTags, defaultRoute: NAVIGARIONS_ROUTINGS.QUICK_SALE_BILLING,
        subNav: [
            { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.QUICK_SALE_DASHBOARD, icon: LuLayoutDashboard },
            { label: 'Billing', route: NAVIGARIONS_ROUTINGS.QUICK_SALE_BILLING, icon: LuFileText },
            { label: 'Invoices', route: NAVIGARIONS_ROUTINGS.QUICK_SALE_INVOICES, icon: LuScrollText },
        ]
    },
]

export const SIDEBAR_DASHBOARD_LAYOUT: NavItemType[] = [
    ...DASHBOARD_MENU,
    ...QUICK_SALE_MENU,
    ...APPOINTMENT_MENU,
    ...CRM_MENU,
    ...WEBSITE_MENU,
    ...REPORTS_MENU,
    ...CATALOG_MENU,
    ...MARKETING_MENU,
    ...USERS_MENU,
    ...APPS_MENU,
    ...EXPENSE_MENU,
    { label: 'Settings', route: NAVIGARIONS_ROUTINGS.SETTINGS, icon: LuSettings },
    { label: 'Documentation', route: NAVIGARIONS_ROUTINGS.DOCUMENTATION, icon: LuBookOpen },
    { label: 'Help', route: 'help', icon: TbHelpCircle },
    { label: 'Platform', route: NAVIGARIONS_ROUTINGS.PLATFORM, icon: LuHeartPulse },

]

export const LIST_MENUS = [
    { label: 'Orders', keywords: 'orders,transactions', icon: LuListOrdered, route: "orders" },
    { label: 'Appointments', keywords: 'appointments,transactions', icon: LuListTodo, route: "appointments" },
    { label: 'Users/CRM', keywords: 'users,customers', icon: LuUsers, route: "users" },
    { label: 'Payments', keywords: 'payments,transactions', icon: TbMoneybag, route: "payments" }
]

export const REACH_US_LINKS = [
    { label: 'Raise issue', keywords: 'issue,contact,about,support', icon: TbBug, route: "raise-issue" },
    { label: 'Help Center', keywords: 'support,contact,about,ecomsai', icon: LuHeadphones, route: "help-center" },
    { label: 'Contact Us', keywords: 'support,contact,about,ecomsai', icon: TbMessageChatbot, route: "chat-with-us" },
    { label: 'Documentation', keywords: 'documentation,contact,about,ecomsai,support', icon: LuNewspaper, route: "documentation" },
]

export const SEARCHES_LIST = [
    { label: 'Dashboards', items: DASHBOARD_MENU[0].subNav, icon: DASHBOARD_MENU[0].icon },
    { label: 'Apps', items: APPS_MENU[0].subNav, icon: APPS_MENU[0].icon },
    { label: 'Transactions', items: LIST_MENUS, icon: LuListOrdered },
    { label: 'How to Reach Us', items: REACH_US_LINKS, icon: LuHelpingHand }
]

