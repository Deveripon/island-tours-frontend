// Direct named exports to avoid barrel file performance issues
// See: Vercel React Best Practices - Rule 2.1

export {
    uploadSingleImage,
    uploadMultipleImage,
    moveImage,
    cleanupOldDrafts,
    updateMedia,
    bulkUpdateMedia,
    deleteMedia,
    bulkDeleteMedia,
    deleteSingleImage,
    deleteImages,
    getAllMedia,
    getUserMedia,
    searchMedia,
    getUserMediaStats,
    getSingleMedia,
    getImagesList
} from '../mediaActions';

export {
    createActivity,
    updateActivity,
    deleteActivity,
    getAllActivities,
    getActivitiesByCreatorId,
    getHighlightedActivities,
    getActivitiesByDifficulty,
    searchActivities,
    getActivityById
} from './activityActions';

export {
    createTrip,
    updateTrip,
    deleteTrip,
    getAllTrips,
    getTripsByDestination,
    getTripsByActivity,
    searchTrips,
    getAllAvailableFilterOperations,
    getTripById,
    getTripBySlug
} from './affiliateTripsAction';

export {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getAllCategoriesByType,
    searchCategories,
    getCategoryById
} from './category';

export {
    createDestination,
    updateDestination,
    deleteDestination,
    getAllDestinations,
    searchDestinations,
    getDestinationById
} from './destinations';
