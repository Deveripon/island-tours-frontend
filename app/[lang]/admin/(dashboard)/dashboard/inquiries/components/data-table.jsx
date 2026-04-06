'use client';
import { Permission } from '@/RBAC.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useRolePermission } from '@/hooks/useRolePermission';
import { cn } from '@/lib/utils';
import {
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronUp,
    Clock,
    Info,
    Mail,
    MailCheck,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BulkActionBar from '../../components/common/bulk-action-bar';
import { TbRestore } from 'react-icons/tb';
import BulkActionSpinner from '../../media/components/bulk-action-spinner';

export function DataTable({
    columns,
    data,
    typeFilter,
    setTypeFilter,
    selected = {},
    onSelectionChange,
    loading,
    isDeleting,
    inquiryIdToDelete,
}) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('INBOX');

    const rowSelection = selected;
    const setRowSelection = useMemo(
        () => onSelectionChange,
        [onSelectionChange]
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filter data based on active tab
    const filteredDataByTab = useMemo(() => {
        let filtered = data;

        if (activeTab === 'TRASHED') {
            filtered = data.filter(i => i.status.includes('TRASHED'));
        } else if (activeTab === 'UNREAD') {
            filtered = data.filter(
                i =>
                    i.status.includes('PENDING') &&
                    !i.status.includes('TRASHED')
            );
        } else if (activeTab === 'PENDING') {
            filtered = data.filter(
                i =>
                    !i.status.includes('REPLIED') &&
                    !i.status.includes('TRASHED')
            );
        } else if (activeTab === 'READ') {
            filtered = data.filter(
                i => i.status.includes('READ') && !i.status.includes('TRASHED')
            );
        } else if (activeTab === 'REPLIED') {
            filtered = data.filter(
                i =>
                    i.status.includes('REPLIED') &&
                    !i.status.includes('TRASHED')
            );
        } else {
            filtered = data.filter(i => !i.status.includes('TRASHED'));
        }

        return filtered;
    }, [data, activeTab]);

    const table = useReactTable({
        data: filteredDataByTab,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        enableFilters: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
            pagination,
        },
        globalFilterFn: (row, id, filterValue) => {
            const searchValue = String(filterValue).toLowerCase();

            const searchFields = [
                row.original.subject,
                row.original.name,
                row.original.message,
                row.original.email,
            ];

            return searchFields.some(
                field =>
                    field && String(field).toLowerCase().includes(searchValue)
            );
        },
    });

    useEffect(() => {
        table.setGlobalFilter(debouncedSearchQuery);
    }, [debouncedSearchQuery, table]);

    useEffect(() => {
        const statusColumn = table.getColumn('status');
        if (statusColumn) {
            statusColumn.setFilterValue(
                typeFilter === '' ? undefined : typeFilter
            );
        }
    }, [typeFilter, table]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        setRowSelection({});
    }, [debouncedSearchQuery, activeTab, setRowSelection]);

    const getStatusIcon = status => {
        if (status.includes('REPLIED'))
            return <MailCheck className='h-4 w-4 text-success' />;
        if (status.includes('PENDING'))
            return <Clock className='h-4 w-4 text-warning' />;
        return <Mail className='h-4 w-4 text-muted-foreground' />;
    };

    const getStatusBadge = status => {
        if (status.includes('PENDING'))
            return {
                variant: 'outline',
                className:
                    'bg-destructive/10 border-destructive/30 text-destructive-foreground',
            };
        if (status.includes('REPLIED'))
            return {
                variant: 'outline',
                className:
                    'bg-success/10 border-success/30 text-success-foreground',
            };
        return {
            variant: 'outline',
            className: 'bg-muted border-border text-muted-foreground',
        };
    };

    const getTabCount = tab => {
        if (tab === 'INBOX')
            return data.filter(i => !i.status.includes('TRASHED')).length;
        if (tab === 'UNREAD')
            return data.filter(
                i =>
                    i.status.includes('PENDING') &&
                    !i.status.includes('TRASHED') &&
                    !i.status.includes('READ')
            ).length;
        if (tab === 'PENDING')
            return data.filter(
                i =>
                    !i.status.includes('REPLIED') &&
                    !i.status.includes('TRASHED')
            ).length;
        if (tab === 'READ')
            return data.filter(
                i => i.status.includes('READ') && !i.status.includes('TRASHED')
            ).length;
        if (tab === 'REPLIED')
            return data.filter(
                i =>
                    i.status.includes('REPLIED') &&
                    !i.status.includes('TRASHED')
            ).length;
        if (tab === 'TRASHED')
            return data.filter(i => i.status.includes('TRASHED')).length;
        return 0;
    };

    const handleDeleteAll = () => {
        const selectedIds = table
            .getSelectedRowModel()
            .rows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('delete-all-inquiries', {
                detail: selectedIds,
            })
        );
    };

    const handleMoveToTrash = () => {
        const selected = table
            .getSelectedRowModel()
            .rows.map(row => row.original);
        document.dispatchEvent(
            new CustomEvent('trash-all-inquiries', {
                detail: selected,
            })
        );
    };

    const handleRestoreAll = () => {
        const selected = table
            .getSelectedRowModel()
            .rows.map(row => row.original);
        document.dispatchEvent(
            new CustomEvent('restore-all-inquiries', {
                detail: selected,
            })
        );
    };

    const hasDeletePermission = useRolePermission(Permission.DELETE_ENQUIRY);
    const hasViewPermission = useRolePermission(Permission.VIEW_ENQUIRIES);

    return (
        <div className='space-y-4'>
            {/* Search Bar */}
            <div className='flex items-center justify-between gap-2'>
                <div className='relative flex-1 max-w-xl'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search inquiries by name, email, subject...'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className='pl-9 h-9'
                    />
                </div>
            </div>

            {/* Selection Info */}
            <BulkActionBar
                selectedCount={Object.keys(rowSelection).length}
                onDeselectAll={() => setRowSelection({})}
            >
                {activeTab === 'TRASHED' && hasDeletePermission && (
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={e => {
                            e.stopPropagation();
                            handleRestoreAll();
                        }}
                        className='h-8 rounded-lg gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all font-medium px-3'>
                        <TbRestore className='h-3.5 w-3.5' />
                        Restore ({Object.keys(rowSelection).length})
                    </Button>
                )}

                {hasDeletePermission && (
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={e => {
                            e.stopPropagation();
                            activeTab !== 'TRASHED'
                                ? handleMoveToTrash()
                                : handleDeleteAll();
                        }}
                        className='h-8 rounded-lg gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-medium px-3'>
                        <Trash2 className='h-3.5 w-3.5' />
                        {activeTab === 'TRASHED'
                            ? 'Delete Permanently'
                            : 'Move to Trash'}{' '}
                        ({Object.keys(rowSelection).length})
                    </Button>
                )}
            </BulkActionBar>

            {/* Tabs */}
            <div className='rounded-lg border bg-card shadow-sm overflow-hidden'>
                <div className='border-b bg-muted/30'>
                    <div className='flex items-center justify-between px-6'>
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2 py-3'>
                                <Checkbox
                                    id='selectAll'
                                    checked={table.getIsAllPageRowsSelected()}
                                    onCheckedChange={value =>
                                        table.toggleAllPageRowsSelected(!!value)
                                    }
                                />
                                <label
                                    htmlFor='selectAll'
                                    className='text-xs cursor-pointer text-muted-foreground'>
                                    Select All
                                </label>
                            </div>

                            {[
                                'INBOX',
                                'UNREAD',
                                'READ',
                                'REPLIED',
                                'PENDING',
                                'TRASHED',
                            ].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 text-xs sm:text-sm py-4 whitespace-nowrap transition-all ${
                                        activeTab === tab
                                            ? 'text-primary border-b-2 border-b-primary font-medium'
                                            : 'text-muted-foreground hover:text-foreground border-b-2 border-b-transparent'
                                    }`}>
                                    {tab === 'INBOX'
                                        ? 'All'
                                        : tab.charAt(0) +
                                          tab.slice(1).toLowerCase()}{' '}
                                    <span className='text-xs opacity-70'>
                                        ({getTabCount(tab)})
                                    </span>
                                    {tab === 'PENDING' &&
                                        getTabCount(tab) > 0 && (
                                            <Badge
                                                variant='destructive'
                                                className='ml-2 text-xs'>
                                                {getTabCount(tab)}
                                            </Badge>
                                        )}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                                table.getColumn('createdAt')?.toggleSorting()
                            }
                            className='text-xs'>
                            Sort by Date
                            {table.getColumn('createdAt')?.getIsSorted() ===
                            'desc' ? (
                                <ChevronDown className='h-3 w-3 ml-1' />
                            ) : (
                                <ChevronUp className='h-3 w-3 ml-1' />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Inbox Items */}
                <div className='min-h-[50vh]'>
                    {loading && (
                        <BulkActionSpinner
                            bulkSelectedItems={
                                inquiryIdToDelete
                                    ? inquiryIdToDelete?.length
                                    : Object.keys(rowSelection).length
                            }
                            title={
                                activeTab === 'TRASHED'
                                    ? isDeleting
                                        ? 'Deleting Inquiries'
                                        : 'Restoring Inquiries'
                                    : 'Moving Inquiries to Trash'
                            }
                            state={
                                activeTab === 'TRASHED'
                                    ? isDeleting
                                        ? 'Deleting'
                                        : 'Restoring'
                                    : 'Trashing'
                            }
                            className='min-h-[40vh]'
                        />
                    )}
                    {!loading &&
                        (table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => {
                                const inquiry = row.original;
                                const isSelected = row.getIsSelected();
                                const status = inquiry.status;

                                return (
                                    <div
                                        onClick={e => {
                                            e.stopPropagation();
                                            hasViewPermission &&
                                                document.dispatchEvent(
                                                    new CustomEvent(
                                                        'view-inquiry-details',
                                                        {
                                                            detail: inquiry,
                                                        }
                                                    )
                                                );
                                        }}
                                        key={row.id}
                                        className={cn(
                                            'group cursor-pointer border-b transition-colors duration-150 hover:bg-muted/50',
                                            isSelected && 'bg-muted',
                                            status.includes('READ') &&
                                                !isSelected &&
                                                'bg-muted/20'
                                        )}>
                                        <div className='grid grid-cols-12 px-6 py-3'>
                                            <div className='col-span-9 flex items-center gap-4'>
                                                <Checkbox
                                                    onClick={e =>
                                                        e.stopPropagation()
                                                    }
                                                    checked={isSelected}
                                                    onCheckedChange={value =>
                                                        row.toggleSelected(
                                                            !!value
                                                        )
                                                    }
                                                />

                                                <div className='flex-shrink-0'>
                                                    {getStatusIcon(status)}
                                                </div>

                                                <div className='flex items-center gap-4 flex-1 min-w-0'>
                                                    <span
                                                        className={cn(
                                                            'text-sm truncate w-32',
                                                            status.includes(
                                                                'READ'
                                                            )
                                                                ? 'font-normal'
                                                                : 'font-medium'
                                                        )}>
                                                        {inquiry.name}
                                                    </span>
                                                    <span className='text-sm text-muted-foreground truncate w-48'>
                                                        {inquiry.email}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'text-sm truncate w-40',
                                                            status.includes(
                                                                'READ'
                                                            )
                                                                ? 'font-normal'
                                                                : 'font-medium'
                                                        )}>
                                                        {inquiry.subject}
                                                    </span>
                                                    <p className='text-sm text-muted-foreground line-clamp-1 flex-1'>
                                                        {inquiry.message}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='col-span-3 flex items-center justify-end gap-2'>
                                                {!status.includes('READ') &&
                                                    !status.includes(
                                                        'TRASHED'
                                                    ) && (
                                                        <Badge
                                                            variant={
                                                                getStatusBadge(
                                                                    status
                                                                ).variant
                                                            }
                                                            className={
                                                                getStatusBadge(
                                                                    status
                                                                ).className
                                                            }>
                                                            {status.includes(
                                                                'PENDING'
                                                            ) && 'New'}
                                                        </Badge>
                                                    )}

                                                <span className='text-xs text-muted-foreground'>
                                                    {inquiry.createdAt &&
                                                        new Date(
                                                            inquiry.createdAt
                                                        ).toLocaleDateString(
                                                            'en-US',
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                            }
                                                        )}
                                                </span>

                                                <div className='flex items-center gap-1'>
                                                    {status.includes(
                                                        'TRASHED'
                                                    ) &&
                                                        hasDeletePermission && (
                                                            <Button
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    document.dispatchEvent(
                                                                        new CustomEvent(
                                                                            'restore-inquiry',
                                                                            {
                                                                                detail: inquiry,
                                                                            }
                                                                        )
                                                                    );
                                                                }}
                                                                size='sm'
                                                                variant='ghost'
                                                                className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'>
                                                                <TbRestore className='h-4 w-4' />
                                                            </Button>
                                                        )}

                                                    {hasViewPermission && (
                                                        <Button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                document.dispatchEvent(
                                                                    new CustomEvent(
                                                                        'view-inquiry-details',
                                                                        {
                                                                            detail: inquiry,
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            size='sm'
                                                            variant='ghost'
                                                            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'>
                                                            <Info className='h-4 w-4' />
                                                        </Button>
                                                    )}

                                                    {status.includes(
                                                        'REPLIED'
                                                    ) ? (
                                                        <Button
                                                            size='sm'
                                                            variant='ghost'
                                                            className='h-8 w-8 p-0 text-success cursor-default'>
                                                            <MailCheck className='h-4 w-4' />
                                                        </Button>
                                                    ) : (
                                                        hasViewPermission && (
                                                            <Button
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    document.dispatchEvent(
                                                                        new CustomEvent(
                                                                            'view-inquiry-details',
                                                                            {
                                                                                detail: inquiry,
                                                                            }
                                                                        )
                                                                    );
                                                                }}
                                                                size='sm'
                                                                variant='ghost'
                                                                className='h-8 w-8 p-0 text-info hover:text-info/80'>
                                                                <Mail className='h-4 w-4' />
                                                            </Button>
                                                        )
                                                    )}

                                                    {hasDeletePermission && (
                                                        <Button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                activeTab !==
                                                                'TRASHED'
                                                                    ? document.dispatchEvent(
                                                                          new CustomEvent(
                                                                              'trash-inquiry',
                                                                              {
                                                                                  detail: inquiry,
                                                                              }
                                                                          )
                                                                      )
                                                                    : document.dispatchEvent(
                                                                          new CustomEvent(
                                                                              'delete-inquiry',
                                                                              {
                                                                                  detail: inquiry?.id,
                                                                              }
                                                                          )
                                                                      );
                                                            }}
                                                            size='sm'
                                                            variant='ghost'
                                                            className='h-8 w-8 p-0 text-destructive hover:text-destructive/80'>
                                                            <Trash2 className='h-4 w-4' />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className='flex flex-col items-center justify-center min-h-[40vh] text-center'>
                                <Mail className='h-12 w-12 text-muted-foreground/50 mb-4' />
                                <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                                    No inquiries found
                                </h3>
                                <p className='text-xs text-muted-foreground'>
                                    {searchQuery
                                        ? 'Try adjusting your search terms'
                                        : "When you receive inquiries, they'll appear here"}
                                </p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
                <div className='flex justify-end'>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}>
                            First
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>

                        <div className='flex items-center gap-1 px-3'>
                            <span className='text-sm text-muted-foreground'>
                                Page
                            </span>
                            <strong className='text-sm'>
                                {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </strong>
                        </div>

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}>
                            Last
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

