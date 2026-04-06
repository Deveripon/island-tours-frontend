'use client';
import { columns } from './trip-package-column';
import { TripPackages } from './trip-package-table';

export function AllTripPackages({ trips }) {
    return (
        <div className='space-y-6'>
            <div className='space-y-1'>
                <h1 className='text-2xl font-semibold tracking-tight'>
                    All Trip Packages
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Manage your trip packages and view analytics
                </p>
            </div>

            <TripPackages
                data={trips || []}
                enableExports={false}
                columns={columns}
            />
        </div>
    );
}
