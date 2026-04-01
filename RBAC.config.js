// Permission enum values
// noinspection JSUnusedGlobalSymbols

export const Permission = {
    // Users
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_USERS: 'VIEW_USERS',
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',

    // Trips
    CREATE_TRIP: 'CREATE_TRIP',
    VIEW_TRIPS: 'VIEW_TRIPS',
    EDIT_TRIP: 'EDIT_TRIP',
    DELETE_TRIP: 'DELETE_TRIP',

    // Blogs
    CREATE_BLOG: 'CREATE_BLOG',
    VIEW_BLOGS: 'VIEW_BLOGS',
    EDIT_BLOG: 'EDIT_BLOG',
    DELETE_BLOG: 'DELETE_BLOG',

    // Destinations
    CREATE_DESTINATION: 'CREATE_DESTINATION',
    VIEW_DESTINATIONS: 'VIEW_DESTINATIONS',
    EDIT_DESTINATION: 'EDIT_DESTINATION',
    DELETE_DESTINATION: 'DELETE_DESTINATION',

    // Activities
    CREATE_ACTIVITY: 'CREATE_ACTIVITY',
    VIEW_ACTIVITIES: 'VIEW_ACTIVITIES',
    EDIT_ACTIVITY: 'EDIT_ACTIVITY',
    DELETE_ACTIVITY: 'DELETE_ACTIVITY',

    // Pickups & Drops
    CREATE_PICKUP_DROP: 'CREATE_PICKUP_DROP',
    VIEW_PICKUP_DROPS: 'VIEW_PICKUP_DROPS',
    EDIT_PICKUP_DROP: 'EDIT_PICKUP_DROP',
    DELETE_PICKUP_DROP: 'DELETE_PICKUP_DROP',

    // Categories
    CREATE_CATEGORY: 'CREATE_CATEGORY',
    VIEW_CATEGORIES: 'VIEW_CATEGORIES',
    EDIT_CATEGORY: 'EDIT_CATEGORY',
    DELETE_CATEGORY: 'DELETE_CATEGORY',

    // Bookings
    VIEW_BOOKINGS: 'VIEW_BOOKINGS',
    EDIT_BOOKING: 'EDIT_BOOKING',
    DELETE_BOOKING: 'DELETE_BOOKING',

    // Payments
    VIEW_PAYMENTS: 'VIEW_PAYMENTS',
    EDIT_PAYMENT: 'EDIT_PAYMENT',
    DELETE_PAYMENT: 'DELETE_PAYMENT',

    // Enquiries
    VIEW_ENQUIRIES: 'VIEW_ENQUIRIES',
    DELETE_ENQUIRY: 'DELETE_ENQUIRY',
    REPLY_ENQUIRY: 'REPLY_ENQUIRY',

    // Leads
    VIEW_LEADS: 'VIEW_LEADS',
    EDIT_LEAD: 'EDIT_LEAD',
    DELETE_LEAD: 'DELETE_LEAD',

    // Reviews
    VIEW_REVIEWS: 'VIEW_REVIEWS',
    EDIT_REVIEW: 'EDIT_REVIEW',
    DELETE_REVIEW: 'DELETE_REVIEW',

    // Partners
    CREATE_PARTNER: 'CREATE_PARTNER',
    VIEW_PARTNERS: 'VIEW_PARTNERS',
    EDIT_PARTNER: 'EDIT_PARTNER',
    DELETE_PARTNER: 'DELETE_PARTNER',

    // Files & Media
    UPLOAD_MEDIA: 'UPLOAD_MEDIA',
    MANAGE_MEDIA: 'MANAGE_MEDIA',

    // Profile
    VIEW_PROFILE: 'VIEW_PROFILE',
    EDIT_PROFILE: 'EDIT_PROFILE',

    // Settings
    MANAGE_SETTINGS: 'MANAGE_SETTINGS',
    VIEW_SETTINGS: 'VIEW_SETTINGS',

    // System
    VIEW_ANALYTICS: 'VIEW_ANALYTICS',
    EXPORT_DATA: 'EXPORT_DATA',
    BULK_OPERATIONS: 'BULK_OPERATIONS',
    MANAGE_SYSTEM: 'MANAGE_SYSTEM',
};
export const ALL_PERMISSIONS = [
    // Users
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,

    // Trips
    Permission.CREATE_TRIP,
    Permission.VIEW_TRIPS,
    Permission.EDIT_TRIP,
    Permission.DELETE_TRIP,

    // Blogs
    Permission.CREATE_BLOG,
    Permission.VIEW_BLOGS,
    Permission.EDIT_BLOG,
    Permission.DELETE_BLOG,

    // Destinations
    Permission.CREATE_DESTINATION,
    Permission.VIEW_DESTINATIONS,
    Permission.EDIT_DESTINATION,
    Permission.DELETE_DESTINATION,

    // Activities
    Permission.CREATE_ACTIVITY,
    Permission.VIEW_ACTIVITIES,
    Permission.EDIT_ACTIVITY,
    Permission.DELETE_ACTIVITY,

    // Pickups & Drops
    Permission.CREATE_PICKUP_DROP,
    Permission.VIEW_PICKUP_DROPS,
    Permission.EDIT_PICKUP_DROP,
    Permission.DELETE_PICKUP_DROP,

    // Categories
    Permission.CREATE_CATEGORY,
    Permission.VIEW_CATEGORIES,
    Permission.EDIT_CATEGORY,
    Permission.DELETE_CATEGORY,

    // Bookings
    Permission.VIEW_BOOKINGS,
    Permission.EDIT_BOOKING,
    Permission.DELETE_BOOKING,

    // Payments
    Permission.VIEW_PAYMENTS,
    Permission.EDIT_PAYMENT,
    Permission.DELETE_PAYMENT,

    // Enquiries
    Permission.VIEW_ENQUIRIES,
    Permission.DELETE_ENQUIRY,
    Permission.REPLY_ENQUIRY,

    // Leads
    Permission.VIEW_LEADS,
    Permission.EDIT_LEAD,
    Permission.DELETE_LEAD,

    // Reviews
    Permission.VIEW_REVIEWS,
    Permission.EDIT_REVIEW,
    Permission.DELETE_REVIEW,

    // Partners
    Permission.CREATE_PARTNER,
    Permission.VIEW_PARTNERS,
    Permission.EDIT_PARTNER,
    Permission.DELETE_PARTNER,

    // Files & Media
    Permission.UPLOAD_MEDIA,
    Permission.MANAGE_MEDIA,

    // Profile
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,

    // Settings
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_SETTINGS,

    // System
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.BULK_OPERATIONS,
    Permission.MANAGE_SYSTEM,
];
// Role enum values
export const Role = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
    STAFF: 'STAFF',
    GUIDE: 'GUIDE',
    TOUR_OPERATOR: 'TOUR_OPERATOR',
    USER: 'USER',
    TRAVELLER: 'TRAVELLER',
};

export const ROLE_PERMISSIONS = {
    [Role.SUPER_ADMIN]: [
        // Users
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.CREATE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,

        // Trips
        Permission.CREATE_TRIP,
        Permission.VIEW_TRIPS,
        Permission.EDIT_TRIP,
        Permission.DELETE_TRIP,

        // Blogs
        Permission.CREATE_BLOG,
        Permission.VIEW_BLOGS,
        Permission.EDIT_BLOG,
        Permission.DELETE_BLOG,

        // Destinations
        Permission.CREATE_DESTINATION,
        Permission.VIEW_DESTINATIONS,
        Permission.EDIT_DESTINATION,
        Permission.DELETE_DESTINATION,

        // Activities
        Permission.CREATE_ACTIVITY,
        Permission.VIEW_ACTIVITIES,
        Permission.EDIT_ACTIVITY,
        Permission.DELETE_ACTIVITY,

        // Pickups & Drops
        Permission.CREATE_PICKUP_DROP,
        Permission.VIEW_PICKUP_DROPS,
        Permission.EDIT_PICKUP_DROP,
        Permission.DELETE_PICKUP_DROP,

        // Categories
        Permission.CREATE_CATEGORY,
        Permission.VIEW_CATEGORIES,
        Permission.EDIT_CATEGORY,
        Permission.DELETE_CATEGORY,

        // Bookings
        Permission.VIEW_BOOKINGS,
        Permission.EDIT_BOOKING,
        Permission.DELETE_BOOKING,

        // Payments
        Permission.VIEW_PAYMENTS,
        Permission.EDIT_PAYMENT,
        Permission.DELETE_PAYMENT,

        // Enquiries
        Permission.VIEW_ENQUIRIES,
        Permission.DELETE_ENQUIRY,
        Permission.REPLY_ENQUIRY,

        // Leads
        Permission.VIEW_LEADS,
        Permission.EDIT_LEAD,
        Permission.DELETE_LEAD,

        // Reviews
        Permission.VIEW_REVIEWS,
        Permission.EDIT_REVIEW,
        Permission.DELETE_REVIEW,

        // Partners
        Permission.CREATE_PARTNER,
        Permission.VIEW_PARTNERS,
        Permission.EDIT_PARTNER,
        Permission.DELETE_PARTNER,

        // Files & Media
        Permission.UPLOAD_MEDIA,
        Permission.MANAGE_MEDIA,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Settings
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,

        // Analytics & Export
        Permission.VIEW_ANALYTICS,
        Permission.EXPORT_DATA,
        Permission.BULK_OPERATIONS,
        Permission.MANAGE_SYSTEM,
    ],

    [Role.ADMIN]: [
        // Users
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.CREATE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,

        // Trips
        Permission.CREATE_TRIP,
        Permission.VIEW_TRIPS,
        Permission.EDIT_TRIP,
        Permission.DELETE_TRIP,

        // Blogs
        Permission.CREATE_BLOG,
        Permission.VIEW_BLOGS,
        Permission.EDIT_BLOG,
        Permission.DELETE_BLOG,

        // Destinations
        Permission.CREATE_DESTINATION,
        Permission.VIEW_DESTINATIONS,
        Permission.EDIT_DESTINATION,
        Permission.DELETE_DESTINATION,

        // Activities
        Permission.CREATE_ACTIVITY,
        Permission.VIEW_ACTIVITIES,
        Permission.EDIT_ACTIVITY,
        Permission.DELETE_ACTIVITY,

        // Pickups & Drops
        Permission.CREATE_PICKUP_DROP,
        Permission.VIEW_PICKUP_DROPS,
        Permission.EDIT_PICKUP_DROP,
        Permission.DELETE_PICKUP_DROP,

        // Categories
        Permission.CREATE_CATEGORY,
        Permission.VIEW_CATEGORIES,
        Permission.EDIT_CATEGORY,
        Permission.DELETE_CATEGORY,

        // Bookings
        Permission.VIEW_BOOKINGS,
        Permission.EDIT_BOOKING,
        Permission.DELETE_BOOKING,

        // Payments
        Permission.VIEW_PAYMENTS,
        Permission.EDIT_PAYMENT,
        Permission.DELETE_PAYMENT,

        // Enquiries
        Permission.VIEW_ENQUIRIES,
        Permission.DELETE_ENQUIRY,
        Permission.REPLY_ENQUIRY,

        // Leads
        Permission.VIEW_LEADS,
        Permission.EDIT_LEAD,
        Permission.DELETE_LEAD,

        // Reviews
        Permission.VIEW_REVIEWS,
        Permission.EDIT_REVIEW,
        Permission.DELETE_REVIEW,

        // Partners
        Permission.CREATE_PARTNER,
        Permission.VIEW_PARTNERS,
        Permission.EDIT_PARTNER,
        Permission.DELETE_PARTNER,

        // Files & Media
        Permission.UPLOAD_MEDIA,
        Permission.MANAGE_MEDIA,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Settings
        Permission.MANAGE_SETTINGS,
        Permission.VIEW_SETTINGS,

        // Analytics & Export
        Permission.VIEW_ANALYTICS,
        Permission.EXPORT_DATA,
        Permission.BULK_OPERATIONS,
    ],

    [Role.EDITOR]: [
        // Trips
        Permission.CREATE_TRIP,
        Permission.VIEW_TRIPS,
        Permission.EDIT_TRIP,
        Permission.DELETE_TRIP,

        // Blogs
        Permission.CREATE_BLOG,
        Permission.VIEW_BLOGS,
        Permission.EDIT_BLOG,
        Permission.DELETE_BLOG,

        // Destinations
        Permission.CREATE_DESTINATION,
        Permission.VIEW_DESTINATIONS,
        Permission.EDIT_DESTINATION,
        Permission.DELETE_DESTINATION,

        // Activities
        Permission.CREATE_ACTIVITY,
        Permission.VIEW_ACTIVITIES,
        Permission.EDIT_ACTIVITY,
        Permission.DELETE_ACTIVITY,

        // Pickups & Drops
        Permission.CREATE_PICKUP_DROP,
        Permission.VIEW_PICKUP_DROPS,
        Permission.EDIT_PICKUP_DROP,
        Permission.DELETE_PICKUP_DROP,

        // Categories
        Permission.CREATE_CATEGORY,
        Permission.VIEW_CATEGORIES,
        Permission.EDIT_CATEGORY,
        Permission.DELETE_CATEGORY,

        // Bookings
        Permission.VIEW_BOOKINGS,
        Permission.EDIT_BOOKING,
        Permission.DELETE_BOOKING,

        // Payments
        Permission.VIEW_PAYMENTS,
        Permission.EDIT_PAYMENT,
        Permission.DELETE_PAYMENT,

        // Enquiries
        Permission.VIEW_ENQUIRIES,
        Permission.DELETE_ENQUIRY,
        Permission.REPLY_ENQUIRY,

        // Leads
        Permission.VIEW_LEADS,
        Permission.EDIT_LEAD,
        Permission.DELETE_LEAD,

        // Reviews
        Permission.VIEW_REVIEWS,
        Permission.EDIT_REVIEW,
        Permission.DELETE_REVIEW,

        // Partners
        Permission.CREATE_PARTNER,
        Permission.VIEW_PARTNERS,
        Permission.EDIT_PARTNER,
        Permission.DELETE_PARTNER,

        // Files & Media
        Permission.UPLOAD_MEDIA,
        Permission.MANAGE_MEDIA,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Analytics & Export
        Permission.VIEW_ANALYTICS,
        Permission.EXPORT_DATA,
        Permission.BULK_OPERATIONS,
    ],

    [Role.STAFF]: [
        // Trips (only create, no update/delete)
        Permission.CREATE_TRIP,
        Permission.VIEW_TRIPS,

        // Blogs
        Permission.CREATE_BLOG,
        Permission.VIEW_BLOGS,

        // Bookings
        Permission.VIEW_BOOKINGS,
        Permission.EDIT_BOOKING,
        Permission.DELETE_BOOKING,

        // Payments
        Permission.VIEW_PAYMENTS,
        Permission.EDIT_PAYMENT,
        Permission.DELETE_PAYMENT,

        // Enquiries
        Permission.VIEW_ENQUIRIES,
        Permission.DELETE_ENQUIRY,
        Permission.REPLY_ENQUIRY,

        // Leads
        Permission.VIEW_LEADS,
        Permission.EDIT_LEAD,
        Permission.DELETE_LEAD,

        // Reviews
        Permission.VIEW_REVIEWS,
        Permission.EDIT_REVIEW,
        Permission.DELETE_REVIEW,

        // Partners
        Permission.CREATE_PARTNER,
        Permission.VIEW_PARTNERS,
        Permission.EDIT_PARTNER,
        Permission.DELETE_PARTNER,

        // Files & Media
        Permission.UPLOAD_MEDIA,
        Permission.MANAGE_MEDIA,

        // Profile
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,

        // Analytics
        Permission.VIEW_ANALYTICS,
    ],

    [Role.GUIDE]: [
        // View customer profiles only
        Permission.VIEW_USERS,
        Permission.VIEW_PROFILE,

        // View bookings to see customer information
        Permission.VIEW_BOOKINGS,
        Permission.VIEW_TRIPS,
        Permission.VIEW_REVIEWS,
    ],

    [Role.TOUR_OPERATOR]: [
        Permission.VIEW_USERS,
        Permission.CREATE_TRIP,
        Permission.EDIT_TRIP,
        Permission.VIEW_TRIPS,
        Permission.VIEW_BLOGS,
        Permission.VIEW_ANALYTICS,
        Permission.EXPORT_DATA,
        Permission.VIEW_REVIEWS,
    ],

    [Role.USER]: [
        Permission.VIEW_TRIPS,
        Permission.VIEW_BLOGS,
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_REVIEWS,
    ],

    [Role.TRAVELLER]: [
        Permission.VIEW_TRIPS,
        Permission.VIEW_BLOGS,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_PROFILE,
        Permission.EDIT_PROFILE,
        Permission.VIEW_REVIEWS,
    ],
};

export const PERMISSION_GROUPS = {
    USERS: [
        Permission.MANAGE_USERS,
        Permission.VIEW_USERS,
        Permission.CREATE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,
    ],
    TRIPS: [
        Permission.CREATE_TRIP,
        Permission.VIEW_TRIPS,
        Permission.EDIT_TRIP,
        Permission.DELETE_TRIP,
    ],
    BLOGS: [
        Permission.CREATE_BLOG,
        Permission.VIEW_BLOGS,
        Permission.EDIT_BLOG,
        Permission.DELETE_BLOG,
    ],
    DESTINATIONS: [
        Permission.CREATE_DESTINATION,
        Permission.VIEW_DESTINATIONS,
        Permission.EDIT_DESTINATION,
        Permission.DELETE_DESTINATION,
    ],
    ACTIVITIES: [
        Permission.CREATE_ACTIVITY,
        Permission.VIEW_ACTIVITIES,
        Permission.EDIT_ACTIVITY,
        Permission.DELETE_ACTIVITY,
    ],
    PICKUP_DROPS: [
        Permission.CREATE_PICKUP_DROP,
        Permission.VIEW_PICKUP_DROPS,
        Permission.EDIT_PICKUP_DROP,
        Permission.DELETE_PICKUP_DROP,
    ],
    CATEGORIES: [
        Permission.CREATE_CATEGORY,
        Permission.VIEW_CATEGORIES,
        Permission.EDIT_CATEGORY,
        Permission.DELETE_CATEGORY,
    ],
    BOOKINGS: [
        Permission.VIEW_BOOKINGS,
        Permission.EDIT_BOOKING,
        Permission.DELETE_BOOKING,
    ],
    PAYMENTS: [
        Permission.VIEW_PAYMENTS,
        Permission.EDIT_PAYMENT,
        Permission.DELETE_PAYMENT,
    ],
    ENQUIRIES: [
        Permission.VIEW_ENQUIRIES,
        Permission.DELETE_ENQUIRY,
        Permission.REPLY_ENQUIRY,
    ],
    LEADS: [
        Permission.VIEW_LEADS,
        Permission.EDIT_LEAD,
        Permission.DELETE_LEAD,
    ],
    REVIEWS: [
        Permission.VIEW_REVIEWS,
        Permission.EDIT_REVIEW,
        Permission.DELETE_REVIEW,
    ],
    PARTNERS: [
        Permission.CREATE_PARTNER,
        Permission.VIEW_PARTNERS,
        Permission.EDIT_PARTNER,
        Permission.DELETE_PARTNER,
    ],
    MEDIA: [Permission.UPLOAD_MEDIA, Permission.MANAGE_MEDIA],
    PROFILE: [Permission.VIEW_PROFILE, Permission.EDIT_PROFILE],
    SETTINGS: [Permission.MANAGE_SETTINGS, Permission.VIEW_SETTINGS],
    SYSTEM: [
        Permission.VIEW_ANALYTICS,
        Permission.EXPORT_DATA,
        Permission.BULK_OPERATIONS,
        Permission.MANAGE_SYSTEM,
    ],
};

export const PERMISSION_DESCRIPTIONS = {
    // Users
    [Permission.MANAGE_USERS]: 'Full user management access',
    [Permission.VIEW_USERS]: 'View user list and details',
    [Permission.CREATE_USER]: 'Create new users',
    [Permission.UPDATE_USER]: 'Update user information',
    [Permission.DELETE_USER]: 'Delete users',

    // Trips
    [Permission.CREATE_TRIP]: 'Create new trips',
    [Permission.VIEW_TRIPS]: 'View trips',
    [Permission.EDIT_TRIP]: 'Edit trip details',
    [Permission.DELETE_TRIP]: 'Delete trips',

    // Blogs
    [Permission.CREATE_BLOG]: 'Create new blog',
    [Permission.VIEW_BLOGS]: 'View blogs',
    [Permission.EDIT_BLOG]: 'Edit blog details',
    [Permission.DELETE_BLOG]: 'Delete blog',

    // Destinations
    [Permission.CREATE_DESTINATION]: 'Create destinations',
    [Permission.VIEW_DESTINATIONS]: 'View destinations',
    [Permission.EDIT_DESTINATION]: 'Edit destinations',
    [Permission.DELETE_DESTINATION]: 'Delete destinations',

    // Activities
    [Permission.CREATE_ACTIVITY]: 'Create activities',
    [Permission.VIEW_ACTIVITIES]: 'View activities',
    [Permission.EDIT_ACTIVITY]: 'Edit activities',
    [Permission.DELETE_ACTIVITY]: 'Delete activities',

    // Pickups & Drops
    [Permission.CREATE_PICKUP_DROP]: 'Create pickup/drop points',
    [Permission.VIEW_PICKUP_DROPS]: 'View pickup/drop points',
    [Permission.EDIT_PICKUP_DROP]: 'Edit pickup/drop points',
    [Permission.DELETE_PICKUP_DROP]: 'Delete pickup/drop points',

    // Categories
    [Permission.CREATE_CATEGORY]: 'Create categories',
    [Permission.VIEW_CATEGORIES]: 'View categories',
    [Permission.EDIT_CATEGORY]: 'Edit categories',
    [Permission.DELETE_CATEGORY]: 'Delete categories',

    // Bookings
    [Permission.VIEW_BOOKINGS]: 'View bookings',
    [Permission.EDIT_BOOKING]: 'Edit/update bookings',
    [Permission.DELETE_BOOKING]: 'Delete bookings',

    // Payments
    [Permission.VIEW_PAYMENTS]: 'View payment records',
    [Permission.EDIT_PAYMENT]: 'Edit/update payments',
    [Permission.DELETE_PAYMENT]: 'Delete payment records',

    // Enquiries
    [Permission.VIEW_ENQUIRIES]: 'View enquiries',
    [Permission.DELETE_ENQUIRY]: 'Delete enquiries',
    [Permission.REPLY_ENQUIRY]: 'Reply to enquiries',

    // Leads
    [Permission.VIEW_LEADS]: 'View leads',
    [Permission.EDIT_LEAD]: 'Edit/update leads',
    [Permission.DELETE_LEAD]: 'Delete leads',

    // Reviews
    [Permission.VIEW_REVIEWS]: 'View reviews',
    [Permission.EDIT_REVIEW]: 'Edit/update reviews',
    [Permission.DELETE_REVIEW]: 'Delete reviews',

    // Partners
    [Permission.CREATE_PARTNER]: 'Create partners',
    [Permission.VIEW_PARTNERS]: 'View partners',
    [Permission.EDIT_PARTNER]: 'Edit partners',
    [Permission.DELETE_PARTNER]: 'Delete partners',

    // Files & Media
    [Permission.UPLOAD_MEDIA]: 'Upload images and files',
    [Permission.MANAGE_MEDIA]: 'Manage media library',

    // Profile
    [Permission.VIEW_PROFILE]: 'View own profile',
    [Permission.EDIT_PROFILE]: 'Edit own profile',

    // Settings
    [Permission.MANAGE_SETTINGS]: 'Manage system settings',
    [Permission.VIEW_SETTINGS]: 'View system settings',

    // System
    [Permission.VIEW_ANALYTICS]: 'View analytics and reports',
    [Permission.EXPORT_DATA]: 'Export data',
    [Permission.BULK_OPERATIONS]: 'Perform bulk operations',
    [Permission.MANAGE_SYSTEM]: 'System administration',
};

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

// Helper function to check if user has all the permissions
export const hasAllPermissions = (userRole, permissions) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.every(permission =>
        rolePermissions.includes(permission)
    );
};

