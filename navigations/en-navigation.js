import { Permission } from '@/RBAC.config';
import {
    Activity02Icon,
    AddSquareIcon, AiMagicIcon, Airplane01Icon,
    Appointment01Icon,
    CreditCardPosIcon,
    FolderDetailsIcon,
    FoldersIcon,
    Invoice02Icon,
    InvoiceIcon,
    LicenseDraftIcon,
    LockKeyIcon,
    Mail02Icon,
    MapPinpoint01Icon,
    NewsIcon,
    Settings05Icon, StarAwardIcon, UserAccountIcon,
    UserCircleIcon,
    UserGroupIcon,
    UserSharingIcon,
    VanIcon,
    ZapIcon
} from '@hugeicons/core-free-icons';
import {
    AppWindow,
    AppWindowMac,
    Cookie,
    CreditCardIcon,
    DollarSign,
    DollarSignIcon,
    Facebook,
    FileText,
    Globe,
    Headphones,
    HelpCircle,
    Instagram,
    KeyRound,
    Landmark,
    LayoutPanelLeft,
    Linkedin,
    Lock,
    Monitor,
    Notebook,
    Route,
    Rss,
    Settings,
    Settings2Icon,
    SquareChartGantt,
    Twitter,
    UserPlus,
    Users2,
    Video,
} from 'lucide-react';

// Original navigations object with icons and RBAC permissions
export const enNavigations = {
    dashboardB2B: [
        {
            title: 'Trips Management',
            url: 'all-affiliate-trips',
            icon: Airplane01Icon,
            isActive: true,
            requiredPermissions: [Permission.VIEW_TRIPS],
            items: [
                {
                    title: 'All Trips',
                    url: 'all-affiliate-trips',
                    icon: Airplane01Icon,
                    requiredPermissions: [Permission.VIEW_TRIPS],
                },
                {
                    title: 'Add New Trip',
                    url: 'create-affiliate-trips',
                    icon: AddSquareIcon,
                    requiredPermissions: [Permission.CREATE_TRIP],
                },
                {
                    title: 'Destinations',
                    url: 'destinations',
                    icon: MapPinpoint01Icon,
                    requiredPermissions: [Permission.VIEW_DESTINATIONS],
                },
                {
                    title: 'Activities',
                    url: 'activities',
                    icon: Activity02Icon,
                    requiredPermissions: [Permission.VIEW_ACTIVITIES],
                },
                {
                    title: 'Picups & Drops',
                    url: 'pickups-drops',
                    icon: VanIcon,
                    requiredPermissions: [Permission.VIEW_PICKUP_DROPS],
                },
                {
                    title: 'Categories',
                    url: 'categories',
                    icon: FoldersIcon,
                    requiredPermissions: [Permission.VIEW_CATEGORIES],
                },
            ],
        },
        {
            title: 'Bookings And Payment',
            url: '#',
            icon: Appointment01Icon,
            requiredPermissions: [Permission.VIEW_BOOKINGS, Permission.VIEW_PAYMENTS],
            items: [
                {
                    title: 'Bookings',
                    url: 'bookings',
                    icon: Appointment01Icon,
                    requiredPermissions: [Permission.VIEW_BOOKINGS],
                },
                {
                    title: 'Payments',
                    url: 'payments',
                    icon: Invoice02Icon,
                    requiredPermissions: [Permission.VIEW_PAYMENTS],
                },
            ],
        },
        {
            title: 'Customers',
            url: 'customers',
            icon: UserGroupIcon,
            requiredPermissions: [Permission.VIEW_USERS],
        },
        {
            title: 'Inquiries',
            url: 'inquiries',
            icon: Mail02Icon,
            requiredPermissions: [Permission.VIEW_ENQUIRIES],
            items: [],
        },
        {
            title: 'Reviews',
            url: 'reviews',
            icon: StarAwardIcon,
            requiredPermissions: [Permission.VIEW_REVIEWS],
            items: [],
        },
        {
            title: 'Leads',
            url: 'leads',
            icon: UserSharingIcon,
            requiredPermissions: [Permission.VIEW_LEADS],
            items: [],
        },
        {
            title: 'Tour Partners',
            url: 'tour-operators',
            icon: UserAccountIcon,
            isActive: false,
            requiredPermissions: [Permission.VIEW_PARTNERS],
            items: [],
        },
        {
            title: 'Blogs',
            url: 'blogs',
            icon: NewsIcon,
            isActive: false,
            requiredPermissions: [Permission.VIEW_BLOGS],
            items: [
                {
                    title: 'All Blogs',
                    url: 'blogs',
                    icon: NewsIcon,
                    requiredPermissions: [Permission.VIEW_BLOGS],
                },
                {
                    title: 'Add New Blog',
                    url: 'create-blog',
                    icon: LicenseDraftIcon,
                    requiredPermissions: [Permission.CREATE_BLOG],
                },
            ],
        },
        {
            title: 'Files & Media',
            url: 'media',
            icon: FolderDetailsIcon,
            requiredPermissions: [Permission.MANAGE_MEDIA],
        },

        {
            title: 'AI Image',
            url: 'ai-image',
            icon: AiMagicIcon,
            requiredPermissions: [Permission.MANAGE_MEDIA],
        },

        {
            title: 'Users',
            url: '#',
            icon: UserCircleIcon,
            requiredPermissions: [Permission.VIEW_USERS, Permission.MANAGE_USERS],
            items: [
                {
                    title: 'All Users',
                    url: 'all-user',
                    icon: UserCircleIcon,
                    requiredPermissions: [Permission.VIEW_USERS],
                    items: [],
                },
                {
                    title: 'Profile',
                    url: 'profile',
                    icon: UserAccountIcon,
                    requiredPermissions: [Permission.VIEW_PROFILE],
                    items: [],
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings05Icon,
            requiredPermissions: [Permission.VIEW_SETTINGS, Permission.MANAGE_SETTINGS],
            items: [
                {
                    title: 'General Settings',
                    url: 'site-settings',
                    icon: Settings05Icon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Payment Methods',
                    url: 'payment-methods',
                    icon: CreditCardPosIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Contact & Billing',
                    url: 'contacts-billings',
                    icon: InvoiceIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                    items: [],
                },

                {
                    title: 'API & Credentials',
                    url: 'credentials',
                    icon: LockKeyIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Integrations',
                    url: 'automation',
                    icon: ZapIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
            ],
        },
    ],
    dashboardSuperAdmin: [

        {
            title: 'Users',
            url: 'users',
            icon: UserGroupIcon,
            isActive: true,
            requiredPermissions: [Permission.MANAGE_SYSTEM],
        },
    ],
    dashboardB2C: [
        {
            title: 'Dashboard',
            url: '/',
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
        {
            title: 'My Bookings',
            url: 'my-bookings',
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
        {
            title: 'Payment and Invoice',
            url: 'my-payments',
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
    ],
    profileSettings: [
        {
            title: 'Settings',
            url: '#',
            icon: Settings2Icon,
            requiredPermissions: [Permission.VIEW_SETTINGS, Permission.VIEW_PROFILE],
            items: [
                {
                    title: 'Payment Methods',
                    url: 'payment-methods',
                    icon: Landmark,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Settings & Billing',
                    url: 'settings-billings',
                    icon: Settings,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                    items: [],
                },
                {
                    title: 'Site Settings',
                    url: 'site-settings',
                    icon: AppWindow,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Language Settings',
                    url: 'language-settings',
                    icon: Globe,
                    requiredPermissions: [Permission.VIEW_PROFILE],
                },
                {
                    title: 'Change Password',
                    url: 'change-password',
                    icon: KeyRound,
                    requiredPermissions: [Permission.EDIT_PROFILE],
                },
                {
                    title: 'Zapier Integration',
                    url: 'zapier',
                    icon: ZapIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
            ],
        },
    ],
    socialLinks: [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com',
            icon: Facebook,
            // No permissions needed - public links
        },
        {
            name: 'Twitter',
            url: 'https://www.twitter.com',
            icon: Twitter,
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com',
            icon: Instagram,
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com',
            icon: Linkedin,
        },
    ],
    legalLinks: {
        items: [
            {
                name: 'Privacy Policy',
                url: '/privacy',
                icon: Lock,
                // No permissions needed - public links
            },
            {
                name: 'Terms and Conditions',
                url: '/terms',
                icon: FileText,
            },
            {
                name: 'Cookie Policy',
                url: '/cookie-policy',
                icon: Cookie,
            },
        ],
    },
    mainNavigations: [
        {
            name: 'Features',
            url: '/#features',
            icon: SquareChartGantt,
            // No permissions needed - public navigation
            items: [
                {
                    name: 'Website Builder',
                    url: '/website-builder',
                    icon: AppWindowMac,
                },
                {
                    name: 'Grow Revenue',
                    url: '/grow-revenue',
                    icon: DollarSignIcon,
                },
                {
                    name: 'Detailed Itinerary',
                    url: '/detailed-itinerary',
                    icon: Route,
                },
                {
                    name: 'Reports and Analytics',
                    url: '/reports-analytics',
                    icon: SquareChartGantt,
                },
                {
                    name: 'Team Management',
                    url: '/team-management',
                    icon: Users2,
                },
                {
                    name: 'Payment Gateways',
                    url: '/payment-gateways',
                    icon: CreditCardIcon,
                },
            ],
        },
        {
            name: 'Demo',
            url: `/demo`,
            icon: Monitor,
        },
        {
            name: 'Pricing',
            url: '/#pricing',
            icon: DollarSign,
        },
        {
            name: 'FAQ',
            url: '/#faq',
            icon: HelpCircle,
        },
        {
            name: 'Resourses',
            url: '/#resourses',
            icon: Headphones,
            items: [
                {
                    name: 'Partner with TripWheel',
                    url: '/partner',
                    icon: UserPlus,
                },
                {
                    name: 'News and Updates',
                    url: '/news-updates',
                    icon: Rss,
                },
                {
                    name: 'Tutorials',
                    url: '/tutorials',
                    icon: Video,
                },
                {
                    name: 'Support',
                    url: '/support',
                    icon: HelpCircle,
                },
                {
                    name: 'Documentation',
                    url: '/documentation',
                    icon: Notebook,
                },
                {
                    name: 'Feature Request',
                    url: '/feature-request',
                    icon: LayoutPanelLeft,
                },
            ],
        },
    ],
    dashboardVerticalMenu: [
        {
            title: 'Documentation',
            url: '/documentation',
            icon: SquareChartGantt,
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
        {
            title: 'Tutorials',
            url: '/tutorials',
            icon: Video,
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
        {
            title: 'Community',
            url: '#',
            icon: Users2,
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
    ],
};

// Default export of the navigations object
export default enNavigations;
