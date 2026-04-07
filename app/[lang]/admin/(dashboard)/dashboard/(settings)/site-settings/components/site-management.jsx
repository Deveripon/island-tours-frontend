'use client';

import {
    Globe02Icon,
    Leaf01Icon,
    Link01Icon,
    Mail01Icon,
    PaintBoardIcon,
    Search01Icon,
} from '@hugeicons/core-free-icons';
import { useMemo, useState } from 'react';
import AdvancedSeo from './sections/advanced-seo';
import BrandingInformation from './sections/branding-information';
import SeoInformation from './sections/seo-information';
import SiteInformation from './sections/site-information';
import SMTPSettings from './sections/smtp-settings';
import SocialMedia from './sections/social-media';
import SectionTabs from './tabs';

const SiteManagement = ({ data }) => {
    const [activeTab, setActiveTab] = useState('site');
    const { siteInfo, smtp, siteSEO, siteTheme, socialMedia } = data;

    const formValidationRules = useMemo(
        () => ({
            siteName: {
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
                maxLength: {
                    value: 500,
                    message: 'Description must not exceed 500 characters',
                },
            },
            metaTitle: {
                maxLength: {
                    value: 60,
                    message: 'Meta title should not exceed 60 characters for SEO',
                },
            },
            metaDescription: {
                maxLength: {
                    value: 160,
                    message: 'Meta description should not exceed 160 characters for SEO',
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
                    message: 'Twitter description should not exceed 200 characters',
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
                    message: 'Invalid URL format (must start with http:// or https://)',
                },
            },
            urlField: {
                pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Invalid URL format (must start with http:// or https://)',
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

    const formSections = [
        { id: 'site', label: 'General', icon: Globe02Icon },
        { id: 'branding', label: 'Branding', icon: PaintBoardIcon },
        { id: 'seo', label: 'SEO', icon: Search01Icon },
        { id: 'advancedSeo', label: 'Advanced SEO', icon: Leaf01Icon },
        { id: 'SocialMedia', label: 'Social Media', icon: Link01Icon },
        { id: 'smtp', label: 'SMTP', icon: Mail01Icon },
    ];

    const SECTION_COMPONENTS = {
        site: <SiteInformation data={siteInfo} validationRules={formValidationRules} />,
        branding: <BrandingInformation data={siteTheme} siteInfo={siteInfo} validationRules={formValidationRules} />,
        seo: <SeoInformation data={siteSEO} validationRules={formValidationRules} />,
        advancedSeo: <AdvancedSeo data={siteSEO} validationRules={formValidationRules} />,
        smtp: <SMTPSettings data={smtp} validationRules={formValidationRules} />,
        SocialMedia: <SocialMedia data={socialMedia} validationRules={formValidationRules} />,
    };

    return (
        <div className='flex flex-auto'>
            <div className='w-full'>
                <div className='grid grid-cols-12 my-8'>
                    <SectionTabs
                        formSections={formSections}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        className='col-span-12 lg:col-span-3 xl:col-span-2 rounded-tr-none border-r-0'
                    />

                    <div className='col-span-12 lg:col-span-9 xl:col-span-9 rounded-lg lg:rounded-tl-none lg:rounded-bl-none p-6 border bg-card border-l-0 text-card-foreground shadow-sm'>
                        {SECTION_COMPONENTS[activeTab] || SECTION_COMPONENTS.site}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteManagement;
