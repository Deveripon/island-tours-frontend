'use client';

import { columns } from './columns';
import { DataTable } from './data-table';

const PageContent = ({ customers }) => {
    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Customers
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage your customer database and view their information
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={customers || []} />
        </div>
    );
};

export default PageContent;