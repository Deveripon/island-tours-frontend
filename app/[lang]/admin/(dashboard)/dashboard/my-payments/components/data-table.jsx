'use client';
import { useDebounce } from '@/hooks/use-debounce';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { FormDatePicker } from '@/components/ui/date-picker';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
import { formatKey } from '@/lib/utils';
import {
    Calendar,
    ChevronDown,
    ChevronUp,
    Search,
    SortAsc,
    SortDesc,
} from 'lucide-react';

export function DataTable({
    groupedPayments,
    columns,
    data,
    typeFilter,
    setTypeFilter }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [dateSort, setDateSort] = useState(''); // 'newest', 'oldest', or ''
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Filter and sort data based on date range and date sort
    const processedData = useMemo(() => {
        let filtered = [...data];

        // Apply date range filter
        if (dateRange.start || dateRange.end) {
            filtered = filtered.filter(row => {
                const rowDate = new Date(row.createdAt);
                const startDate = dateRange.start
                    ? new Date(dateRange.start)
                    : null;
                const endDate = dateRange.end ? new Date(dateRange.end) : null;

                if (startDate && endDate) {
                    return rowDate >= startDate && rowDate <= endDate;
                } else if (startDate) {
                    return rowDate >= startDate;
                } else if (endDate) {
                    return rowDate <= endDate;
                }
                return true;
            });
        }

        // Apply date sorting
        if (dateSort === 'newest') {
            filtered.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (dateSort === 'oldest') {
            filtered.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        }

        return filtered;
    }, [data, dateRange, dateSort]);

    const table = useReactTable({
        data: processedData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        enableFilters: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        globalFilterFn: (row, id, filterValue) => {
            const searchValue = String(filterValue).toLowerCase();

            // Search in the trip title
            const tripTitle = String(
                row.original.booking?.trip?.title || ''
            ).toLowerCase();
            if (tripTitle.includes(searchValue)) return true;

            // Search in booking reference
            const bookingReference = String(
                row.original.booking?.bookingReference || ''
            ).toLowerCase();
            if (bookingReference.includes(searchValue)) return true;

            // Search in status
            const status = String(row.original.status || '').toLowerCase();
            if (status.includes(searchValue)) return true;

            // Search in payment method
            const paymentMethod = String(
                row.original.paymentMethod || ''
            ).toLowerCase();
            if (paymentMethod.includes(searchValue)) return true;

            // Search in payment type
            const paymentType = String(
                row.original.paymentType || ''
            ).toLowerCase();
            if (paymentType.includes(searchValue)) return true;

            // Search in transaction ID
            const transactionId = String(
                row.original.transactionId || ''
            ).toLowerCase();
            if (transactionId.includes(searchValue)) return true;

            // Search in email
            const email = String(
                row.original.booking?.email || ''
            ).toLowerCase();
            if (email.includes(searchValue)) return true;

            // Search in amount
            const amount = String(row.original.amount || '').toLowerCase();
            if (amount.includes(searchValue)) return true;

            // Search in currency
            const currency = String(row.original.currency || '').toLowerCase();
            if (currency.includes(searchValue)) return true;

            return false;
        },
        filterFns: {
            customTypeFilter: (row, id, filterValue) => {
                const status = row.getValue(id);
                return (
                    filterValue === undefined ||
                    filterValue === '' ||
                    status === filterValue
                );
            },
        } });

    // Apply global search filter
    useEffect(() => {
        if (debouncedSearchQuery) {
            table.setGlobalFilter(debouncedSearchQuery);
        } else {
            table.setGlobalFilter('');
        }
    }, [debouncedSearchQuery, table]);

    // Apply type filter when changed
    useEffect(() => {
        const statusColumn = table.getColumn('status');
        if (statusColumn) {
            if (typeFilter === '') {
                statusColumn.setFilterValue(undefined);
            } else {
                statusColumn.setFilterValue(typeFilter);
            }
        }
    }, [typeFilter, table]);

    const handleDateRangeChange = (type, value) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value }));
    };

    const clearDateRange = () => {
        setDateRange({ start: '', end: '' });
    };

    return (
        <div className='w-full'>
            <div className='flex items-center py-4 gap-2 flex-wrap'>
                {/* Type Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className='text-sm'>
                            {typeFilter === ''
                                ? 'All Types'
                                : formatKey(
                                      Object.keys(groupedPayments).find(
                                          t => t === typeFilter
                                      ) || ''
                                  ) || 'Filter by Type'}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={typeFilter}
                            onValueChange={setTypeFilter}>
                            <DropdownMenuRadioItem value=''>
                                All Types
                            </DropdownMenuRadioItem>
                            {Object.keys(groupedPayments).map(type => (
                                <DropdownMenuRadioItem key={type} value={type}>
                                    {formatKey(type)}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Sort */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' className='text-sm'>
                            {dateSort === 'newest' ? (
                                <>
                                    <SortDesc className='mr-2 h-4 w-4' />
                                    Newest First
                                </>
                            ) : dateSort === 'oldest' ? (
                                <>
                                    <SortAsc className='mr-2 h-4 w-4' />
                                    Oldest First
                                </>
                            ) : (
                                <>
                                    <Calendar className='mr-2 h-4 w-4' />
                                    Sort by Date
                                </>
                            )}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Sort by Date</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={dateSort}
                            onValueChange={setDateSort}>
                            <DropdownMenuRadioItem value=''>
                                Default
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value='newest'>
                                Newest First
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value='oldest'>
                                Oldest First
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Search Input */}
                <div className='flex-1 min-w-[200px]'>
                    <div className='relative max-w-xl w-full'>
                        <input
                            type='text'
                            placeholder='Search payments, trips, references...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full text-[14px] pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/90 focus:border-transparent'
                        />
                        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                    </div>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className='flex items-center gap-2 pb-4 flex-wrap'>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium'>Date Range:</label>
                    <FormDatePicker
                        className='!h-[36px]'
                        value={dateRange.start}
                        placeholder='Select start date'
                        onChange={e => handleDateRangeChange('start', e)}
                    />
                    <span className='text-sm text-gray-500'>to</span>
                    <FormDatePicker
                        className='!h-[36px]'
                        value={dateRange.end}
                        placeholder='Select end date'
                        onChange={e => handleDateRangeChange('end', e)}
                    />

                    {(dateRange.start || dateRange.end) && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={clearDateRange}
                            className='text-sm'>
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`${
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }`}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className='flex items-center'>
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
                                    }>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell className='' key={cell.id}>
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
                                    className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between space-x-2 py-4'>
                <div className='text-sm text-gray-700'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
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
                                className='w-8 h-8 p-0'>
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

