import { getAllBlogs } from '@/app/_actions/blogs';
import { AllBlogs } from './components/data-tables/blogs/all-blogs';

const AllblogsListingPage = async () => {
    const response = await getAllBlogs('limit=100');

    const blogsData = response?.result?.data || {};

    return (
        <div className='wrapper '>
            <AllBlogs blogs={blogsData?.blogs || []} />
        </div>
    );
};

export default AllblogsListingPage;

