import { getAllMedia } from '@/app/_actions/mediaActions';
import MediaGalleryManager from './components/media-gallery-manager';

const FilesAndMediaPage = async () => {
    const res = await getAllMedia(
        'limit=200 &sortBy=uploadedAt&sortOrder=desc'
    );
    const mediaItems = res?.result?.media || [];

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>
                        Media & Files
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Organize and manage your uploaded media and files
                    </p>
                </div>
            </div>

            <MediaGalleryManager media={mediaItems} />
        </div>
    );
};

export default FilesAndMediaPage;
