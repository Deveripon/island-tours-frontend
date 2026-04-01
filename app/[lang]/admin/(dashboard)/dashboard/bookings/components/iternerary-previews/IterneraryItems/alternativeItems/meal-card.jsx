import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formateToCapitalize } from '@/lib/utils';
import { Clock, Utensils } from 'lucide-react';
import { GalleryComponent } from './gallery-card';

export default function MealCard({ mealData }) {
    const getCategoryBadgeColor = category => {
        switch (category.toLowerCase()) {
            case 'breakfast':
                return 'bg-yellow-100 text-yellow-800';
            case 'lunch':
                return 'bg-orange-100 text-orange-800';
            case 'dinner':
                return 'bg-purple-100 text-purple-800';
            case 'snack':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getDietaryBadges = () => {
        const availableOptions = Object.entries(mealData.dietaryOptions)
            .filter(([_, available]) => available)
            .map(([option, _]) => option);

        return availableOptions.slice(0, 3); // Show only first 3 to avoid clutter
    };

    return (
        <div className='p-4 relative'>
            <Card className={`overflow-hidden`}>
                <CardContent className='p-0'>
                    <div className='flex flex-col md:flex-row'>
                        {/* Image Section */}
                        <div className='relative w-68 max-sm:w-full'>
                            <GalleryComponent images={mealData?.gallery} />
                            {/* Category Badge */}
                            <Badge
                                className={`absolute top-3 left-3 ${getCategoryBadgeColor(
                                    mealData.category
                                )} text-sm px-2 py-1`}>
                                {mealData.category.charAt(0).toUpperCase() +
                                    mealData.category.slice(1)}
                            </Badge>
                        </div>

                        {/* Content Section */}
                        <div className='flex-1 p-6 pb-3'>
                            <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                                <div className='flex-1'>
                                    <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                                        {mealData.name}
                                    </h2>

                                    <p className='text-sm line-clamp-2 text-ellipsis text-gray-700 mb-4 leading-relaxed'>
                                        {mealData.description}
                                    </p>

                                    {/* Dietary Options */}
                                    <div className='flex items-center gap-2 mb-4'>
                                        <Utensils className='h-4 w-4 text-gray-500' />
                                        <span className='text-sm text-gray-500 font-medium'>
                                            Dietary Options:
                                        </span>
                                        <div className='flex gap-1 flex-wrap'>
                                            {getDietaryBadges().map(option => (
                                                <Badge
                                                    key={option}
                                                    variant='secondary'
                                                    className='text-sm px-2 py-0.5'>
                                                    {formateToCapitalize(
                                                        option
                                                    )}
                                                </Badge>
                                            ))}
                                            {Object.values(
                                                mealData.dietaryOptions
                                            ).filter(Boolean).length > 3 && (
                                                <Badge
                                                    variant='outline'
                                                    className='text-sm px-2 py-0.5'>
                                                    +
                                                    {Object.values(
                                                        mealData.dietaryOptions
                                                    ).filter(Boolean).length -
                                                        3}{' '}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Meal Details */}
                                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                                        <div className='flex items-center gap-1'>
                                            <Clock className='h-4 w-4' />
                                            <span>
                                                Meal Time:{' '}
                                                {formateToCapitalize(
                                                    mealData.category
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

