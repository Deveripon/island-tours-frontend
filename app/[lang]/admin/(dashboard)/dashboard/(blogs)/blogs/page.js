import { getAllBlogs } from '@/app/_actions/blogs';
import { AllBlogs } from './components/data-tables/blogs/all-blogs';

const AllblogsListingPage = async () => {
    const response = await getAllBlogs('limit=100');

    const blogsData = response?.result?.data?.blogs || [];
    console.log('Blogs Data:', blogsData);

    return (
        <div className='wrapper '>
            <AllBlogs blogs={blogsData || []} />
        </div>
    );
};

export default AllblogsListingPage;

