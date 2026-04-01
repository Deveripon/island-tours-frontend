export function generateOrganizationSchema(tenantData, seoData) {
    if (!tenantData || !seoData) return null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const tenantUrl = `${baseUrl}/${tenantData.tenantId}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': seoData.schemaType || 'Organization',
        name:
            tenantData?.companyInformations?.name ||
            seoData?.metaTitle ||
            'Travel Company',
        url: seoData?.canonicalUrl || tenantUrl,
        logo:
            seoData?.ogImage?.image?.url ||
            tenantData?.tenantSiteInfo?.logo?.url,
        description: seoData?.metaDescription,
    };

    // Contact Information
    if (tenantData?.companyInformations) {
        const contact = tenantData.companyInformations;

        if (contact.email || contact.phone) {
            schema.contactPoint = {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: contact.email,
                telephone: contact.phone,
            };
        }

        // Address
        if (contact.address) {
            schema.address = {
                '@type': 'PostalAddress',
                streetAddress: contact.address,
                addressLocality: contact.city,
                addressRegion: contact.state,
                postalCode: contact.zipCode,
                addressCountry: contact.country,
            };
        }
    }

    // Social Media Links
    const socialLinks = [];
    const prefs = tenantData?.preferences;

    if (prefs?.social_facebook) socialLinks.push(prefs.social_facebook);
    if (prefs?.social_twitter) socialLinks.push(prefs.social_twitter);
    if (prefs?.social_instagram) socialLinks.push(prefs.social_instagram);
    if (prefs?.social_linkedin) socialLinks.push(prefs.social_linkedin);

    if (socialLinks.length > 0) {
        schema.sameAs = socialLinks;
    }

    return schema;
}

