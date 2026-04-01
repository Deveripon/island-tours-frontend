import { Button } from '@/components/ui/button';

const Pagination = () => {
    return (
        <div className='flex justify-center mt-12'>
            <div className='flex items-center space-x-2'>
                <Button variant='outline' disabled>
                    Previous
                </Button>
                <Button variant='default'>1</Button>
                <Button variant='outline'>2</Button>
                <Button variant='outline'>3</Button>
                <Button variant='outline'>Next</Button>
            </div>
        </div>
    );
};

export default Pagination;

