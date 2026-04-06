'use client';

import {
    updateBillingInformation,
    updateCompanyInfo,
    updateNotificationPreferences,
} from '@/app/_actions/settingsActions';
import {
    Building03Icon,
    CreditCardIcon,
    Globe02Icon,
    Notification03Icon,
} from '@hugeicons/core-free-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import BillingInformation from './sections/billing-information';
import CompanyInformation from './sections/company-information';
import LanguageSettings from './sections/language-settings';
import NotificationPreference from './sections/notification-preference';
import SectionTabs from './tabs';

const SettingsAndBilling = ({ data }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [activeTab, setActiveTab] = useState('company');

    useEffect(() => {
        const savedTab = localStorage.getItem('settingsActiveTab');
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    const company = data?.companyInformations;
    const billing = data?.billingInformations;
    const notifications = data?.notificationPreferences;

    const { control, getValues, trigger, resetField, reset } = useForm({
        defaultValues: {
            companyName: company?.companyName || '',
            companyEmail: company?.companyEmail || '',
            companyPhone: company?.companyPhone || '',
            companyWebsite: company?.companyWebsite || '',
            companyAddress: company?.companyAddress || '',
            companyCity: company?.companyCity || '',
            companyState: company?.companyState || '',
            companyZip: company?.companyZip || '',
            companyCountry: company?.companyCountry || '',
            companyVat: company?.companyVat || '',
            companySize: company?.companySize || '',
            billingName: billing?.billingName || '',
            billingEmail: billing?.billingEmail || '',
            billingAddress: billing?.billingAddress || '',
            billingCity: billing?.billingCity || '',
            billingState: billing?.billingState || '',
            billingZip: billing?.billingZip || '',
            billingCountry: billing?.billingCountry || '',
            emailNotifications: notifications?.emailNotifications || true,
            smsNotifications: notifications?.smsNotifications || false,
            marketingEmails: notifications?.marketingEmails || false,
            securityAlerts: notifications?.securityAlerts || true,
            billingAlerts: notifications?.billingAlerts || true,
        },
    });

    const formValidationRules = useMemo(
        () => ({
            companyName: {
                required: 'Company name is required',
                minLength: {
                    value: 2,
                    message: 'Company name must be at least 2 characters',
                },
            },
            companyEmail: {
                required: 'Company email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                },
            },
            companyWebsite: {
                pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Invalid website URL',
                },
            },
            companyVat: {
                pattern: {
                    value: /^[A-Z]{2}[0-9A-Z]+$/,
                    message: 'Invalid VAT number format',
                },
            },
            billingName: {
                required: 'Billing name is required',
            },
            billingEmail: {
                required: 'Billing email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                },
            },
        }),
        []
    );

    const companySizeOptions = useMemo(
        () => [
            { label: '1-10 employees', value: '1-10' },
            { label: '11-50 employees', value: '11-50' },
            { label: '51-200 employees', value: '51-200' },
            { label: '201-500 employees', value: '201-500' },
            { label: '501-1000 employees', value: '501-1000' },
            { label: '1000+ employees', value: '1000+' },
        ],
        []
    );

    const updateChangesToDb = useCallback(
        async (fieldId, explicitValue) => {
            try {
                setIsSaving(true);
                const formField = fieldId;
                const value =
                    explicitValue !== null
                        ? explicitValue
                        : getValues(formField);

                const notificationFields = [
                    'emailNotifications',
                    'smsNotifications',
                    'marketingEmails',
                    'securityAlerts',
                    'billingAlerts',
                ];
                const companyFields = [
                    'companyName',
                    'companyEmail',
                    'companyPhone',
                    'companyWebsite',
                    'companyAddress',
                    'companyCity',
                    'companyState',
                    'companyZip',
                    'companyCountry',
                    'companyVat',
                    'companySize',
                ];
                const billingFields = [
                    'billingName',
                    'billingEmail',
                    'billingAddress',
                    'billingCity',
                    'billingState',
                    'billingZip',
                    'billingCountry',
                ];

                setEditingField(null);

                let result;

                if (notificationFields.includes(fieldId)) {
                    result = await updateNotificationPreferences({
                        [fieldId]: value,
                    });
                } else if (companyFields.includes(fieldId)) {
                    result = await updateCompanyInfo({
                        [fieldId]: value,
                    });
                } else if (billingFields.includes(fieldId)) {
                    result = await updateBillingInformation({
                        [fieldId]: value,
                    });
                }

                if (result && !result.success) {
                    return;
                }
            } catch (err) {
                // Optional: Show error message to user
            } finally {
                setIsSaving(false);
            }
        },
        [getValues, setIsSaving, setEditingField]
    );

    const handleSaveField = useCallback(
        async (fieldId, explicitValue = null) => {
            const formField = fieldId;

            if (explicitValue === null) {
                const isValid = await trigger(formField);
                if (!isValid) {
                    return;
                }
            }

            setEditingField(null);
            await updateChangesToDb(fieldId, explicitValue);
        },
        [trigger, setEditingField, updateChangesToDb]
    );

    const syncResponseWithFormData = useCallback(
        data => {
            const company = data?.companyInformations;
            const billing = data?.billingInformations;
            const notifications = data?.notificationPreferences;

            reset({
                companyName: company?.companyName || '',
                companyEmail: company?.companyEmail || '',
                companyPhone: company?.companyPhone || '',
                companyWebsite: company?.companyWebsite || '',
                companyAddress: company?.companyAddress || '',
                companyCity: company?.companyCity || '',
                companyState: company?.companyState || '',
                companyZip: company?.companyZip || '',
                companyCountry: company?.companyCountry || '',
                companyVat: company?.companyVat || '',
                companySize: company?.companySize || '',
                billingName: billing?.billingName || '',
                billingEmail: billing?.billingEmail || '',
                billingAddress: billing?.billingAddress || '',
                billingCity: billing?.billingCity || '',
                billingState: billing?.billingState || '',
                billingZip: billing?.billingZip || '',
                billingCountry: billing?.billingCountry || '',
                emailNotifications: notifications?.emailNotifications ?? true,
                smsNotifications: notifications?.smsNotifications ?? false,
                marketingEmails: notifications?.marketingEmails ?? false,
                securityAlerts: notifications?.securityAlerts ?? true,
                billingAlerts: notifications?.billingAlerts ?? true,
            });
        },
        [reset]
    );

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

    const SECTION_COMPONENTS = useMemo(
        () => ({
            company: (
                <CompanyInformation
                    control={control}
                    formValidationRules={formValidationRules}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    handleSaveField={handleSaveField}
                    isSaving={isSaving}
                    resetField={resetField}
                    companySizeOptions={companySizeOptions}
                />
            ),
            billing: (
                <BillingInformation
                    control={control}
                    formValidationRules={formValidationRules}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    handleSaveField={handleSaveField}
                    isSaving={isSaving}
                    resetField={resetField}
                />
            ),
            notifications: (
                <NotificationPreference
                    control={control}
                    handleSaveField={handleSaveField}
                    isSaving={isSaving}
                />
            ),
            language: <LanguageSettings />,
        }),
        [
            control,
            formValidationRules,
            editingField,
            handleSaveField,
            isSaving,
            resetField,
            companySizeOptions,
        ]
    );

    const renderFormSection = useCallback(() => {
        return SECTION_COMPONENTS[activeTab] || SECTION_COMPONENTS.company;
    }, [SECTION_COMPONENTS, activeTab]);

    const handleTabChange = useCallback(tabId => {
        localStorage.setItem('settingsActiveTab', tabId);
        setActiveTab(tabId);
    }, []);

    useEffect(() => {
        if (data) {
            syncResponseWithFormData(data);
        }
    }, [data, syncResponseWithFormData]);

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
                        {renderFormSection()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsAndBilling;

