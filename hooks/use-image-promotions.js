import { moveImage } from '@/app/_actions/imagesActions';

// Export the promote function separately for external use
export const useImagePromotion = (userId, folder) => {
    const promoteDrafts = async (images, newFolder = 'packages') => {
        if (!images) return [];

        const imageArray = Array.isArray(images) ? images : [images];
        const promotedImages = [];

        for (const image of imageArray) {
            if (image && image.cloudData?.id) {
                try {
                    const result = await moveImage(
                        image.cloudData.id,
                        newFolder,
                        userId
                    );
                    promotedImages.push(result.data);
                } catch (error) {
                    promotedImages.push(image);
                }
            } else {
                promotedImages.push(image);
            }
        }

        return promotedImages;
    };

    return { promoteDrafts };
};

