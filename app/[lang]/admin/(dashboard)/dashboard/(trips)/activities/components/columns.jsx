'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { generateSlug } from '@/lib/utils';
import { Clock, MapPin } from 'lucide-react';
import { ActivitiesActionDropdown } from './actibities-dropdown-action';

export const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={value =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div className='font-mono text-xs text-muted-foreground'>
                #{row.original.id.split('-')[0]}
            </div>
        ),
    },
    {
        accessorKey: 'photo',
        header: 'Image',
        cell: ({ row }) => {
            const photos = row.original.images;
            const photo =
                photos.length > 0 ? photos[0].image.url : '/placeholder.svg';

            return (
                <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                        src={photo}
                        alt={row.original.name}
                        className='object-cover'
                    />
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name & Details',
        cell: ({ row }) => {
            const location = row.original.location?.name;
            const duration = row.original.duration;

            return (
                <div className='max-w-[300px] space-y-1'>
                    <div className='font-medium text-sm truncate'>
                        {row.original.name}
                    </div>
                    {location && (
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <MapPin className='h-3 w-3' />
                            <span className='truncate'>{location}</span>
                        </div>
                    )}
                    {duration && (
                        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            <span>{duration}</span>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'difficulty',
        header: 'Difficulty',
        cell: ({ row }) => {
            const difficulty = row.original.difficulty;

            if (!difficulty) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <Badge variant='secondary' className='text-xs'>
                    {difficulty}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const price = row.getValue('price');

            return (
                <div className='text-sm font-medium'>
                    {price === 0 ? (
                        <Badge variant='outline' className='text-xs'>
                            Free
                        </Badge>
                    ) : (
                        `$${price}`
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'images',
        header: 'Gallery',
        cell: ({ row }) => {
            const imageCount = row.original.images?.length || 0;

            return (
                <div className='text-center'>
                    <Badge variant='secondary' className='text-xs'>
                        {imageCount} {imageCount === 1 ? 'image' : 'images'}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'slug',
        accessorFn: row => generateSlug(row.name),
        header: 'Slug',
        cell: ({ row }) => (
            <div className='font-mono text-xs text-muted-foreground max-w-[200px] truncate'>
                {row.getValue('slug')}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const activities = row.original;
            return <ActivitiesActionDropdown activities={activities} />;
        },
    },
];

