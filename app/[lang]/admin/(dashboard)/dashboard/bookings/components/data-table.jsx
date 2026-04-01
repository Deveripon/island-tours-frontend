'use client';
import { useDebounce } from '@/hooks/use-debounce';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Eye, RefreshCw, Search } from 'lucide-react';

export function DataTable({ columns, data, typeFilter, setTypeFilter }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10 });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const table = useReactTable({
        data,
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
                row.original.trip?.title,
                row.original.trip?.destination?.name,
                row.original.bookingReference,
                row.original.status,
                row.original.contactInfo?.email,
                row.original.travellerInfo?.adults?.[0]?.firstName,
                row.original.travellerInfo?.adults?.[0]?.lastName,
            ];

            return searchFields.some(
                field =>
                    field && String(field).toLowerCase().includes(searchValue)
            );
        } });

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
    }, [debouncedSearchQuery, typeFilter]);

    const exportToCSV = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const dataToExport =
            selectedRows.length > 0
                ? selectedRows.map(row => row.original)
                : data;

        const csvContent = [
            [
                'Reference',
                'Trip',
                'Destination',
                'Start Date',
                'Duration',
                'Status',
                'Total',
                'Paid',
                'Pending',
            ].join(','),
            ...dataToExport.map(booking =>
                [
                    booking.bookingReference,
                    booking.trip?.title || '',
                    booking.trip?.destination?.name || '',
                    format(new Date(booking.tripStartDate), 'yyyy-MM-dd'),
                    booking.totalDays,
                    booking.status,
                    booking.totalPayable,
                    booking.paidAmount,
                    booking.pendingAmount,
                ].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setTypeFilter('');
        setRowSelection({});
        setPagination({ pageIndex: 0, pageSize: 10 });
        table.resetColumnFilters();
        table.resetGlobalFilter();
    };

    return (
        <div className='w-full space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='relative flex-1 min-w-[200px] max-w-xl'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <input
                        type='text'
                        placeholder='Search bookings...'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                    />
                </div>

                <div className='flex gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Eye className='h-4 w-4 mr-2' />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                Toggle Columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(column => column.getCanHide())
                                .map(column => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value =>
                                            column.toggleVisibility(value)
                                        }>
                                        {column.id
                                            .toLowerCase()
                                            .charAt(0)
                                            .toUpperCase() +
                                            column.id.toLowerCase().slice(1)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/*   <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Download className='h-4 w-4 mr-2' />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                Export Options
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem onClick={exportToCSV}>
                                <FileText className='h-4 w-4 mr-2' />
                                Export CSV
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    <Button variant='outline' size='sm' onClick={resetFilters}>
                        <RefreshCw className='h-4 w-4 mr-2' />
                        Reset
                    </Button>
                </div>
            </div>

            {Object.keys(rowSelection).length > 0 && (
                <div className='flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                    <span className='text-sm text-blue-700 dark:text-blue-300 font-medium'>
                        {Object.keys(rowSelection).length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected
                    </span>
                    <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setRowSelection({})}
                        className='ml-auto h-7'>
                        Clear
                    </Button>
                </div>
            )}

            <div className='rounded-lg border bg-card shadow-sm'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead className='h-12' key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
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
                                    }>
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
                                            No bookings found
                                        </p>
                                        <p className='text-xs mt-1'>
                                            Try adjusting your search or filters
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between px-2'>
                <div className='text-sm text-muted-foreground'>
                    Showing {table.getRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} entries
                    {table.getFilteredRowModel().rows.length !== data.length &&
                        ` (filtered from ${data.length} total)`}
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
                            { length: Math.min(table.getPageCount(), 5) },
                            (_, i) => {
                                const currentPage =
                                    table.getState().pagination.pageIndex;
                                let pageNumber;

                                if (table.getPageCount() <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage < 3) {
                                    pageNumber = i + 1;
                                } else if (
                                    currentPage >
                                    table.getPageCount() - 3
                                ) {
                                    pageNumber = table.getPageCount() - 4 + i;
                                } else {
                                    pageNumber = currentPage - 1 + i;
                                }

                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={
                                            currentPage + 1 === pageNumber
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size='sm'
                                        onClick={() =>
                                            table.setPageIndex(pageNumber - 1)
                                        }
                                        className='h-9 w-9 p-0'>
                                        {pageNumber}
                                    </Button>
                                );
                            }
                        )}
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
