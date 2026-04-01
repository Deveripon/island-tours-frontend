'use client';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { categoryTypeColors } from '@/data/type-colors';
import { formatKey, generateSlug } from '@/lib/utils';
import { Tag } from 'lucide-react';
import { CategoryActionDropdown } from './category-action-dropdown';

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
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const name = row.getValue('name');

            return (
                <div className='max-w-[200px]'>
                    <div className='font-medium text-sm truncate'>{name}</div>
                </div>
            );
        },
    },
    {
        id: 'slug',
        accessorFn: row => generateSlug(row.name),
        header: 'Slug',
        cell: ({ row }) => (
            <div className='flex items-center gap-1.5 max-w-[250px]'>
                <Tag className='h-3 w-3 text-muted-foreground flex-shrink-0' />
                <span className='font-mono text-xs text-muted-foreground truncate'>
                    {row.getValue('slug')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'types',
        header: 'Category Types',
        cell: ({ row }) => {
            const typeValue = row.getValue('types');
            return (
                <div className='flex flex-wrap gap-1.5'>
                    {Array.isArray(typeValue) &&
                        typeValue.map(type => {
                            const colors = categoryTypeColors[type] || {
                                bg: 'bg-gray-100',
                                text: 'text-gray-700',
                                border: 'border-gray-200',
                            };

                            return (
                                <Badge
                                    key={type}
                                    variant='secondary'
                                    className={`text-xs ${colors.bg} ${colors.text} ${colors.border}`}>
                                    {formatKey(type)}
                                </Badge>
                            );
                        })}
                </div>
            );
        },
        filterFn: (row, id, filterValue) => {
            const types = row.getValue(id);
            return (
                filterValue === undefined ||
                filterValue === '' ||
                types.includes(filterValue)
            );
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <div className='text-sm text-muted-foreground'>
                    {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric' })}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const category = row.original;
            return <CategoryActionDropdown category={category} />;
        },
    },
];