'use client';

import { updateAffiliateTripById } from '@/app/_actions/trips/affiliateTripsAction';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAdmin } from '../../../../../../hooks/useAdmin';
import SectionTitle from '../../section-title';
import { BLOCK_METADATA } from '../block-registry';
import { BlockEditWrapper } from '../common/block-edit-wrapper';
import { useBlockEditState } from '../context/block-edit-context';
import { ReviewForm } from './review-form';

// ---------------------------------------------------------------------------
// Static fallback reviews (defined once at module level)
// ---------------------------------------------------------------------------
const DEFAULT_REVIEWS = [
    {
        id: 1,
        name: 'Diego Aysen',
        verified: true,
        timeAgo: '28 days ago',
        rating: 5,
        text: 'Excelente plan para conocer Klein Curaçao! El servicio es impecable...',
        readMore: 'Read more',
        avatar: 'D',
        avatarBg: 'bg-blue-500',
        image: null,
    },
    {
        id: 2,
        name: 'Iynndeè v',
        verified: true,
        timeAgo: '30 days ago',
        rating: 5,
        text: 'De dag van ons leven wat een prachtige setting en leuke crew en snel...',
        readMore: 'Read more',
        avatar: 'I',
        avatarBg: 'bg-purple-500',
        image: null,
    },
    {
        id: 3,
        name: 'Andrea Nieb...',
        verified: true,
        timeAgo: '30 days ago',
        rating: 5,
        text: 'Niet voor de eerste keer naar Klein Curaçao geweest en telkens we...',
        readMore: 'Read more',
        avatar: 'A',
        avatarBg: 'bg-purple-600',
        image: null,
    },
];

// ---------------------------------------------------------------------------
// Pure helper functions
// ---------------------------------------------------------------------------

/** Resolve source data: block-mode uses blockData, legacy mode reads from trip options */
const getSourceData = ({ isBlock, blockData, trip }) =>
    isBlock && blockData
        ? blockData
        : (trip?.userAddedOptions?.reviews ?? null);

/** Normalise raw reviews into a form-compatible shape (string URLs → object) */
const formatReviewsForForm = reviews =>
    reviews.map(r => ({
        ...r,
        reviewerAvatar:
            typeof r?.reviewerAvatar === 'string'
                ? { url: r.reviewerAvatar, id: r.reviewerAvatar }
                : (r?.reviewerAvatar ?? null),
        images: Array.isArray(r?.images)
            ? r.images.map(img =>
                  typeof img === 'string' ? { url: img, id: img } : img
              )
            : [],
    }));

/** Serialise form review back to plain data ready for persistence */
const serializeReview = r => ({
    ...r,
    reviewerAvatar: r.reviewerAvatar?.url || r.reviewerAvatar || null,
    images: Array.isArray(r.images) ? r.images.map(img => img?.url || img) : [],
    rating: Number(r.rating) || 5,
});

// ---------------------------------------------------------------------------
// Swiper nav button styles
// ---------------------------------------------------------------------------
const navBtn =
    'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300';
const navActive =
    'border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white hover:shadow-lg';
const navDisabled =
    'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed';

// ===========================================================================
// ReviewsBlockWrapper
//
// Owns ALL shared logic. Renders:
//   • BlockEditWrapper shell
//   • Section header (title, subtitle, nav arrows)
//   • Swiper (caller provides renderCard + optional breakpoints)
//   • ReviewForm edit sheet
//
// Props:
//   renderCard(review)  – function that returns the card JSX for each review
//   swiperBreakpoints   – optional Swiper breakpoints object
//   defaultVariant      – 'grid' | 'fullWidth' (used as fallback)
// ===========================================================================
export const ReviewsBlockWrapper = ({
    trip,
    data: blockData,
    id,
    isBlock = false,
    preview = false,
    defaultVariant = 'grid',
    renderCard,
    swiperBreakpoints,
}) => {
    const { isAdmin, mode, MODES } = useAdmin();
    const isEditMode = !preview && mode === MODES.edit;

    const { isEditing, setIsEditing, onUpdate } = useBlockEditState(id);
    const [openEditItem, setOpenEditItem] = useState(null);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState({
        variant: blockData?.variant || defaultVariant,
    });

    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    // Keep local variant in sync when block context updates after onUpdate
    useEffect(() => {
        if (blockData?.variant) {
            setReviewData(prev => ({ ...prev, variant: blockData.variant }));
        }
    }, [blockData?.variant]);

    // ── Form ─────────────────────────────────────────────────────────────────
    const methods = useForm({
        defaultValues: { title: 'Reviews', subtitle: '', reviews: [] },
    });
    const { control, reset, watch } = methods;
    const watchedTitle = watch('title');
    const watchedSubtitle = watch('subtitle');
    const watchedReviews = watch('reviews');
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'reviews',
    });

    // ── Load / reset form from source data ───────────────────────────────────
    const resetForm = source => {
        const reviews =
            source?.reviews ??
            trip?.userAddedOptions?.reviews?.reviews ??
            DEFAULT_REVIEWS;
        reset({
            title: source?.title || 'Reviews',
            subtitle: source?.subtitle || '',
            reviews: formatReviewsForForm(reviews),
        });
    };

    useEffect(() => {
        resetForm(getSourceData({ isBlock, blockData, trip }));
    }, [trip, blockData, isBlock]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async formData => {
        const cleanData = {
            title: formData.title,
            subtitle: formData.subtitle,
            reviews: formData.reviews.map(serializeReview),
            variant: reviewData.variant || blockData?.variant || defaultVariant,
        };

        if (isBlock) {
            onUpdate(cleanData);
            setIsEditing(false);
            return;
        }

        try {
            await updateAffiliateTripById(trip?.id, {
                userAddedOptions: {
                    ...trip?.userAddedOptions,
                    reviews: cleanData,
                },
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save reviews:', err);
        }
    };

    // ── Cancel ───────────────────────────────────────────────────────────────
    const handleCancel = () => {
        resetForm(getSourceData({ isBlock, blockData, trip }));
        setIsEditing(false);
    };

    // ── Add new review ────────────────────────────────────────────────────────
    const addReview = () => {
        append({
            id: Date.now(),
            name: 'New Reviewer',
            verified: true,
            timeAgo: 'Just now',
            rating: 5,
            text: 'Write your review here...',
            readMore: 'Read more',
            avatar: 'N',
            avatarBg: 'bg-gray-500',
            reviewerAvatar: null,
            images: [],
        });
        setTimeout(() => setOpenEditItem(fields.length), 0);
    };

    // ── Approved DB reviews ───────────────────────────────────────────────────
    const dbReviews = useMemo(() => {
        if (!Array.isArray(trip?.reviews)) return [];

        return trip.reviews
            .filter(r => r.status === 'APPROVED')
            .map(r => {
                const diffDays = Math.ceil(
                    Math.abs(new Date() - new Date(r.createdAt)) / 86_400_000
                );
                const timeAgo =
                    diffDays === 0
                        ? 'Today'
                        : diffDays === 1
                          ? 'Yesterday'
                          : `${diffDays} days ago`;
                return {
                    id: r.id,
                    name: r.reviewerName || 'Anonymous',
                    verified: true,
                    timeAgo,
                    rating: r.rating || 5,
                    title: r.title || '',
                    text: r.content || '',
                    readMore: '',
                    avatar: r.reviewerName?.charAt(0)?.toUpperCase() || 'R',
                    avatarBg: 'bg-zinc-800',
                    reviewerAvatar: r.reviewerAvatar || null,
                    images: r.images || [],
                };
            });
    }, [trip?.reviews]);

    const allReviews = [...dbReviews, ...(watchedReviews || [])];

    if (allReviews.length === 0 && !isEditMode) return null;

    const handleSlideChange = swiper => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <BlockEditWrapper
            isEditMode={isEditMode}
            isAdmin={isAdmin}
            onEdit={() => setIsEditing(true)}>
            {/* Section header */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2'>
                <div className='max-w-3xl'>
                    <SectionTitle className='text-2xl sm:text-3xl mb-0'>
                        {watchedTitle}
                    </SectionTitle>
                    {watchedSubtitle && (
                        <p className='text-muted-foreground mt-4 text-sm sm:text-base max-w-3xl leading-relaxed'>
                            {watchedSubtitle}
                        </p>
                    )}
                </div>

                {/* Navigation arrows */}
                <div className='flex gap-2 mb-1'>
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        disabled={isBeginning}
                        className={cn(
                            navBtn,
                            isBeginning ? navDisabled : navActive
                        )}>
                        <ChevronLeft className='w-5 h-5' />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        disabled={isEnd}
                        className={cn(navBtn, isEnd ? navDisabled : navActive)}>
                        <ChevronRight className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Swiper */}
            <div className='relative px-2 rounded-[20px]'>
                <Swiper
                    onSwiper={swiper => {
                        swiperRef.current = swiper;
                        handleSlideChange(swiper);
                    }}
                    spaceBetween={20}
                    slidesPerView={1}
                    {...(swiperBreakpoints && {
                        breakpoints: swiperBreakpoints,
                    })}
                    onSlideChange={handleSlideChange}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    modules={[Navigation, Pagination, A11y]}
                    className='mySwiper pb-12 rounded-[20px]'>
                    {allReviews.map((review, index) => (
                        <SwiperSlide
                            key={review.id || index}
                            className='h-auto'>
                            <div className='px-2 py-4 h-full rounded-[20px]'>
                                {renderCard(review)}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Edit form sheet */}
            <ReviewForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                methods={methods}
                handleSave={handleSave}
                handleCancel={handleCancel}
                addReview={addReview}
                remove={remove}
                openEditItem={openEditItem}
                setOpenEditItem={setOpenEditItem}
                currentLayoutOptions={BLOCK_METADATA.REVIEWS.variants}
                watchedVariant={
                    reviewData.variant || blockData?.variant || defaultVariant
                }
                isLayoutModalOpen={isLayoutModalOpen}
                setIsLayoutModalOpen={setIsLayoutModalOpen}
                reviewData={reviewData}
                setReviewData={setReviewData}
                onUpdate={onUpdate}
                trip={trip}
            />
        </BlockEditWrapper>
    );
};

