'use client';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formateToCapitalize } from '@/lib/utils';
import { Bus, Car, MapPin, PersonStanding, Ship, Train } from 'lucide-react';
import { ActivityItemCard } from './IterneraryItems/activity-item-carrd';
import { HotelItemCard } from './IterneraryItems/hotel-item-card';
import { MealItemCard } from './IterneraryItems/meal-item-card';
import { SightseeingItemCard } from './IterneraryItems/sightseeing-item-card';
import { TransferItemCard } from './IterneraryItems/transfer-item-card';

export default function IterneryPreview({ itinerary }) {
    const renderItemCard = (item, type, category) => {
        switch (type) {
            case 'transfer':
                return <TransferItemCard transfer={item} />;
            case 'hotel':
                return <HotelItemCard hotel={item} />;
            case 'activity':
                return <ActivityItemCard activity={item} />;
            case 'sightseeing':
                return <SightseeingItemCard sightseeing={item} />;
            case 'meal':
                return <MealItemCard meal={item} />;
            default:
                return null;
        }
    };

    const TimelineItem = ({ children, isLast = false }) => (
        <div className='relative flex gap-6'>
            <div className='flex flex-col items-center'>
                <div className='w-4 h-4 bg-red-600 rounded-full ring-2 ring-primary/10 border-4 border-white shadow-lg z-10' />
                {/*   <Image src={Pin} alt='pin' height={25} width={25} /> */}
                {
                    /* !isLast && */ <div className='w-0.5 h-full bg-gradient-to-b from-primary to-primary/40 mt-2' />
                }
            </div>
            <div className='flex-1 -mt-2'>{children}</div>
        </div>
    );

    const getIncludedCount = day => {
        return {
            transfers: day.transferDetails ? 1 : 0,
            hotels: day.hotel ? 1 : 0,
            activities: day.activities ? 1 : 0,
            sightseeing: day.sightseeing ? 1 : 0,
            meals: day.meals ? day.meals?.length : 0,
            flight: day?.filght ? day?.filght?.length : 0,
        };
    };

    const getRouteTransPortIcon = transport => {
        switch (transport) {
            case 'car':
                return <Car className='h-5 w-5 text-primary' />;
            case 'bus':
                return <Bus className='h-5 w-5 text-primary' />;
            case 'train':
                return <Train className='h-5 w-5 text-primary' />;
            case 'boat':
                return <Ship className='h-5 w-5 text-primary' />;
            case 'walking':
                return <PersonStanding className='h-5 w-5 text-primary' />;
            default:
                return <Car className='h-5 w-5 text-primary' />;
        }
    };

    const organizeTimelineItems = (day, isLastDay = false) => {
        const items = [];

        // Define the order priority for each item type
        const getOrderPriority = (item, isLastDay) => {
            if (isLastDay) {
                // Last day sequence: Breakfast → Activities → Sightseeing → Lunch → Hotel checkout → Dinner → Transfer (Departure)
                switch (item.type) {
                    case 'meal':
                        if (item.category === 'breakfast') return 1;
                        if (item.category === 'lunch') return 4;
                        if (item.category === 'dinner') return 6;
                        return 5; // other meals
                    case 'activity':
                        return 2;
                    case 'sightseeing':
                        return 3;
                    case 'hotel':
                        return 5; // hotel checkout
                    case 'transfer':
                        return 7; // departure transfer last
                    case 'flight':
                        return 8;
                    default:
                        return 9;
                }
            } else {
                // Other days: Transfer (Arrival) → Breakfast → Activities → Sightseeing → Lunch → Hotel checkin → Dinner
                switch (item.type) {
                    case 'flight':
                        return 1;
                    case 'transfer':
                        return 2; // arrival transfer first
                    case 'meal':
                        if (item.category === 'breakfast') return 3;
                        if (item.category === 'lunch') return 6;
                        if (item.category === 'dinner') return 8;
                        return 7; // other meals
                    case 'activity':
                        return 4;
                    case 'sightseeing':
                        return 5;
                    case 'hotel':
                        return 7; // hotel checkin
                    default:
                        return 9;
                }
            }
        };

        // Add all items with their appropriate times
        if (day.transferDetails) {
            const transferTime = isLastDay ? '20:00' : '08:00';
            items.push({
                ...day.transferDetails,
                type: 'transfer',
                sortTime: transferTime,
                priority: getOrderPriority({ type: 'transfer' }, isLastDay) });
        }

        day.meals?.forEach(meal => {
            let mealTime = '12:00';
            if (meal.category === 'breakfast')
                mealTime = isLastDay ? '08:00' : '09:00';
            else if (meal.category === 'lunch') mealTime = '12:30';
            else if (meal.category === 'dinner') mealTime = '19:00';

            items.push({
                ...meal,
                type: 'meal',
                sortTime: mealTime,
                category: meal?.category,
                priority: getOrderPriority(
                    { type: 'meal', category: meal.category },
                    isLastDay
                ) });
        });

        if (day.activities) {
            items.push({
                ...day.activities,
                type: 'activity',
                sortTime: '10:00',
                priority: getOrderPriority({ type: 'activity' }, isLastDay) });
        }

        if (day.sightseeing) {
            items.push({
                ...day.sightseeing,
                type: 'sightseeing',
                sortTime: '11:30',
                priority: getOrderPriority({ type: 'sightseeing' }, isLastDay) });
        }

        if (day.hotel) {
            // Hotel time depends on whether it's checkin or checkout
            const hotelTime = isLastDay ? '14:00' : '15:00';
            items.push({
                ...day.hotel,
                type: 'hotel',
                sortTime: hotelTime,
                priority: getOrderPriority({ type: 'hotel' }, isLastDay) });
        }

        // Sort by priority first, then by time
        return items.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // If same priority, sort by time
            const timeA = parseInt(a.sortTime.replace(':', ''));
            const timeB = parseInt(b.sortTime.replace(':', ''));
            return timeA - timeB;
        });
    };

    return (
        <div className=''>
            <Tabs defaultValue='1' className='w-full'>
                <TabsList className='grid w-full grid-cols-4 mb-8'>
                    {itinerary.map(day => (
                        <TabsTrigger
                            key={day.id}
                            value={day.dayNumber.toString()}>
                            Day {day.dayNumber}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {itinerary.map((day, dayIndex) => {
                    const included = getIncludedCount(day);
                    const isLastDay = dayIndex === itinerary.length - 1;
                    const timelineItems = organizeTimelineItems(day, isLastDay);

                    return (
                        <TabsContent
                            key={day.id}
                            value={day.dayNumber.toString()}>
                            <div className=''>
                                {/* Day Header */}
                                <div className='flex items-center'>
                                    <div className='bg-red-500 text-white px-4 mr-4 py-2 rounded-full font-semibold'>
                                        Day {day.dayNumber}
                                    </div>
                                    <div className='flex-1'>
                                        <h2 className='text-lg font-bold'>
                                            {day.title}
                                        </h2>
                                        <div className='flex items-center gap-4 text-sm text-gray-600 mt-3'>
                                            <span className='font-medium'>
                                                INCLUDED:
                                            </span>
                                            {included.transfers > 0 && (
                                                <span>
                                                    🚐 {included.transfers}{' '}
                                                    Transfer
                                                </span>
                                            )}
                                            {included.hotels > 0 && (
                                                <span>
                                                    🏨 {included.hotels} Hotel
                                                </span>
                                            )}
                                            {included.activities > 0 && (
                                                <span>
                                                    🎯 {included.activities}{' '}
                                                    Activity
                                                </span>
                                            )}
                                            {included.sightseeing > 0 && (
                                                <span>
                                                    👁️ {included.sightseeing}{' '}
                                                    Sightseeing
                                                </span>
                                            )}
                                            {included.meals > 0 && (
                                                <span>
                                                    🍽️ {included.meals} Meals
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Route Information */}
                                {day.routes && (
                                    <div className='my-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary'>
                                        <div className='flex items-center gap-2 text-primary '>
                                            <MapPin className='w-4 h-4' />
                                            <span className='font-medium'>
                                                Route:{' '}
                                            </span>
                                            <span className='flex gap-2'>
                                                {day.routes.from}{' '}
                                                {getRouteTransPortIcon(
                                                    day?.routes?.transportType
                                                )}
                                                {day.routes.to}
                                            </span>
                                            <span className='text-sm'>
                                                ({day.routes.distance})
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className='space-y-6'>
                                    {timelineItems.map((item, index) => (
                                        <TimelineItem
                                            key={`${item.type}-${
                                                item.id || index
                                            }`}
                                            isLast={
                                                index ===
                                                timelineItems.length - 1
                                            }>
                                            <div className='flex items-start gap-2 mb-2'>
                                                <Badge
                                                    variant='secondary'
                                                    className='text-sm capitalize'>
                                                    {item.type}
                                                </Badge>
                                                {isLastDay &&
                                                    item.type ===
                                                        'transfer' && (
                                                        <Badge
                                                            variant='destructive'
                                                            className='text-sm'>
                                                            Departure
                                                        </Badge>
                                                    )}
                                                {!isLastDay &&
                                                    item.type ===
                                                        'transfer' && (
                                                        <Badge
                                                            variant='default'
                                                            className='text-sm'>
                                                            Arrival
                                                        </Badge>
                                                    )}
                                                {item.type === 'hotel' && (
                                                    <Badge
                                                        variant='outline'
                                                        className='text-sm bg-primary/10 text-primary border-primary/20'>
                                                        {isLastDay
                                                            ? 'Check-out'
                                                            : 'Night Stay'}
                                                    </Badge>
                                                )}
                                                {item.type === 'meal' && (
                                                    <Badge
                                                        variant='outline'
                                                        className='text-sm bg-primary/10 text-primary border-primary/20'>
                                                        {formateToCapitalize(
                                                            item?.category
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>
                                            {renderItemCard(
                                                item,
                                                item.type,
                                                item?.category
                                            )}
                                        </TimelineItem>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}

