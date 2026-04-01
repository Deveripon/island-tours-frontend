import { getBlogsByTenant } from '@/app/_actions/blogs';
import { AllBlogs } from './components/data-tables/blogs/all-blogs';

const AllblogsListingPage = async ({ params }) => {
    const { tenant } = await params;

    const response = await getBlogsByTenant(tenant, 'limit=100');

    const allblogs = response?.data?.data || [];

    return (
        <div className='wrapper '>
            <AllBlogs tenantId={tenant} blogs={allblogs?.blogs} />
        </div>
    );
};

export default AllblogsListingPage;

