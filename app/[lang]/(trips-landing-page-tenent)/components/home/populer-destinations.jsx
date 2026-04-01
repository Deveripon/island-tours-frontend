import { getAllDestinationOfTenant } from '@/app/_actions/trips/destinations';
import { generateSlug } from '@/lib/utils';
import Link from 'next/link';
import { DummypopularDestinations } from '../../data/data';
import DestinationCard from './destination-card';
import SectionTitle from './section-title';

export function transformDestinationData(destinations) {
    return (
        destinations &&
        destinations.map(destination => ({
            id: destination.id,
            name: destination.name,
            image: destination.images?.[0]?.url || '', // Use first image as main image
            tripCount: destination.affiliateTrips?.length || 0,
            description: destination.description,
            country: destination.country,
            city: destination.city,
            region: destination.region,
            latitude: destination.latitude,
            longitude: destination.longitude,
            embededMap: destination.embededMap,
            images: destination.images?.map(img => img.url) || [], // Extract all image URLs
        }))
    );
}
export default async function PopularDestinations({
    tenantId,
    content,
    isDemo,
}) {
    const destinations = isDemo
        ? DummypopularDestinations
        : await getAllDestinationOfTenant(tenantId);

    const popularDestinations = !isDemo
        ? destinations?.data &&
          transformDestinationData(
              destinations?.data.filter(
                  destination => destination.affiliateTrips.length > 0
              )
          )
        : DummypopularDestinations;

    if (!popularDestinations || popularDestinations.length === 0) {
        return null;
    }
    return (
        <section id='destinations' className='py-16 md:py-24 bg-muted/30'>
            <div className='container mx-auto px-4'>
                <div>
                    {/*        <SectionTitle
                            title={content?.title || 'Popular Destinations'}
                        /> */}
                    <SectionTitle
                        title={'All Popular '}
                        highlightedText='Destinations'
                    />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {popularDestinations
                        ?.sort(() => Math.random() - 0.2)
                        .slice(0, 8)
                        .map(destination => (
                            <Link
                                key={destination.id}
                                href={`/site/${tenantId}/destinations/${generateSlug(
                                    destination?.name
                                )}`}>
                                <DestinationCard destination={destination} />
                            </Link>
                        ))}
                </div>
            </div>
        </section>
    );
}

