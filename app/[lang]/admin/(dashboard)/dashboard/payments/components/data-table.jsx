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
import { useCallback, useEffect, useMemo, useState } from 'react';

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
    Search,
    SortAsc,
    SortDesc,
    X,
} from 'lucide-react';

export function DataTable({
    groupedPayments,
    columns,
    data,
    typeFilter,
    setTypeFilter,
    setPaymentsData,
    onFilteredDataChange }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [dateSort, setDateSort] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10 });

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const processedData = useMemo(() => {
        let filtered = [...data];

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

    useCallback(() => {
        setPaymentsData(groupedPayments);
    }, [groupedPayments, setPaymentsData]);

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
                row.original.booking?.trip?.title,
                row.original.booking?.bookingReference,
                row.original.status,
                row.original.paymentMethod,
                row.original.paymentType,
                row.original.transactionId,
                row.original.booking?.email,
                String(row.original.amount),
                row.original.currency,
            ];

            return searchFields.some(
                field =>
                    field && String(field).toLowerCase().includes(searchValue)
            );
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
        const filteredRows = table.getFilteredRowModel().rows;
        const filteredData = filteredRows.map(row => row.original);

        if (onFilteredDataChange) {
            onFilteredDataChange(filteredData);
        }
    }, [
        onFilteredDataChange,
        debouncedSearchQuery,
        typeFilter,
        processedData,
        table,
    ]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [debouncedSearchQuery, typeFilter, dateRange, dateSort]);

    const handleDateRangeChange = (type, value) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value }));
    };

    const clearDateRange = () => {
        setDateRange({ start: '', end: '' });
    };

    return (
        <div className='w-full space-y-4'>
            <div className='flex items-center gap-3 flex-wrap'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='sm'>
                            {typeFilter === ''
                                ? 'All Statuses'
                                : typeFilter === 'COMPLETED'
                                ? 'Succeeded'
                                : formatKey(typeFilter)}
                            <ChevronDown className='ml-2 h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={typeFilter}
                            onValueChange={setTypeFilter}>
                            <DropdownMenuRadioItem value=''>
                                All Statuses
                            </DropdownMenuRadioItem>
                            {Object.keys(groupedPayments).map(type => (
                                <DropdownMenuRadioItem key={type} value={type}>
                                    {type === 'COMPLETED'
                                        ? 'Succeeded'
                                        : formatKey(type)}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='sm'>
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

                <div className='relative flex-1 min-w-[200px] max-w-xl'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <input
                        type='text'
                        placeholder='Search payments, trips, references...'
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                    />
                </div>
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-sm font-medium text-muted-foreground'>
                    Date Range:
                </span>
                <FormDatePicker
                    className='h-9'
                    value={dateRange.start}
                    placeholder='Start date'
                    onChange={e => handleDateRangeChange('start', e)}
                />
                <span className='text-sm text-muted-foreground'>to</span>
                <FormDatePicker
                    className='h-9'
                    value={dateRange.end}
                    placeholder='End date'
                    onChange={e => handleDateRangeChange('end', e)}
                />

                {(dateRange.start || dateRange.end) && (
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={clearDateRange}>
                        <X className='h-4 w-4 mr-1' />
                        Clear
                    </Button>
                )}
            </div>

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
                                            No payments found
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