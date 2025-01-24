
import { LuBookOpen, LuCreditCard, LuHeartPulse, LuLayoutDashboard, LuReceipt, LuSettings, LuUser, LuUsers } from 'react-icons/lu';
import { TbHelpCircle } from 'react-icons/tb';


export const HOME_ROUTING = `/`;
export const CLIENT_DASHBOARD_ROUTING = `/dashboard`;

export const NAVIGARIONS_ROUTINGS = {

    DASHBOARD: `/dashboard`,
    USERS: `/users`,
    PROJECTS: `/projects`,
    BILLING: `/billing`,
    PROFILE: `/profile`,
    HISTORY: `/history`,

    PROMOTIONS: `/promotions`,
    DOCUMENTATION: `/documentation`,

    PLATFORM: `/platform`,
    SIGNIN: `/signin`,
    FORGOT_PASSWORD: 'forgot-password',
}

export const SKIP_CLIENT_APP_LAYOUT_ROUTINGS = [NAVIGARIONS_ROUTINGS.SIGNIN, HOME_ROUTING];

export type NavItemType = { key?: any, label: string, route: string, defaultRoute?: string, icon: any, isChild?: boolean, subNav?: NavItemType[], showSubNav?: boolean, active?: boolean, subNavActive?: boolean };


export const SIDEBAR_DASHBOARD_LAYOUT: NavItemType[] = [

    { label: 'Dashboard', route: NAVIGARIONS_ROUTINGS.DASHBOARD, icon: LuLayoutDashboard },
    { label: 'Projects', route: NAVIGARIONS_ROUTINGS.PROJECTS, icon: LuSettings },
    { label: 'Users', route: NAVIGARIONS_ROUTINGS.USERS, icon: LuUsers },
    { label: 'Billing', route: NAVIGARIONS_ROUTINGS.BILLING, icon: LuCreditCard },
    { label: 'Profile', route: NAVIGARIONS_ROUTINGS.PROFILE, icon: LuUser },
    { label: 'History', route: NAVIGARIONS_ROUTINGS.HISTORY, icon: LuReceipt },
    { label: 'Documentation', route: NAVIGARIONS_ROUTINGS.DOCUMENTATION, icon: LuBookOpen },
    { label: 'Help', route: 'help', icon: TbHelpCircle },
    { label: 'Platform', route: NAVIGARIONS_ROUTINGS.PLATFORM, icon: LuHeartPulse },
]
