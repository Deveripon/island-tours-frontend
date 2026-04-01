import { Permission } from '@/RBAC.config';
import { StarAwardIcon } from '@hugeicons/core-free-icons';
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
    Settings05Icon,
    UserAccountIcon,
    UserCircleIcon,
    UserGroupIcon,
    UserSharingIcon,
    VanIcon
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
    ZapIcon,
} from 'lucide-react';
// Dutch navigations object with RBAC permissions
export const NlNavigations = {
    dashboardB2B: [
        {
            title: 'Reisbeheer',
            url: '#',
            icon: Airplane01Icon,
            isActive: true,
            requiredPermissions: [Permission.VIEW_TRIPS],
            items: [
                {
                    title: 'Alle Affiliate Reizen',
                    url: 'all-affiliate-trips',
                    icon: Airplane01Icon,
                    requiredPermissions: [Permission.VIEW_TRIPS],
                },
                {
                    title: 'Nieuwe Affiliate Toevoegen',
                    url: 'create-affiliate-trips',
                    icon: AddSquareIcon,
                    requiredPermissions: [Permission.CREATE_TRIP],
                },
                {
                    title: 'Bestemmingen',
                    url: 'destinations',
                    icon: MapPinpoint01Icon,
                    requiredPermissions: [Permission.VIEW_DESTINATIONS],
                },
                {
                    title: 'Activiteiten',
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
                    title: 'Categorieën',
                    url: 'categories',
                    icon: FoldersIcon,
                    requiredPermissions: [Permission.VIEW_CATEGORIES],
                },
            ],
        },

        {
            title: 'Boekingen en Betaling',
            url: '#',
            icon: Appointment01Icon,
            requiredPermissions: [Permission.VIEW_BOOKINGS, Permission.VIEW_PAYMENTS],
            items: [
                {
                    title: 'Boekingen',
                    url: 'bookings',
                    icon: Appointment01Icon,
                    requiredPermissions: [Permission.VIEW_BOOKINGS],
                },
                {
                    title: 'Betalingen',
                    url: 'payments',
                    icon: Invoice02Icon,
                    requiredPermissions: [Permission.VIEW_PAYMENTS],
                },
            ],
        },
        {
            title: 'Klanten',
            url: 'customers',
            icon: UserGroupIcon,
            requiredPermissions: [Permission.VIEW_USERS],
        },
        {
            title: 'Aanvragen',
            url: 'enquires',
            icon: Mail02Icon,
            requiredPermissions: [Permission.VIEW_ENQUIRIES],
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
            title: 'Reviews',
            url: 'reviews',
            icon: StarAwardIcon,
            requiredPermissions: [Permission.VIEW_REVIEWS],
            items: [],
        },
        {
            title: 'Tourpartners',
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
                    title: 'Alle Blogs',
                    url: 'blogs',
                    icon: NewsIcon,
                    requiredPermissions: [Permission.VIEW_BLOGS],
                },
                {
                    title: 'Nieuwe Blog Toevoegen',
                    url: 'create-blog',
                    icon: LicenseDraftIcon,
                    requiredPermissions: [Permission.CREATE_BLOG],
                },
            ],
        },
        {
            title: 'Bestanden & Media',
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
            title: 'Gebruikers',
            url: '#',
            icon: UserCircleIcon,
            requiredPermissions: [Permission.VIEW_USERS, Permission.MANAGE_USERS],
            items: [
                {
                    title: 'Alle gebruikers',
                    url: 'all-user',
                    icon: UserCircleIcon,
                    requiredPermissions: [Permission.VIEW_USERS],
                    items: [],
                },
                {
                    title: 'Profiel',
                    url: 'profile',
                    icon: UserAccountIcon,
                    requiredPermissions: [Permission.VIEW_PROFILE],
                    items: [],
                },
            ],
        },
        {
            title: 'Instellingen',
            url: '#',
            icon: Settings05Icon,
            requiredPermissions: [Permission.VIEW_SETTINGS, Permission.MANAGE_SETTINGS],
            items: [
                {
                    title: 'Algemene Instellingen',
                    url: 'site-settings',
                    icon: Settings05Icon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Betaalmethoden',
                    url: 'payment-methods',
                    icon: CreditCardPosIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Contact & Facturering',
                    url: 'contacts-billings',
                    icon: InvoiceIcon,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                    items: [],
                },

                {
                    title: 'API en referenties',
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
            title: 'Mijn Boekingen',
            url: 'my-bookings',
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
        {
            title: 'Betaling en Factuur',
            url: 'my-payments',
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
    ],
    profileSettings: [
        {
            title: 'Instellingen',
            url: '#',
            icon: Settings2Icon,
            requiredPermissions: [Permission.VIEW_SETTINGS, Permission.VIEW_PROFILE],
            items: [
                {
                    title: 'Betaalmethoden',
                    url: 'payment-methods',
                    icon: Landmark,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Instellingen & Facturering',
                    url: 'settings-billings',
                    icon: Settings,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                    items: [],
                },
                {
                    title: 'Site Instellingen',
                    url: 'site-settings',
                    icon: AppWindow,
                    requiredPermissions: [Permission.MANAGE_SETTINGS],
                },
                {
                    title: 'Taalinstellingen',
                    url: 'language-settings',
                    icon: Globe,
                    requiredPermissions: [Permission.VIEW_PROFILE],
                },
                {
                    title: 'Wachtwoord Wijzigen',
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
                name: 'Privacybeleid',
                url: '/privacy',
                icon: Lock,
            },
            {
                name: 'Algemene Voorwaarden',
                url: '/terms',
                icon: FileText,
            },
            {
                name: 'Cookiebeleid',
                url: '/cookie-policy',
                icon: Cookie,
            },
        ],
    },
    mainNavigations: [
        {
            name: 'Functies',
            url: '/#features',
            icon: SquareChartGantt,
            items: [
                {
                    name: 'Website Bouwer',
                    url: '/website-builder',
                    icon: AppWindowMac,
                },
                {
                    name: 'Omzet Verhogen',
                    url: '/grow-revenue',
                    icon: DollarSignIcon,
                },
                {
                    name: 'Gedetailleerd Reisschema',
                    url: '/detailed-itinerary',
                    icon: Route,
                },
                {
                    name: 'Rapporten en Analytics',
                    url: '/reports-analytics',
                    icon: SquareChartGantt,
                },
                {
                    name: 'Teambeheer',
                    url: '/team-management',
                    icon: Users2,
                },
                {
                    name: 'Betaalpoorten',
                    url: '/payment-gateways',
                    icon: CreditCardIcon,
                },
            ],
        },
        {
            name: 'Demo',
            url: `${process.env.NEXT_PUBLIC_DEMO_SITE_URL}`,
            icon: Monitor,
        },
        {
            name: 'Prijzen',
            url: '/#pricing',
            icon: DollarSign,
        },
        {
            name: 'Veelgestelde Vragen',
            url: '/#faq',
            icon: HelpCircle,
        },
        {
            name: 'Bronnen',
            url: '/#resourses',
            icon: Headphones,
            items: [
                {
                    name: 'Partner worden met TripWheel',
                    url: '/partner',
                    icon: UserPlus,
                },
                {
                    name: 'Nieuws en Updates',
                    url: '/news-updates',
                    icon: Rss,
                },
                {
                    name: 'Tutorials',
                    url: '/tutorials',
                    icon: Video,
                },
                {
                    name: 'Ondersteuning',
                    url: '/support',
                    icon: HelpCircle,
                },
                {
                    name: 'Documentatie',
                    url: '/documentation',
                    icon: Notebook,
                },
                {
                    name: 'Functieverzoek',
                    url: '/feature-request',
                    icon: LayoutPanelLeft,
                },
            ],
        },
    ],
    dashboardVerticalMenu: [
        {
            title: 'Documentatie',
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
            title: 'Gemeenschap',
            url: '#',
            icon: Users2,
            requiredPermissions: [Permission.VIEW_PROFILE],
        },
    ],
};

// Default export of the navigations object
export default NlNavigations;
