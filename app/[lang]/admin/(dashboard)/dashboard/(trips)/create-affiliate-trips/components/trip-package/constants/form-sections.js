import {
    Calendar01Icon,
    InformationCircleIcon,
    Leaf01Icon,
    PackageIcon,
    Wallet01Icon,
} from '@hugeicons/core-free-icons';
import { BasicInfoForm } from '../basic-info-form';
import { CustomizationForm } from '../customisation-form';
import { DatesAvailabilityForm } from '../date-availability-form';
import { PricingForm } from '../pricing-form';
import { TripSeoForm } from '../trip-seo-configuration';

export const formSections = [
    {
        id: 'basic',
        label: 'Basic Info & Categories',
        Component: BasicInfoForm,
        icon: InformationCircleIcon,
        description: 'Essential tour information',
        number: 1,
    },
    {
        id: 'dates',
        label: 'Dates & Availability',
        Component: DatesAvailabilityForm,
        icon: Calendar01Icon,
        description: 'Schedule and availability',
        number: 2,
    },
    {
        id: 'pricing',
        label: 'Pricing',
        Component: PricingForm,
        icon: Wallet01Icon,
        description: 'Tour pricing and packages',
        number: 3,
    },
    {
        id: 'additional',
        label: 'Additional Options',
        Component: CustomizationForm,
        icon: PackageIcon,
        description: 'Tour additional options',
        number: 4,
    },
    {
        id: 'seo',
        label: 'Trip SEO Information',
        Component: TripSeoForm,
        icon: Leaf01Icon,
        description: 'Trip SEO information',
        number: 5,
    },
];
