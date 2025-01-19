// Role permissions object
export type RolePermissions = {
    BILL: {
        READ?: boolean,
        WRITE?: boolean,
        CREATE?: boolean,
    },
    USER: {
        READ?: boolean,
        WRITE?: boolean,
        CREATE?: boolean,
    },
    TENANT: {
        READ?: boolean,
        WRITE?: boolean,
        CREATE?: boolean,
    },
    STORE: {
        READ?: boolean,
        WRITE?: boolean,
        CREATE?: boolean,
    },
}


// Role document type in Firestore
export type StoreRoleDataType = {
    createdOn: string;
    createdBy: string;
    active: boolean;
    name: string;
    description: string;
    id: string;
    permissions: RolePermissions;
    modifiedBy?: string;
    modifiedOn?: string
};