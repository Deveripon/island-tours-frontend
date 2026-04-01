'use client';

import { getUploadedMediaofTenant } from '@/app/_actions/mediaActions';
import { useUser } from '@/hooks/use-user';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MediaGallery from './media-gallery';
import MediaSearchControlls from './media-search-controls';

const MediaGalleryManager = ({
    selector = false,
    onMediaSelect,
    currentSelection,
    multiple,
    maxFiles,
    media,
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'masonry'
    const [selectMode, setSelectMode] = useState(false);
    const [bulkSelectedItems, setBulkSelectedItems] = useState([]);
    const [mediaItems, setMediaItems] = useState(media || []);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    console.log(`user`, user);

    // Handle inserting selected media to form
    function handleInsertToForm() {
        if (bulkSelectedItems.length === 0) {
            toast.warning('Please select at least one image');
            return;
        }

        // Validate selection count
        if (!multiple && bulkSelectedItems.length > 1) {
            toast.warning('Only one image can be selected');
            return;
        }

        if (multiple && bulkSelectedItems.length > maxFiles) {
            toast.warning(`Maximum ${maxFiles} images allowed`);
            return;
        }

        // Call the callback with selected media
        if (onMediaSelect) {
            onMediaSelect(bulkSelectedItems);
        }
    }

    useEffect(() => {
        if (user) {
            getUploadedMediaOfUser(
                user?.tenant?.tenantId || user?.createdByTenantId
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Set initial selection when currentSelection changes
    useEffect(() => {
        setBulkSelectedItems(currentSelection || []);
    }, [currentSelection]);

    async function getUploadedMediaOfUser(tenant) {
        try {
            setLoading(true);
            const res = await getUploadedMediaofTenant(
                tenant,
                'limit=200 &sortBy=uploadedAt&sortOrder=desc'
            );
            console.log(`getUploadedMediaOfUser`, res);

            const mediaItems = res?.result?.media || [];
            setMediaItems(mediaItems);
        } catch (error) {
            setMediaItems([]);
        } finally {
            setLoading(false);
        }
    }

    // Handle bulk selection with validation
    function handleBulkSelection(action) {
        if (action === 'clear') {
            setBulkSelectedItems([]);
        } else if (action === 'all') {
            // Select all filtered items (considering search term)
            const filteredItems = searchTerm
                ? mediaItems.filter(
                      item =>
                          item?.originalName
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                          item?.fileName
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase())
                  )
                : mediaItems;

            setBulkSelectedItems(filteredItems);
        }
    }

    // Handle cancel selection
    function handleCancelSelection() {
        setBulkSelectedItems([]);
        setSelectMode(false);
    }

    return (
        <div className='flex flex-col flex-1 min-h-0'>
            <div className='mt-2 flex-shrink-0'>
                <MediaSearchControlls
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    setIsFormOpen={setIsFormOpen}
                    setSelectMode={setSelectMode}
                    selectMode={selectMode}
                    handleBulkSelection={handleBulkSelection}
                    handleCancelSelection={handleCancelSelection}
                    mediaItems={mediaItems}
                    bulkSelectedItems={bulkSelectedItems}
                    selector={selector}
                    loading={loading}
                />
            </div>
            <MediaGallery
                searchTerm={searchTerm}
                viewMode={viewMode}
                isFormOpen={isFormOpen}
                setIsFormOpen={setIsFormOpen}
                selectMode={selectMode}
                bulkSelectedItems={bulkSelectedItems}
                setbulkSelectedItems={setBulkSelectedItems}
                mediaItems={mediaItems}
                setMediaItems={setMediaItems}
                loading={loading}
                selector={selector}
                handleInserToForm={handleInsertToForm}
                currentSelection={currentSelection}
                multiple={multiple}
                maxFiles={maxFiles}
            />
        </div>
    );
};

export default MediaGalleryManager;

