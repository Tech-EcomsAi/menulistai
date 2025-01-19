import RolesPermissionInitialData, { ROLES_PERMISSIONS_STRATEGIES } from "@data/rolesPermissionsInitialData";
import { objectNullCheck } from "@util/utils";

const resolvePermissions = (rolesPermissions, strategy = ROLES_PERMISSIONS_STRATEGIES.DENY_STRATEGY) => {
    const finalPermissions = {};

    // In case of hierarchy strategy
    let highestPriorityRole = null;

    rolesPermissions.forEach((role) => {//admin
        if(!objectNullCheck(role,'permissions')) return
        const { permissions, priority } = role;

        for (const entity in permissions) {//entity:bill
            if (!finalPermissions[entity]) {
                finalPermissions[entity] = {};
            }

            for (const action in RolesPermissionInitialData[entity]) {//action:edit
                const currentPermission = Boolean(permissions[entity][action]);

                switch (strategy) {
                    case ROLES_PERMISSIONS_STRATEGIES.DENY_STRATEGY:
                        // Deny strategy: If any role denies, the permission is false
                        if (finalPermissions[entity][action] === undefined) {
                            finalPermissions[entity][action] = currentPermission;
                        }
                        if (!currentPermission) finalPermissions[entity][action] = false;
                        break;

                    case ROLES_PERMISSIONS_STRATEGIES.ALLOW_STRATEGY:
                        // Allow strategy: If any role allows, the permission is true
                        if (finalPermissions[entity][action] === undefined) {
                            finalPermissions[entity][action] = currentPermission;
                        }
                        if (currentPermission) finalPermissions[entity][action] = true;
                        break;

                    // case ROLES_PERMISSIONS_STRATEGIES.HIERARCHY_STRATEGY:
                    //     // Hierarchy strategy: Resolve based on highest priority role
                    //     if (highestPriorityRole == null) {
                    //         highestPriorityRole = Number(priority);
                    //     }
                    //     if (Number(priority) >= Number(highestPriorityRole)) {
                    //         highestPriorityRole = Number(priority);
                    //         finalPermissions[entity][action] = currentPermission;
                    //     }
                    //     break;
                }
            }
        }
    });

    return finalPermissions;
};

export default resolvePermissions;