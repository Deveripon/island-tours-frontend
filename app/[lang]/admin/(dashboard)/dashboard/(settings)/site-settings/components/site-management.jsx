'use client';

import {
    updateTenantSiteInfo,
    updateTenantSiteSeo,
    updateTenantSiteTheme,
    updateTenantSMTP,
    updateTenantSocialMedia,
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

const SiteManagement = ({ data, tenant }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [activeTab, setActiveTab] = useState('site');
    const {
        tenantSiteInfo,
        tenantSMTP,
        tenantSiteSEO,
        tenantSiteTheme,
        tenantSocialMedia,
    } = data;

    const defaultValues = useMemo(
        () => ({
            // Site Information
            siteName: tenantSiteInfo?.siteName || '',
            siteTagline: tenantSiteInfo?.siteTagline || '',
            siteDescription: tenantSiteInfo?.siteDescription || '',
            bookingForm: tenantSiteInfo?.bookingForm || 'v2',
            /*  faq Section */
            faqs: tenantSiteInfo?.faqs || [],
            enableWhatsappChat: tenantSiteInfo?.enableWhatsappChat || false,
            whatsappNumber: tenantSiteInfo?.whatsappNumber || '',

            /* partners */
            partners: tenantSiteInfo?.partners || [],
            instagramWidgetId: tenantSiteInfo?.instagramWidgetId || '',
            enableInstagram: tenantSiteInfo?.enableInstagram || false,

            // Branding
            logo: tenantSiteInfo?.logo || '',
            favicon: tenantSiteInfo?.favicon || '',
            primaryColor: tenantSiteTheme?.primaryColor || '#3b82f6',
            secondaryColor: tenantSiteTheme?.secondaryColor || '#64748b',
            accentColor: tenantSiteTheme?.accentColor || '#f59e0b',

            // SEO Basic
            metaTitle: tenantSiteSEO?.metaTitle || '',
            metaDescription: tenantSiteSEO?.metaDescription || '',
            metaKeywords: tenantSiteSEO?.metaKeywords || '',
            canonicalUrl: tenantSiteSEO?.canonicalUrl || '',
            robotsMeta: tenantSiteSEO?.robotsMeta || 'index, follow',
            ogTitle: tenantSiteSEO?.ogTitle || '',
            ogDescription: tenantSiteSEO?.ogDescription || '',
            ogImage: tenantSiteSEO?.ogImage || '',
            twitterTitle: tenantSiteSEO?.twitterTitle || '',
            twitterDescription: tenantSiteSEO?.twitterDescription || '',
            twitterImage: tenantSiteSEO?.twitterImage || '',

            // Advanced SEO
            googleAnalyticsId: tenantSiteSEO?.googleAnalyticsId || '',
            googleTagManagerId: tenantSiteSEO?.googleTagManagerId || '',
            googleSearchConsole: tenantSiteSEO?.googleSearchConsole || '',
            facebookPixelId: tenantSiteSEO?.facebookPixelId || '',
            schemaType: tenantSiteSEO?.schemaType || 'organization',
            customSchema: tenantSiteSEO?.customSchema || '',
            autoGenerateSitemap:
                tenantSiteSEO?.autoGenerateSitemap || 'enabled',
            robotsTxt: tenantSiteSEO?.robotsTxt || '',

            // Social Media
            facebookUrl: tenantSocialMedia?.facebookUrl || '',
            twitterUrl: tenantSocialMedia?.twitterUrl || '',
            linkedinUrl: tenantSocialMedia?.linkedinUrl || '',
            instagramUrl: tenantSocialMedia?.instagramUrl || '',

            // Email Branding & SMTP
            smtpHost: tenantSMTP?.smtpHost || '',
            smtpPort: tenantSMTP?.smtpPort || '',
            smtpUsername: tenantSMTP?.smtpUsername || '',
            smtpPassword: tenantSMTP?.smtpPassword || '',
            smtpSecure: tenantSMTP?.smtpSecure,
        }),
        [
            tenantSiteInfo,
            tenantSiteTheme,
            tenantSiteSEO,
            tenantSocialMedia,
            tenantSMTP,
        ]
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

                if (tenant) {
                    let result;

                    if (siteInfoFields.includes(fieldId)) {
                        result = await updateTenantSiteInfo(tenant, {
                            [fieldId]: value,
                        });
                    } else if (siteThemeFields.includes(fieldId)) {
                        result = await updateTenantSiteTheme(tenant, {
                            [fieldId]: value,
                        });
                    } else if (seoFields.includes(fieldId)) {
                        result = await updateTenantSiteSeo(tenant, {
                            [fieldId]: value,
                        });
                    } else if (socialMediaFields.includes(fieldId)) {
                        result = await updateTenantSocialMedia(tenant, {
                            [fieldId]: value,
                        });
                    } else if (smtpFields.includes(fieldId)) {
                        result = await updateTenantSMTP(tenant, {
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
                }
            } catch (err) {
                console.error('Error updating field:', err);
                // Optional: Show error message to user
                toast.error('Failed to update');
            } finally {
                setIsSaving(false);
            }
        },
        [getValues, tenant]
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
    }, [data, syncResponseWithFormData, tenant]);
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
                    siteInfo={tenantSiteInfo}
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
                    seoInfo={tenantSiteSEO}
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
            tenantSiteInfo,
            robotsMetaOptions,
            tenantSiteSEO,
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

