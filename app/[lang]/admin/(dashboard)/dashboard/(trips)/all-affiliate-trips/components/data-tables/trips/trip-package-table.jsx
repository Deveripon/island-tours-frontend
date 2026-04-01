'use client';

import { Permission } from '@/RBAC.config';
import {
    createNewAffiliateTrip,
    deleteAffiliateTripById,
    getSingleAffiliateTrip,
    updateAffiliateTripById,
} from '@/app/_actions/trips/affiliateTripsAction';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
import { useDebounce } from '@/hooks/use-debounce';
import { useRolePermission } from '@/hooks/useRolePermission';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Download, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteConfirmationDialog from '../../../../../components/common/delete-confirmation-dialog';

export function TripPackages({ tenantId, columns, data, enableExports }) {
    const [sorting, setSorting] = useState([]);
    const [loading, setLoading] = useState(null);
    const [columnFilters, setColumnFilters] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [columnVisibility, setColumnVisibility] = useState({});

    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [rowSelection, setRowSelection] = useState({});

    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const [tripFilter, setTripFilter] = useState('All Packages');
    const [statusFilter, setStatusFilter] = useState('All');
    const router = useRouter();

    const hasCreatePermission = useRolePermission(Permission.CREATE_TRIP);

    // Update local data when props change
    useEffect(() => {
        setTableData(data);
    }, [data]);

    // Listen for duplication events
    useEffect(() => {
        const handleDuplicate = async e => {
            const tripId = e.detail;
            const detailsOfTrip = await getSingleAffiliateTrip(tripId);

            if (detailsOfTrip?.success) {
                const tripData = {
                    ...detailsOfTrip?.trip?.data,
                    title: `Copy of ${detailsOfTrip?.trip?.data?.title}`,
                    addons:
                        detailsOfTrip?.trip?.data?.addons &&
                        detailsOfTrip?.trip?.data?.addons.map(
                            addon => addon.addonId && addon.addonId
                        ),
                };

                if (tripData) {
                    const res = await createNewAffiliateTrip(tripData);
                    if (res?.success) {
                        toast.success('Trip duplicated successfully');
                    }
                }
            }
        };

        document.addEventListener('duplicatePackage', handleDuplicate);

        return () => {
            document.removeEventListener('duplicatePackage', handleDuplicate);
        };
    }, []);

    const handleDeleteCancel = () => {
        setIsShowConfirm(false);
        setTripToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!tripToDelete) return;

        setIsDeleting(true);

        try {
            const result = await deleteAffiliateTripById(tripToDelete);

            if (result?.success === true) {
                toast.success('Trip deleted successfully');
            } else {
                const errorMessage =
                    result?.error &&
                    typeof result.error === 'object' &&
                    'message' in result.error
                        ? result.error.message
                        : result?.error || 'Failed to delete Trip';

                toast.error(errorMessage);
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setIsShowConfirm(false);
            setTripToDelete(null);
        }
    };

    const table = useReactTable({
        data: tableData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedSearchQuery,
        },
        meta: {
            changeStatus: async (id, status) => {
                try {
                    setLoading(id);

                    const result = await updateAffiliateTripById(id, {
                        status });

                    if (result.success) {
                        setTableData(prevData =>
                            prevData.map(item =>
                                item.id === id ? { ...item, status } : item
                            )
                        );

                        toast.success('Status Updated');
                    } else {
                        throw new Error(
                            result.error?.message || 'Update failed'
                        );
                    }
                } catch (error) {
                    toast.error('There was an error while updating');
                } finally {
                    setLoading(null);
                }
            },
            deleteTrip: async id => {
                setTripToDelete(id);
                setIsShowConfirm(true);
            },

            editTrip: id => {
                const params = `edit&mode=update&id=${id}`;
                router.push(
                    `/${tenantId}/dashboard/create-affiliate-trips?${params}`
                );
            },
            loading,
        } });

    useEffect(() => {
        table.setGlobalFilter(debouncedSearchQuery);
    }, [debouncedSearchQuery, table]);

    const exportPDF = () => {};

    const exportExcel = () => {};

    return (
        <div className='w-full space-y-4'>
            {/* Filter and Action Bar */}
            <div className='flex flex-wrap items-center gap-3'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='min-w-[150px] justify-between'>
                            <span className='truncate'>{tripFilter}</span>
                            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-[200px]'>
                        <DropdownMenuRadioGroup
                            value={tripFilter}
                            onValueChange={value => setTripFilter(value)}>
                            {['All Packages', 'Best Selling', 'Top Rated'].map(
                                item => (
                                    <DropdownMenuRadioItem
                                        key={item}
                                        value={item}>
                                        {item}
                                    </DropdownMenuRadioItem>
                                )
                            )}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='min-w-[150px] justify-between'>
                            <span className='truncate'>{statusFilter}</span>
                            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-[200px]'>
                        <DropdownMenuRadioGroup
                            value={statusFilter}
                            onValueChange={value => {
                                setStatusFilter(value);

                                if (value === 'Inactive') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('INACTIVE');
                                } else if (value === 'Draft') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('DRAFT');
                                } else if (value === 'Active') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('ACTIVE');
                                } else if (value === 'Archived') {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue('ARCHIVED');
                                } else {
                                    table
                                        .getColumn('status')
                                        ?.setFilterValue(undefined);
                                }
                            }}>
                            {[
                                'All',
                                'Draft',
                                'Active',
                                'Inactive',
                                'Archived',
                            ].map(item => (
                                <DropdownMenuRadioItem key={item} value={item}>
                                    {item}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className='flex-1 min-w-[200px]'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                            type='text'
                            placeholder='Search trips...'
                            value={searchQuery}
                            onChange={event =>
                                setSearchQuery(event.target.value)
                            }
                            className='w-full h-9 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-2 ml-auto'>
                    {enableExports && (
                        <>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={exportPDF}>
                                <FileText className='mr-2 h-4 w-4' />
                                PDF
                            </Button>

                            <Button
                                variant='outline'
                                size='sm'
                                onClick={exportExcel}>
                                <Download className='mr-2 h-4 w-4' />
                                Excel
                            </Button>
                        </>
                    )}

                    {hasCreatePermission && (
                        <Link
                            href={`/${tenantId}/dashboard/create-affiliate-trips`}>
                            <Button size='sm'>
                                <HugeiconsIcon icon={Add01Icon} />
                                Create Package
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='rounded-lg border bg-card shadow-sm'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            className='h-12'
                                            key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
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
                                            No results found
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

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isShowConfirm={isShowConfirm}
                setIsShowConfirm={setIsShowConfirm}
                handleDeleteConfirm={handleDeleteConfirm}
                handleDeleteCancel={handleDeleteCancel}
                isDeleting={isDeleting}
                title='Are you absolutely sure?'
                description='This action cannot be undone. This will permanently delete this trip and all associated data.'
            />
        </div>
    );
}

