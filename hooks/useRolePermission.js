import { ROLE_PERMISSIONS } from '@/RBAC.config';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

// Helper function to check if user has permission
export const hasPermission = (userRole, permission) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return rolePermissions.includes(permission);
};

// Helper function to check if user has any of the permissions
export const hasAnyPermission = (userRole, permissions) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.some(permission => rolePermissions.includes(permission));
};

// Helper function to check if user has all of the permissions
export const hasAllPermissions = (userRole, permissions) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.every(permission =>
        rolePermissions.includes(permission)
    );
};

export function useRolePermission(permission) {
    const { data: session } = useSession();

    return useMemo(() => {
        const userRole = session?.user?.role;
        const userPermissions = ROLE_PERMISSIONS[userRole] || [];
        return userPermissions.includes(permission);
    }, [permission, session?.user?.role]);
}

