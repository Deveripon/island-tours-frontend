import ImageGenerator from '../components/image-generator';

export default function AIImagePage() {
    return (
        <div className='flex flex-col w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] relative overflow-hidden'>
            <div className='w-full h-full relative z-10'>
                <ImageGenerator />
            </div>
        </div>
    );
}

