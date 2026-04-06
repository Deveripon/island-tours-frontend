'use client';

import { ReviewCardWide } from './review-card-wide';
import { ReviewsBlockWrapper } from './reviews-block-wrapper';

const ReviewsSliderFullWidth = props => (
    <ReviewsBlockWrapper
        {...props}
        defaultVariant='fullWidth'
        renderCard={review => <ReviewCardWide review={review} />}
    />
);

export default ReviewsSliderFullWidth;

