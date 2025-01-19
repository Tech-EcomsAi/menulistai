import { RolePermissions } from "@type/platform/roles";

const RolesPermissionInitialData: RolePermissions = {
    BILL: {
        READ: true,
        WRITE: true,
        CREATE: true,
    },
    USER: {
        READ: true,
        WRITE: true,
        CREATE: true
    },
    TENANT: {
        READ: true,
        WRITE: true,
        CREATE: true
    },
    STORE: {
        READ: true,
        WRITE: true,
        CREATE: true
    },
}

export default RolesPermissionInitialData

export const SamplePermissionData = {
    READ: true,
    WRITE: true,
    CREATE: true,
}
export const RolesPermissionsConfig = [
    {
        groupName: "Billing",
        permissions: RolesPermissionInitialData.BILL,
        active: true,
        key: "BILL"
    },
    {
        groupName: "User",
        permissions: RolesPermissionInitialData.USER,
        active: true,
        key: "USER"
    },
    {
        groupName: "Tenant",
        permissions: RolesPermissionInitialData.TENANT,
        active: true,
        key: "TENANT"
    },
    {
        groupName: "Store",
        permissions: RolesPermissionInitialData.STORE,
        active: true,
        key: "STORE"
    },
]

export const ROLES_PERMISSIONS_STRATEGIES = {
    DENY_STRATEGY: "DENY_STRATEGY",
    ALLOW_STRATEGY: "ALLOW_STRATEGY",
    // HIERARCHY_STRATEGY: "HIERARCHY_STRATEGY"
}
export const ROLES_PERMISSIONS_STRATEGIES_LIST = [
    { lable: "Deny Strategy", value: ROLES_PERMISSIONS_STRATEGIES.DENY_STRATEGY, description: "If any role denies, the permission is false", tooltip: `With the Deny Strategy, if there’s even one rule that says "no," the member is not allowed to do the action, even if other rules say "yes." It's like being super careful and saying, “If one person says no, then nobody gets to do it!” For example, if a member has one role that says "yes" to editing a post and another that says "no," the "no" wins, and they can’t edit.` },
    { lable: "Allow Strategy", value: ROLES_PERMISSIONS_STRATEGIES.ALLOW_STRATEGY, description: "If any role allows, the permission is true", tooltip: `With the Allow Strategy, if there’s at least one rule that says "yes," the member is allowed to do the action, even if other rules say "no." It’s a more relaxed approach: “If just one person says yes, go ahead and do it!” So, if a member has one role that says "yes" to editing and another that says "no," the "yes" wins, and they’re allowed to edit.` },
    // { lable: "Hierarchy (Priority) Strategy", value: ROLES_PERMISSIONS_STRATEGIES.HIERARCHY_STRATEGY, description: "Permissions are resolved based on the role with the highest priority", tooltip: `The Hierarchy Strategy is like following the instructions of the highest-ranking person. Each role has a rank (or priority), and when there’s a conflict, the rule from the highest-ranking role wins. Imagine if there’s a "Junior Member" role and a "Senior Member" role. If the "Senior Member" role has the highest rank, its rules win. So, if a member’s "Junior Member" role says "no" to editing, but their "Senior Member" role says "yes," they’re allowed to edit because the senior role has more power.` },
]