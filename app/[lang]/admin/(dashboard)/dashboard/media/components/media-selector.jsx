import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import MediaGalleryManager from './media-gallery-manager';

const MediaSelector = ({
    open = true,
    onOpenChange,
    onMediaSelect,
    currentSelection,
    multiple,
    maxFiles,
}) => {
    // Transform currentSelection from DTO format back to media format for gallery
    const transformedCurrentSelection =
        currentSelection?.map(item => {
            if (item?.image) {
                return {
                    id: item.image.imageId ? item.image.imageId : item.image.id,
                    url: item.image.url,
                    thumbnail: item.image.thumbnail,
                    originalName: item.image.fileName,
                    fileName: item.image.fileName,
                    caption: item.image.caption,
                    altText: item.image.altText,
                    // Add other properties that might be needed
                    ...item.image,
                };
            }
            return {
                id: item.imageId ? item.imageId : item.id,
                url: item.url,
                thumbnail: item.thumbnail,
                originalName: item.fileName,
                fileName: item.fileName,
                caption: item.caption,
                altText: item.altText,
                // Add other properties that might be needed
                ...item,
            };
        }) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                data-lenis-prevent
                className='min-w-[96vw] z-[1000] min-h-[96vh] flex flex-col p-6'>
                <DialogHeader className='flex-shrink-0 mb-4'>
                    <DialogTitle className='text-xl font-bold'>
                        Select Media
                    </DialogTitle>
                </DialogHeader>
                <div className='flex-1 overflow-hidden rounded-lg w-full flex flex-col'>
                    <MediaGalleryManager
                        selector='true'
                        onMediaSelect={onMediaSelect}
                        currentSelection={transformedCurrentSelection}
                        multiple={multiple}
                        maxFiles={maxFiles}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MediaSelector;

