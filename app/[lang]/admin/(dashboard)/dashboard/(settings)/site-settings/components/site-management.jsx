'use client';

import {
    updateSiteInfo,
    updateSiteSeo,
    updateSiteTheme,
    updateSMTPConfig,
    updateSocialMedia,
} from '@/app/_actions/settingsActions';
import {
    Globe02Icon,
    Leaf01Icon,
    Link01Icon,
    Mail01Icon,
    PaintBoardIcon,
    Search01Icon,
} from '@hugeicons/core-free-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import AdvancedSeo from './sections/advanced-seo';
import BrandingInformation from './sections/branding-information';
import SeoInformation from './sections/seo-information';
import SiteInformation from './sections/site-information';
import SMTPSettings from './sections/smtp-settings';
import SocialMedia from './sections/social-media';
import SectionTabs from './tabs';

const SiteManagement = ({ data }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [activeTab, setActiveTab] = useState('site');
    const { siteInfo, smtp, siteSEO, siteTheme, socialMedia } = data;

    const defaultValues = useMemo(
        () => ({
            // Site Information
            siteName: siteInfo?.siteName || '',
            siteTagline: siteInfo?.siteTagline || '',
            siteDescription: siteInfo?.siteDescription || '',
            bookingForm: siteInfo?.bookingForm || 'v2',
            /*  faq Section */
            faqs: siteInfo?.faqs || [],
            enableWhatsappChat: siteInfo?.enableWhatsappChat || false,
            whatsappNumber: siteInfo?.whatsappNumber || '',

            /* partners */
            partners: siteInfo?.partners || [],
            instagramWidgetId: siteInfo?.instagramWidgetId || '',
            enableInstagram: siteInfo?.enableInstagram || false,

            // Branding
            logo: siteInfo?.logo || '',
            favicon: siteInfo?.favicon || '',
            primaryColor: siteTheme?.primaryColor || '#3b82f6',
            secondaryColor: siteTheme?.secondaryColor || '#64748b',
            accentColor: siteTheme?.accentColor || '#f59e0b',

            // SEO Basic
            metaTitle: siteSEO?.metaTitle || '',
            metaDescription: siteSEO?.metaDescription || '',
            metaKeywords: siteSEO?.metaKeywords || '',
            canonicalUrl: siteSEO?.canonicalUrl || '',
            robotsMeta: siteSEO?.robotsMeta || 'index, follow',
            ogTitle: siteSEO?.ogTitle || '',
            ogDescription: siteSEO?.ogDescription || '',
            ogImage: siteSEO?.ogImage || '',
            twitterTitle: siteSEO?.twitterTitle || '',
            twitterDescription: siteSEO?.twitterDescription || '',
            twitterImage: siteSEO?.twitterImage || '',

            // Advanced SEO
            googleAnalyticsId: siteSEO?.googleAnalyticsId || '',
            googleTagManagerId: siteSEO?.googleTagManagerId || '',
            googleSearchConsole: siteSEO?.googleSearchConsole || '',
            facebookPixelId: siteSEO?.facebookPixelId || '',
            schemaType: siteSEO?.schemaType || 'organization',
            customSchema: siteSEO?.customSchema || '',
            autoGenerateSitemap: siteSEO?.autoGenerateSitemap || 'enabled',
            robotsTxt: siteSEO?.robotsTxt || '',

            // Social Media
            facebookUrl: socialMedia?.facebookUrl || '',
            twitterUrl: socialMedia?.twitterUrl || '',
            linkedinUrl: socialMedia?.linkedinUrl || '',
            instagramUrl: socialMedia?.instagramUrl || '',

            // Email Branding & SMTP
            smtpHost: smtp?.smtpHost || '',
            smtpPort: smtp?.smtpPort || '',
            smtpUsername: smtp?.smtpUsername || '',
            smtpPassword: smtp?.smtpPassword || '',
            smtpSecure: smtp?.smtpSecure,
        }),
        [siteInfo, siteTheme, siteSEO, socialMedia, smtp]
    );
    const methods = useForm({
        defaultValues: defaultValues,
    });
    const formValidationRules = useMemo(
        () => ({
            siteName: {
                required: 'Site name is required',
                minLength: {
                    value: 2,
                    message: 'Site name must be at least 2 characters',
                },
                maxLength: {
                    value: 100,
                    message: 'Site name must not exceed 100 characters',
                },
            },
            siteTagline: {
                maxLength: {
                    value: 150,
                    message: 'Tagline must not exceed 150 characters',
                },
            },
            siteDescription: {
                required: 'Site description is required',
                minLength: {
                    value: 50,
                    message: 'Description must be at least 50 characters',
                },
                maxLength: {
                    value: 500,
                    message: 'Description must not exceed 500 characters',
                },
            },
            metaTitle: {
                maxLength: {
                    value: 60,
                    message:
                        'Meta title should not exceed 60 characters for SEO',
                },
            },
            metaDescription: {
                maxLength: {
                    value: 160,
                    message:
                        'Meta description should not exceed 160 characters for SEO',
                },
            },
            metaKeywords: {
                maxLength: {
                    value: 200,
                    message: 'Keywords should not exceed 200 characters',
                },
            },
            ogTitle: {
                maxLength: {
                    value: 95,
                    message: 'OG title should not exceed 95 characters',
                },
            },
            ogDescription: {
                maxLength: {
                    value: 200,
                    message: 'OG description should not exceed 200 characters',
                },
            },
            twitterTitle: {
                maxLength: {
                    value: 70,
                    message: 'Twitter title should not exceed 70 characters',
                },
            },
            twitterDescription: {
                maxLength: {
                    value: 200,
                    message:
                        'Twitter description should not exceed 200 characters',
                },
            },
            canonicalUrl: {
                pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Invalid URL format',
                },
            },
            primaryColor: {
                pattern: {
                    value: /^#[0-9A-F]{6}$/i,
                    message: 'Invalid hex color format',
                },
            },
            secondaryColor: {
                pattern: {
                    value: /^#[0-9A-F]{6}$/i,
                    message: 'Invalid hex color format',
                },
            },
            accentColor: {
                pattern: {
                    value: /^#[0-9A-F]{6}$/i,
                    message: 'Invalid hex color format',
                },
            },

            googleAnalyticsId: {
                pattern: {
                    value: /^(G-|UA-|GTM-)?[A-Z0-9-]+$/i,
                    message: 'Invalid Analytics ID format',
                },
            },
            googleTagManagerId: {
                pattern: {
                    value: /^GTM-[A-Z0-9]+$/i,
                    message: 'Invalid GTM ID format (GTM-XXXXXXX)',
                },
            },
            socialUrl: {
                pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                        'Invalid URL format (must start with http:// or https://)',
                },
            },
            urlField: {
                pattern: {
                    value: /^https?:\/\/.+/,
                    message:
                        'Invalid URL format (must start with http:// or https://)',
                },
            },
            apiKey: {},
            widgetCode: {},
            webhookUrl: {
                pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Invalid webhook URL',
                },
            },
            customSchema: {},
            customScripts: {},
            robotsTxt: {},

            redirectRules: {},

            emailFromName: {
                required: 'From name is required',
                maxLength: {
                    value: 100,
                    message: 'From name must not exceed 100 characters',
                },
            },
            emailFooter: {
                maxLength: {
                    value: 500,
                    message: 'Footer text must not exceed 500 characters',
                },
            },
        }),
        []
    );
    const { control, getValues, trigger, resetField, reset } = methods;
    const robotsMetaOptions = useMemo(
        () => [
            { label: 'Index, Follow', value: 'index, follow' },
            { label: 'No Index, No Follow', value: 'noindex, nofollow' },
            { label: 'Index, No Follow', value: 'index, nofollow' },
            { label: 'No Index, Follow', value: 'noindex, follow' },
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

                const siteInfoFields = [
                    'siteName',
                    'siteTagline',
                    'siteDescription',
                    'bookingForm',
                    'logo',
                    'favicon',
                    'enableWhatsappChat',
                    'whatsappNumber',
                    'faqs',
                    'partners',
                    'instagramWidgetId',
                    'enableInstagram',
                ];
                const siteThemeFields = [
                    'primaryColor',
                    'secondaryColor',
                    'accentColor',
                ];
                const seoFields = [
                    'metaTitle',
                    'metaDescription',
                    'metaKeywords',
                    'ogTitle',
                    'ogDescription',
                    'ogImage',
                    'twitterTitle',
                    'twitterDescription',
                    'twitterImage',
                    'canonicalUrl',
                    'robotsMeta',
                    'googleAnalyticsId',
                    'googleTagManagerId',
                    'googleSearchConsole',
                    'facebookPixelId',
                    'schemaType',
                    'customSchema',
                    'autoGenerateSitemap',
                    'robotsTxt',
                ];

                const socialMediaFields = [
                    'facebookUrl',
                    'twitterUrl',
                    'linkedinUrl',
                    'instagramUrl',
                ];
                const smtpFields = [
                    'smtpHost',
                    'smtpPort',
                    'smtpUsername',
                    'smtpPassword',
                    'smtpSecure',
                ];

                setEditingField(null);

                if (siteInfoFields.includes(fieldId)) {
                    result = await updateSiteInfo({
                        [fieldId]: value,
                    });
                } else if (siteThemeFields.includes(fieldId)) {
                    result = await updateSiteTheme({
                        [fieldId]: value,
                    });
                } else if (seoFields.includes(fieldId)) {
                    result = await updateSiteSeo({
                        [fieldId]: value,
                    });
                } else if (socialMediaFields.includes(fieldId)) {
                    result = await updateSocialMedia({
                        [fieldId]: value,
                    });
                } else if (smtpFields.includes(fieldId)) {
                    result = await updateSMTPConfig({
                        [fieldId]: value,
                    });
                }

                // Handle the result
                if (result && !result.success) {
                    console.error('Failed to update:', result.error);
                    toast.error(result.error);
                    return;
                }

                // Optional: Show success message
                setEditingField(null);
                toast.success('Updated successfully');
            } catch (err) {
                console.error('Error updating field:', err);
                // Optional: Show error message to user
                toast.error('Failed to update');
            } finally {
                setIsSaving(false);
            }
        },
        [getValues]
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

    const syncResponseWithFormData = useCallback(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleTabChange = useCallback(tabId => {
        setActiveTab(tabId);
    }, []);

    useEffect(() => {
        if (data) {
            syncResponseWithFormData();
        }
    }, [data, syncResponseWithFormData]);
    const formSections = [
        { id: 'site', label: 'General', icon: Globe02Icon },
        { id: 'branding', label: 'Branding', icon: PaintBoardIcon },
        { id: 'seo', label: 'SEO', icon: Search01Icon },
        { id: 'advancedSeo', label: 'Advanced SEO', icon: Leaf01Icon },
        { id: 'SocialMedia', label: 'Social Media', icon: Link01Icon },
        { id: 'smtp', label: 'SMTP', icon: Mail01Icon },
    ];

    const SECTION_COMPONENTS = useMemo(
        () => ({
            site: (
                <SiteInformation
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                />
            ),
            branding: (
                <BrandingInformation
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                    siteInfo={siteInfo}
                />
            ),
            seo: (
                <SeoInformation
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                    robotsMetaOptions={robotsMetaOptions}
                    seoInfo={siteSEO}
                />
            ),
            advancedSeo: (
                <AdvancedSeo
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                />
            ),
            smtp: (
                <SMTPSettings
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                />
            ),
            SocialMedia: (
                <SocialMedia
                    control={control}
                    handleSaveField={handleSaveField}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    isSaving={isSaving}
                    resetField={resetField}
                    formValidationRules={formValidationRules}
                />
            ),
        }),
        [
            control,
            handleSaveField,
            editingField,
            isSaving,
            resetField,
            formValidationRules,
            siteInfo,
            robotsMetaOptions,
            siteSEO,
        ]
    );
    const renderFormSection = useCallback(() => {
        const SectionComponent =
            SECTION_COMPONENTS[activeTab] || SECTION_COMPONENTS.site;
        return SectionComponent;
    }, [SECTION_COMPONENTS, activeTab]);

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

                    <div className='col-span-12 lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'>
                        <FormProvider {...methods}>
                            {renderFormSection()}
                        </FormProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteManagement;

