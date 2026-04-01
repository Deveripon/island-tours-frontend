'use client';
import ImageCard from '../../../../../../components/ui/image-card';

export default function TripHighlights({ highlights }) {
    return (
        <>
            <ImageCard data={highlights} />
        </>
    );
}

