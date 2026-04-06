'use client';

import { ReviewCard } from './review-card';
import { ReviewsBlockWrapper } from './reviews-block-wrapper';

const GRID_BREAKPOINTS = {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
};

const ReviewsSlider = props => (
    <ReviewsBlockWrapper
        {...props}
        defaultVariant='grid'
        swiperBreakpoints={GRID_BREAKPOINTS}
        renderCard={review => <ReviewCard review={review} />}
    />
);

export default ReviewsSlider;

