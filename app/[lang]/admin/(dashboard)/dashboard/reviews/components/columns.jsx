'use client';

import { Permission } from '@/RBAC.config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRolePermission } from '@/hooks/useRolePermission';
import { cn } from '@/lib/utils';
import {
    Calendar,
    CheckCircle2,
    Eye,
    Star,
    Trash2,
    XCircle,
} from 'lucide-react';

const ReviewActions = ({ review }) => {
    const canEdit = useRolePermission(Permission.EDIT_REVIEW);
    const canDelete = useRolePermission(Permission.DELETE_REVIEW);
    const canView = useRolePermission(Permission.VIEW_REVIEWS);

    return (
        <div className='flex items-center gap-1'>
            {review.status === 'PENDING' && canEdit && (
                <>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('update-review-status', {
                                    detail: {
                                        id: review.id,
                                        status: 'APPROVED',
                                    },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 text-green-600 hover:bg-green-50'
                        title='Approve'>
                        <CheckCircle2 className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                            document.dispatchEvent(
                                new CustomEvent('update-review-status', {
                                    detail: {
                                        id: review.id,
                                        status: 'REJECTED',
                                    },
                                })
                            );
                        }}
                        className='h-8 w-8 p-0 text-orange-600 hover:bg-orange-50'
                        title='Reject'>
                        <XCircle className='h-4 w-4' />
                    </Button>
                </>
            )}
            {/* View/Edit button */}
            {canView && (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                        document.dispatchEvent(
                            new CustomEvent('view-review', {
                                detail: { review },
                            })
                        );
                    }}
                    className='h-8 w-8 p-0 text-blue-600 hover:bg-blue-50'
                    title={canEdit ? 'View/Edit' : 'View'}>
                    <Eye className='h-4 w-4' />
                </Button>
            )}
            {canDelete && (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                        document.dispatchEvent(
                            new CustomEvent('delete-reviews', {
                                detail: { ids: [review.id] },
                            })
                        );
                    }}
                    className='h-8 w-8 p-0 text-red-600 hover:bg-red-50'
                    title='Delete'>
                    <Trash2 className='h-4 w-4' />
                </Button>
            )}
        </div>
    );
};

export const reviewColumns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
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
        accessorKey: 'reviewerName',
        header: 'Reviewer',
        cell: ({ row }) => {
            const name = row.getValue('reviewerName');
            const email = row.original.reviewerEmail;
            const avatar = row.original.reviewerAvatar;
            const initials =
                name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'R';

            return (
                <div className='flex items-center gap-3 max-w-[250px]'>
                    <Avatar className='h-9 w-9 border'>
                        <AvatarImage src={avatar || undefined} alt={name} />
                        <AvatarFallback className='text-xs font-semibold bg-primary/10 text-primary'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className='space-y-0.5 min-w-0'>
                        <div className='font-medium text-sm truncate'>
                            {name || 'Anonymous'}
                        </div>
                        <div className='text-xs text-muted-foreground truncate'>
                            {email}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'trip',
        header: 'Trip',
        cell: ({ row }) => {
            const trip = row.original.trip;
            return (
                <div className='max-w-[200px]'>
                    <div className='text-sm font-medium truncate'>
                        {trip?.title || 'Unknown Trip'}
                    </div>
                    <div className='text-[10px] text-muted-foreground uppercase tracking-wider'>
                        Review Target
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => {
            const rating = row.getValue('rating');
            return (
                <div className='flex items-center gap-1'>
                    <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    'h-3.5 w-3.5',
                                    i < rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-muted-foreground/30'
                                )}
                            />
                        ))}
                    </div>
                    <span className='text-xs font-medium ml-1'>{rating}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'content',
        header: 'Review Content',
        cell: ({ row }) => {
            const content = row.getValue('content');
            const title = row.original.title;
            return (
                <div className='max-w-[300px] space-y-1'>
                    {title && (
                        <div className='text-sm font-semibold truncate'>
                            {title}
                        </div>
                    )}
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                        {content}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status');

            return (
                <Badge
                    variant={
                        status === 'APPROVED'
                            ? 'default'
                            : status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                    }
                    className='capitalize text-[10px] px-2 py-0 h-5 font-medium'>
                    {status.toLowerCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return (
                <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    <Calendar className='h-3 w-3' />
                    {date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ReviewActions review={row.original} />,
        enableSorting: false,
    },
];

