
import { LuBookOpen, LuCreditCard, LuHeartPulse, LuLayoutDashboard, LuSettings, LuUser, LuUsers } from 'react-icons/lu';
import { TbHelpCircle } from 'react-icons/tb';


export const HOME_ROUTING = `/`;
export const CLIENT_DASHBOARD_HOME_ROUTING = `/control`;

export const NAVIGARIONS_ROUTINGS = {
    //generic dashboard or home 
    HOME: '/',

    //Dashboard routings
    DASHBOARD: `${CLIENT_DASHBOARD_HOME_ROUTING}/dashboard`,
    USERS: `${CLIENT_DASHBOARD_HOME_ROUTING}/users`,
    EDITOR: `${CLIENT_DASHBOARD_HOME_ROUTING}/editor`,
    BILLING: `${CLIENT_DASHBOARD_HOME_ROUTING}/billing`,
    PROFILE: `${CLIENT_DASHBOARD_HOME_ROUTING}/profile`,

    PROMOTIONS: `${CLIENT_DASHBOARD_HOME_ROUTING}/promotions`,
    DOCUMENTATION: `${CLIENT_DASHBOARD_HOME_ROUTING}/documentation`,

    PLATFORM: `/platform`,
    SIGNIN: `/signin`,
    FORGOT_PASSWORD: 'forgot-password',
}

export const SKIP_CLIENT_APP_LAYOUT_ROUTINGS = [NAVIGARIONS_ROUTINGS.SIGNIN, CLIENT_DASHBOARD_HOME_ROUTING];

export type NavItemType = { key?: any, label: string, route: string, defaultRoute?: string, icon: any, isChild?: boolean, subNav?: NavItemType[], showSubNav?: boolean, active?: boolean, subNavActive?: boolean };


export const SIDEBAR_DASHBOARD_LAYOUT: NavItemType[] = [

    { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.DASHBOARD, icon: LuLayoutDashboard },
    { label: 'Editor', route: NAVIGARIONS_ROUTINGS.EDITOR, icon: LuSettings },
    { label: 'Users', route: NAVIGARIONS_ROUTINGS.USERS, icon: LuUsers },
    { label: 'Billing', route: NAVIGARIONS_ROUTINGS.BILLING, icon: LuCreditCard },
    { label: 'Profile', route: NAVIGARIONS_ROUTINGS.PROFILE, icon: LuUser },
    { label: 'Documentation', route: NAVIGARIONS_ROUTINGS.DOCUMENTATION, icon: LuBookOpen },
    { label: 'Help', route: 'help', icon: TbHelpCircle },
    { label: 'Platform', route: NAVIGARIONS_ROUTINGS.PLATFORM, icon: LuHeartPulse },
]
