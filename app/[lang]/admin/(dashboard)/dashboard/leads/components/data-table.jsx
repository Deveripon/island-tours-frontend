'use client';

import Mailchimp from '@/components/svg/mailchimp';
import N8nIcon from '@/components/svg/n8n';
import Zapier2Icon from '@/components/svg/zapier-2nd';
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
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import BulkActionBar from '../../components/common/bulk-action-bar';

export function DataTable({
    columns,
    data,
    isPushingZapier,
    isPushingN8n,
    isPushingMailchimp,
    isDeleting,
}) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const table = useReactTable({
        data,
        columns,
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
            // Apply source filter
            if (sourceFilter !== 'all') {
                const rowSource = String(
                    row.getValue('source') || ''
                ).toLowerCase();
                if (!rowSource.includes(sourceFilter.toLowerCase())) {
                    return false;
                }
            }

            // Apply search filter
            if (!filterValue) return true;
            const searchValue = String(filterValue).toLowerCase().trim();

            // Search in multiple fields
            const searchFields = [
                row.original.name,
                row.original.email,
                row.original.company,
                row.original.phone,
                row.original.source,
            ];

            return searchFields.some(
                field =>
                    field && String(field).toLowerCase().includes(searchValue)
            );
        },
    });

    useEffect(() => {
        table.setGlobalFilter(debouncedSearchQuery);
    }, [debouncedSearchQuery, sourceFilter, table]);

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    const handleDeleteSelected = () => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('delete-leads', {
                detail: { ids: selectedIds },
            })
        );
        setRowSelection({});
    };

    const handlePushBulkToZapier = () => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('push-to-zapier', {
                detail: { ids: selectedIds },
            })
        );
    };

    const handlePushAllToZapier = () => {
        const allIds = data?.map(lead => lead.id) || [];
        document.dispatchEvent(
            new CustomEvent('push-to-zapier', {
                detail: { ids: allIds },
            })
        );
    };

    const handlePushBulkTon8n = () => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('push-to-n8n', {
                detail: { ids: selectedIds },
            })
        );
    };

    const handlePushAllTon8n = () => {
        const allIds = data?.map(lead => lead.id) || [];
        document.dispatchEvent(
            new CustomEvent('push-to-n8n', {
                detail: { ids: allIds },
            })
        );
    };

    const handlePushBulkToMailchimp = () => {
        const selectedIds = selectedRows.map(row => row.original.id);
        document.dispatchEvent(
            new CustomEvent('push-bulk-to-mailchimp', {
                detail: { ids: selectedIds },
            })
        );
    };

    const handlePushAllToMailchimp = () => {
        document.dispatchEvent(new CustomEvent('push-all-to-mailchimp'));
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
                            placeholder='Search leads by name, email, company...'
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
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handlePushBulkToZapier}
                    disabled={isPushingZapier}
                    className='h-8 rounded-lg gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all min-w-[140px] font-medium px-3'>
                    <Zapier2Icon className='h-3.5 w-3.5' />
                    {isPushingZapier ? 'Pushing...' : 'Push to Zapier'}
                </Button>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handlePushBulkTon8n}
                    disabled={isPushingN8n}
                    className='h-8 rounded-lg gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all min-w-[130px] font-medium px-3'>
                    <N8nIcon className='h-3.5 w-3.5' />
                    {isPushingN8n ? 'Pushing...' : 'Push to n8n'}
                </Button>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handlePushBulkToMailchimp}
                    disabled={isPushingMailchimp}
                    className='h-8 rounded-lg gap-2 text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all min-w-[160px] font-medium px-3'>
                    <Mailchimp className='h-3.5 w-3.5' />
                    {isPushingMailchimp ? 'Pushing...' : 'Push to Mailchimp'}
                </Button>
                <div className='w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1' />
                <Button
                    size='sm'
                    variant='ghost'
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className='h-8 rounded-lg gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-medium px-3'>
                    <Trash2 className='h-3.5 w-3.5' />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </BulkActionBar>

            <div className='flex justify-end items-center '>
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={handlePushAllToZapier}
                        disabled={isPushingZapier}
                        className='gap-1 bg-orange-500/20 border-orange-300 hover:bg-orange-500/60 text-white min-w-[170px] font-medium'>
                        <Zapier2Icon className='h-5 w-5' />
                        {isPushingZapier ? 'Pushing...' : 'Push All To Zapier'}
                    </Button>
                    <Button
                        onClick={handlePushAllTon8n}
                        disabled={isPushingN8n}
                        className='gap-1 bg-pink-500/20 border-pink-300 hover:bg-pink-500/60 text-white min-w-[170px] font-medium'>
                        <N8nIcon className='h-5 w-5' />
                        {isPushingN8n ? 'Pushing...' : 'Push All To n8n'}
                    </Button>
                    <Button
                        onClick={handlePushAllToMailchimp}
                        disabled={isPushingMailchimp}
                        className='gap-1 bg-yellow-500/20 border-yellow-300 hover:bg-yellow-500/60 text-white min-w-[200px] font-medium'>
                        <Mailchimp className='h-5 w-5' />
                        {isPushingMailchimp
                            ? 'Pushing...'
                            : 'Push All To Mailchimp'}
                    </Button>
                </div>
            </div>
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
                                    colSpan={columns.length}
                                    className='h-32 text-center'>
                                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                                        <p className='text-sm font-medium'>
                                            No leads found
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

