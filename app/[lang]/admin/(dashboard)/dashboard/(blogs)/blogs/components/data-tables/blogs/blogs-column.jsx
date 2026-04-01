'use client';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formateToCapitalize } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Delete, GlobeLock, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { ActionDropdown } from './action-dropdown';

export function defineActionBasedOnStatus(status) {
    switch (status) {
        case 'DRAFT':
            return {
                label: 'Publish Blog',
                action: 'PUBLISHED',
                icon: <UploadCloud className='h-4 w-4' />,
                className: 'text-green-600 dark:text-green-400',
            };
        case 'PUBLISHED':
            return {
                label: 'Unpublish Blog',
                action: 'DRAFT',
                icon: <GlobeLock className='h-4 w-4' />,
                className: 'text-orange-600 dark:text-orange-400',
            };
        case 'ARCHIVED':
            return {
                label: 'Restore Blog',
                action: 'PUBLISHED',
                icon: <Delete className='h-4 w-4' />,
                className: 'text-teal-600 dark:text-teal-400',
            };
        default:
            return {
                label: 'Archive Blog',
                action: 'ARCHIVED',
                icon: <Delete className='h-4 w-4' />,
                className: 'text-red-600 dark:text-red-400',
            };
    }
}

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
        accessorKey: 'mainImage',
        header: 'Image',
        cell: ({ row }) => {
            const image =
                row.original.mainImage?.url ||
                row.original.mainImage?.image?.url;

            return (
                <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                        src={image || '/placeholder.svg'}
                        alt={row.original.title}
                        className='object-cover'
                    />
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'title',
        header: 'Title & Content',
        cell: ({ row }) => {
            const content = row.original.content || '';
            const strippedContent = content.replace(/<[^>]*>/g, '').trim();
            const preview =
                strippedContent.slice(0, 80) +
                (strippedContent.length > 80 ? '...' : '');

            return (
                <div className='max-w-[350px]'>
                    <div className='font-medium text-sm truncate mb-1'>
                        {row.original.title}
                    </div>
                    {preview && (
                        <p className='text-xs text-muted-foreground line-clamp-2'>
                            {preview}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'category',
        header: 'Categories',
        cell: ({ row }) => {
            const categories = row.original.category || [];

            if (categories.length === 0) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <div className='flex flex-wrap gap-1 max-w-[150px]'>
                    {categories.slice(0, 2).map((cat, index) => (
                        <Badge
                            key={index}
                            variant='secondary'
                            className='text-xs'>
                            {cat}
                        </Badge>
                    ))}
                    {categories.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                            +{categories.length - 2}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
            const tags = row.original.tags || [];

            if (tags.length === 0) {
                return <span className='text-xs text-muted-foreground'>—</span>;
            }

            return (
                <div className='flex flex-wrap gap-1 max-w-[150px]'>
                    {tags.slice(0, 2).map((tag, index) => (
                        <Badge
                            key={index}
                            variant='outline'
                            className='text-xs'>
                            {tag}
                        </Badge>
                    ))}
                    {tags.length > 2 && (
                        <Badge
                            variant='secondary'
                            className='text-xs'>
                            +{tags.length - 2}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdBy',
        header: 'Author',
        cell: ({ row }) => {
            const authorImage =
                row?.original?.createdBy?.image?.url ||
                row.original.createdBy?.image ||
                '/placeholder.svg';

            return (
                <div className='flex items-center gap-2'>
                    <Image
                        src={authorImage}
                        alt={row.original.createdBy?.name || 'Author'}
                        width={32}
                        height={32}
                        className='rounded-full object-cover'
                    />
                    <div className='text-sm truncate max-w-[120px]'>
                        {row.original.createdBy?.name}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'comments',
        header: 'Comments',
        cell: ({ row }) => {
            const commentCount = row.original._count?.comments || 0;

            return (
                <div className='text-center'>
                    <Badge variant='secondary' className='text-xs'>
                        {commentCount}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;

            const statusStyles = {
                DRAFT: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
                PUBLISHED: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400',
                ARCHIVED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400',
            };

            return (
                <Badge
                    variant='outline'
                    className={`text-xs ${statusStyles[status] || ''}`}>
                    {formateToCapitalize(status)}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value === '' || row.getValue(id) === value;
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
            <div className='text-sm text-muted-foreground'>
                {format(parseISO(row.original.createdAt), 'MMM dd, yyyy')}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row, table }) => {
            const blog = row.original;
            const meta = table.options.meta;
            const isLoading = meta?.loading === blog.id;

            return (
                <ActionDropdown
                    blog={blog}
                    meta={meta}
                    isLoading={isLoading}
                    defineActionBasedOnStatus={defineActionBasedOnStatus}
                />
            );
        },
    },
];