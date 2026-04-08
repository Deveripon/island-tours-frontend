'use client';

import {
    Building03Icon,
    CreditCardIcon,
    Globe02Icon,
    Notification03Icon,
} from '@hugeicons/core-free-icons';
import { useCallback, useEffect, useState } from 'react';
import BillingInformation from './sections/billing-information';
import CompanyInformation from './sections/company-information';
import LanguageSettings from './sections/language-settings';
import NotificationPreference from './sections/notification-preference';
import SectionTabs from './tabs';

const formSections = [
    {
        id: 'company',
        label: 'Company',
        icon: Building03Icon,
        description: 'Company Information',
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: CreditCardIcon,
        description: 'Billing Information',
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: Notification03Icon,
        description: 'Notification Preferences',
    },
    {
        id: 'language',
        label: 'Language',
        icon: Globe02Icon,
        description: 'Language Settings',
    },
];

const SettingsAndBilling = ({ data }) => {
    const [activeTab, setActiveTab] = useState('company');

    useEffect(() => {
        const savedTab = localStorage.getItem('settingsActiveTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    const handleTabChange = useCallback(tabId => {
        localStorage.setItem('settingsActiveTab', tabId);
        setActiveTab(tabId);
    }, []);

    const renderTab = () => {
        switch (activeTab) {
            case 'company':
                return <CompanyInformation data={data?.companyInformations} />;
            case 'billing':
                return <BillingInformation data={data?.billingInformations} />;
            case 'notifications':
                return (
                    <NotificationPreference
                        data={data?.notificationPreferences}
                    />
                );
            case 'language':
                return <LanguageSettings />;
            default:
                return <CompanyInformation data={data?.companyInformations} />;
        }
    };

    return (
        <div className='flex flex-auto'>
            <div className='w-full'>
                <div className='grid grid-cols-12 my-8'>
                    <SectionTabs
                        formSections={formSections}
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        className='col-span-12 lg:col-span-3 xl:col-span-2 rounded-tr-none border-r-0'
                    />

                    <div className='col-span-12 min-h-[600px] lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'>
                        {renderTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsAndBilling;
