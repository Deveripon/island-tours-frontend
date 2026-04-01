import { Blogs } from './blog-table';
import { columns } from './blogs-column';

export function AllBlogs({ blogs, tenantId }) {
    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        All Blogs
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Manage your blog posts, drafts, and published content
                    </p>
                </div>
            </div>

            {/* Blog Table */}
            <Blogs
                data={blogs || []}
                tenantId={tenantId}
                columns={columns}
            />
        </div>
    );
}