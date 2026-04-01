'use client';

import { Permission } from '@/RBAC.config';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useRolePermission } from '@/hooks/useRolePermission';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Search,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BulkActionBar from '../../components/common/bulk-action-bar';

export function DataTable({ columns, data, isUpdating, isDeleting }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const canEdit = useRolePermission(Permission.EDIT_REVIEW);
    const canDelete = useRolePermission(Permission.DELETE_REVIEW);
    const canView = useRolePermission(Permission.VIEW_REVIEWS);

    const filteredColumns = columns.filter(col => {
        if (col.id === 'select') {
            return canEdit || canDelete;
        }
        if (col.id === 'actions') {
            return canEdit || canDelete || canView;
        }
        return true;
    });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const table = useReactTable({
        data,
        columns: filteredColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setSearchQuery,
        enableGlobalFilter: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            const searchValue = String(filterValue).toLowerCase().trim();

            const searchFields = [
                row.original.reviewerName,
                row.original.reviewerEmail,
                row.original.title,
                row.original.content,
                row.original.trip?.title,
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

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    const handleBulkDelete = () => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('delete-reviews', {
                detail: { ids: selectedIds },
            })
        );
    };

    const handleBulkStatusUpdate = status => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('bulk-update-status', {
                detail: { ids: selectedIds, status },
            })
        );
    };

    return (
        <div className='w-full space-y-4'>
            {/* Search Bar */}
            <div className='flex items-center gap-3'>
                <div className='flex-1 min-w-[200px]'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                            type='text'
                            placeholder='Search reviews by name, email, trip, content...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <BulkActionBar 
                selectedCount={selectedCount} 
                onDeselectAll={() => setRowSelection({})}
            >
                {canEdit && (
                    <>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleBulkStatusUpdate('APPROVED')}
                            disabled={isUpdating}
                            className='h-8 rounded-lg gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all font-medium px-3'>
                            <CheckCircle2 className='h-3.5 w-3.5' />
                            {isUpdating ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleBulkStatusUpdate('REJECTED')}
                            disabled={isUpdating}
                            className='h-8 rounded-lg gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all font-medium px-3'>
                            <XCircle className='h-3.5 w-3.5' />
                            {isUpdating ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </>
                )}
                {canEdit && canDelete && (
                    <div className='w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1' />
                )}
                {canDelete && (
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={handleBulkDelete}
                        disabled={isDeleting}
                        className='h-8 rounded-lg gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-medium px-3'>
                        <Trash2 className='h-3.5 w-3.5' />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                )}
            </BulkActionBar>

            {/* Table */}
            <div className='rounded-lg border bg-card shadow-sm'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow
                                key={headerGroup.id}
                                className='hover:bg-transparent'>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`h-12 ${
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }`}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className='flex items-center gap-1'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {{
                                                    asc: (
                                                        <ChevronUp className='h-4 w-4' />
                                                    ),
                                                    desc: (
                                                        <ChevronDown className='h-4 w-4' />
                                                    ),
                                                }[
                                                    header.column.getIsSorted()
                                                ] ?? null}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    className='hover:bg-muted/50 transition-colors'>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={filteredColumns.length}
                                    className='h-32 text-center'>
                                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                                        <p className='text-sm font-medium'>
                                            No reviews found
                                        </p>
                                        <p className='text-xs mt-1'>
                                            Try adjusting your search
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between px-2'>
                <div className='text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected
                </div>

                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        Previous
                    </Button>
                    <div className='flex items-center gap-1'>
                        {Array.from(
                            { length: table.getPageCount() },
                            (_, i) => i + 1
                        ).map(page => (
                            <Button
                                key={page}
                                variant={
                                    table.getState().pagination.pageIndex +
                                        1 ===
                                    page
                                        ? 'default'
                                        : 'outline'
                                }
                                size='sm'
                                onClick={() => table.setPageIndex(page - 1)}
                                className='h-9 w-9 p-0'>
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

