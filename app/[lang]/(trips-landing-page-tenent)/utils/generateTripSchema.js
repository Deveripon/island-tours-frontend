export function generateTripSchema(trip, slug) {
    const seo = trip?.seo;
    const schemaType = seo?.schemaType || 'TouristTrip';

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const tripUrl = `${baseUrl}/trips/${slug}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        name: trip?.title || seo?.title,
        description: trip?.description || seo?.description,
        url: tripUrl,
    };

    // Image
    if (seo?.ogImage?.image?.url) {
        schema.image = {
            '@type': 'ImageObject',
            url: seo.ogImage.image.url,
            width: seo.ogImage.image.width,
            height: seo.ogImage.image.height,
        };
    }

    // Additional properties based on schema type
    if (trip?.price) {
        schema.offers = {
            '@type': 'Offer',
            price: trip.price,
            priceCurrency: 'USD',
        };
    }

    if (trip?.location) {
        schema.touristType = 'Adventure';
    }

    return schema;
}

