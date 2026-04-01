/**
 * Filters navigation items based on user permissions
 * @param {Array} navItems - Navigation items array
 * @param {Array} userPermissions - User's permissions array
 * @returns {Array} Filtered navigation items
 */
export function filterNavigationByPermissions(navItems, userPermissions) {
    if (!Array.isArray(navItems) || !Array.isArray(userPermissions)) {
        return [];
    }

    return navItems
        .map(item => {
            // If no permissions required, show the item (for public links)
            if (
                !item.requiredPermissions ||
                item.requiredPermissions.length === 0
            ) {
                // Still filter nested items if they have permissions
                if (item.items && item.items.length > 0) {
                    const filteredItems = filterNavigationByPermissions(
                        item.items,
                        userPermissions
                    );
                    return { ...item, items: filteredItems };
                }
                return item;
            }

            // Check if user has at least one of the required permissions
            const hasPermission = item.requiredPermissions.some(permission =>
                userPermissions.includes(permission)
            );

            if (!hasPermission) {
                return null;
            }

            // Filter nested items recursively
            if (item.items && item.items.length > 0) {
                const filteredItems = filterNavigationByPermissions(
                    item.items,
                    userPermissions
                );

                // If no child items remain after filtering, return null
                if (filteredItems.length === 0) {
                    return null;
                }

                return { ...item, items: filteredItems };
            }

            return item;
        })
        .filter(Boolean);
}

