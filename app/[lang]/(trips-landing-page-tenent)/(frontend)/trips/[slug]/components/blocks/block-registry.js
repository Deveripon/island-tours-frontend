import { createBlockWrapper } from './common/block-wrapper-factory';
import ExperienceSection from './experience/experience-section';
import EditableTripGallery from './gallery/editable-trip-gallery';
import TitleDestination from './header/title-destination';
import ImagesSection from './images/images-section';
import IntegratedMapView from './map/integrated-map-view';
import ReviewsSlider from './reviews/review-slider';
import TripSummary from './summary/trip-summary';
import TeamGrid from './teams/team-grid';
import TeamSlider from './teams/team-slider';

import CTAButton from './cta/cta-button';
import DescriptionBlock from './description/description-block';
import TripFAQ from './faq/trip-faqs';
import SimpleTitle from './header/simple-title';
import ItineraryBlock from './itinerary/itinerary-block';
import ItineraryTimeline from './itinerary/itinerary-timeline';
import ReviewSubmitForm from './review-form/review-submit-form';
import ReviewsSliderFullWidth from './reviews/review-slider-full-width';
import TableBlock from './table/table-block';
import TourTypeInformation from './tour-info/tour-type-information';
import VideoImpression from './video/video-impression';

// Create the wrapper using the factory
const TeamBlockWrapper = createBlockWrapper({
    grid: TeamGrid,
    slider: TeamSlider,
}, 'grid');

const ItineraryBlockWrapper = createBlockWrapper({
    classic: ItineraryBlock,
    timeline: ItineraryTimeline,
}, 'classic');

const ReviewsSliderWrapper = createBlockWrapper({
    grid: ReviewsSlider,
    fullWidth: ReviewsSliderFullWidth,
}, 'fullWidth');

export const BLOCK_COMPONENTS = {
    TITLE_DESTINATION: TitleDestination,
    SIMPLE_TITLE: SimpleTitle,
    GALLERY: EditableTripGallery,
    TRIP_SUMMARY: TripSummary,
    VIDEO_IMPRESSION: VideoImpression,
    TOUR_INFORMATION: TourTypeInformation,
    EXPERIENCE: ExperienceSection,
    IMAGES: ImagesSection,
    MAP: IntegratedMapView,
    FAQ: TripFAQ,
    REVIEWS: ReviewsSliderWrapper,
    TEAM: TeamBlockWrapper,
    DESCRIPTION: DescriptionBlock,
    ITINERARY: ItineraryBlockWrapper,
    TABLE: TableBlock,
    CTA_BUTTON: CTAButton,
    REVIEW_SUBMIT_FORM: ReviewSubmitForm,
};

export const BLOCK_METADATA = {
    TITLE_DESTINATION: {
        label: 'Header & Title',
        description: 'Main trip title and hero highlights',
        icon: 'Type',
        category: 'Core',
    },
    SIMPLE_TITLE: {
        label: 'Simple Heading',
        description: 'Simple heading',
        icon: 'Type',
        category: 'Core',
    },
    GALLERY: {
        label: 'Photo Gallery',
        description: 'Masonry grid of trip photos',
        icon: 'Image',
        category: 'Visuals',
    },
    TRIP_SUMMARY: {
        label: 'Trip Summary',
        description: 'Detailed overview and info cards',
        icon: 'FileText',
        category: 'Content',
    },
    TOUR_INFORMATION: {
        label: 'Tour Details',
        description: 'Difficulty, style, and suitability info',
        icon: 'Info',
        category: 'Content',
    },
    EXPERIENCE: {
        label: 'Tour Experiences',
        description: 'Highlights and experience timeline',
        icon: 'Compass',
        category: 'Content',
    },
    VIDEO_IMPRESSION: {
        label: 'Video Section',
        description: 'Immersive YouTube or Vimeo embed',
        icon: 'Video',
        category: 'Visuals',
    },
    IMAGES: {
        label: 'Image Grid',
        description: 'Secondary grid for more memories',
        icon: 'LayoutGrid',
        category: 'Visuals',
    },
    MAP: {
        label: 'Interactive Map',
        description: 'Integrated Google Maps location',
        icon: 'Map',
        category: 'Content',
    },
    FAQ: {
        label: 'FAQ Accordion',
        description: 'Common questions and answers',
        icon: 'HelpCircle',
        category: 'Content',
    },
    REVIEWS: {
        label: 'Customer Reviews',
        description: 'Ratings and testimonials section',
        icon: 'Star',
        category: 'Social',
        variants: [
            {
                id: 'grid',
                label: 'Grid Layout',
                icon: 'LayoutGrid',
                description: 'Classic grid with cards',
                component: ReviewsSlider, // Reference for preview

            },
            {
                id: 'slider',
                label: 'Slider Layout',
                icon: 'GalleryHorizontal',
                description: 'Interactive carousel slider',
                component: ReviewsSliderFullWidth, // Reference for preview

            },
        ],
    },
    TEAM: {
        label: 'Team Section',
        description: 'Showcase your team of specialists',
        icon: 'Users',
        category: 'Content',
        variants: [
            {
                id: 'grid',
                label: 'Grid Layout',
                icon: 'LayoutGrid',
                description: 'Classic grid with cards',
                component: TeamGrid, // Reference for preview

            },
            {
                id: 'slider',
                label: 'Slider Layout',
                icon: 'GalleryHorizontal',
                description: 'Interactive carousel slider',
                component: TeamSlider, // Reference for preview

            },
        ],
    },
    DESCRIPTION: {
        label: 'Full Description',
        description: 'Rich text description of the trip',
        icon: 'FileText',
        category: 'Content',
    },
    ITINERARY: {
        label: 'Itinerary',
        description: 'Timeline of trip activities',
        icon: 'Calendar',
        category: 'Content',
        variants: [
            {
                id: 'classic',
                label: 'Classic Layout',
                icon: 'List',
                description: 'Classic vertical list layout',
                component: ItineraryBlock, // Reference for preview
            },
            {
                id: 'timeline',
                label: 'Timeline Layout',
                icon: 'Calendar',
                description: 'Day-by-day tabbed timeline layout',
                component: ItineraryTimeline, // Reference for preview
            },
        ],
    },
    TABLE: {
        label: 'Info Table',
        description: 'Structured list with icons and values',
        icon: 'Table',
        category: 'Content',
    },
    CTA_BUTTON: {
        label: 'CTA',
        description: 'Call to action',
        icon: 'Button',
        category: 'Content',
    },
    REVIEW_SUBMIT_FORM: {
        label: 'Review Submit Form',
        description: 'Review submit form',
        icon: 'Star',
        category: 'Content',
    },
};

export const DEMO_CONTENT = [
    {
        id: 'demo-title',
        type: 'TITLE_DESTINATION',
        data: {}
    },
    {
        id: 'demo-gallery',
        type: 'GALLERY',
        data: {}
    },
    {
        id: 'demo-summary',
        type: 'TRIP_SUMMARY',
        data: {
            title: 'About this trip',
            shortDescription: '4-day guided Patagonia adventure—trek Fitz Roy, Cerro Torre & Viedma Glacier with pro guides, cozy eco-lodge & gourmet camp meals.',
            sections: [
                {
                    id: 'departure',
                    title: 'Departure',
                    icon: 'calendar',
                    type: 'info-card',
                    content: ['Daily', '7:30 AM'],
                    column: 'left',
                },
                {
                    id: 'location',
                    title: 'Location',
                    icon: 'location',
                    type: 'info-card',
                    content: ['Santa Barbara Beach'],
                    column: 'left',
                },
                {
                    id: 'duration',
                    title: 'Duration',
                    icon: 'clock',
                    type: 'info-card',
                    content: ['Approx 9.5 hours'],
                    column: 'left',
                },
                {
                    id: 'cruise-time',
                    title: 'Cruise Time',
                    icon: 'waves',
                    type: 'info-card',
                    content: ['1 hour and 15 minutes'],
                    column: 'left',
                },
                {
                    id: 'included',
                    title: 'Included',
                    icon: 'included',
                    type: 'info-card',
                    content: ["Beach House, Beach Beds, Palapa's, Breakfast, BBQ Lunch, Soft Drinks, Snorkel Gear, Guided Snorkel Safari"],
                    column: 'right',
                },
                {
                    id: 'additional-fee',
                    title: 'For an additional fee',
                    icon: 'money',
                    type: 'info-card',
                    content: ['Transfer Service, Alcoholic Beverages, Massage, Scuba Dive 💰'],
                    column: 'right',
                },
                {
                    id: 'cancellation',
                    title: 'Free cancellation',
                    icon: 'cancellation',
                    type: 'info-card',
                    content: ['Cancel up to 48 hours in advance for a full refund'],
                    column: 'right',
                },
                {
                    id: 'price',
                    title: 'Price',
                    icon: 'price',
                    type: 'info-card',
                    content: ['Adults: USD 140 | Kids: USD 70 | Infants: Free'],
                    column: 'right',
                }
            ],
            showBookingSection: true,
            bookingTitle: 'Secure your booking',
            bookingContent: 'you only need to pay a deposit to secure your booking. The remaining of the payment needs to be paid directly to the tour operator.',
            bookingButtonText: 'Book this trip now!',
        }
    },
    {
        id: 'demo-video',
        type: 'VIDEO_IMPRESSION',
        data: {
            title: 'Video Impression',
            shortDescription: '',
            videoIframe: 'https://www.youtube.com/embed/3OYHXscc8Xs',
        }
    },
    {
        id: 'demo-tour-info',
        type: 'TOUR_INFORMATION',
        data: {
            title: 'Tour Information',
            shortDescription: '',
            tourTypes: ['Adventure Tours'],
            difficulty: 'Easy - Suitable for all ages',
            suitableFor: ['Families with Kids'],
            tourStyle: 'Guided Tour',
        }
    },
    {
        id: 'demo-experience',
        type: 'EXPERIENCE',
        data: {
            title: 'Experience',
            shortDescription: '',
            sections: [
                {
                    id: 'highlights',
                    title: 'Highlights',
                    icon: 'bullet-list',
                    type: 'bullet-list',
                    items: [
                        'Travel to Klein Curacao on a Super Yacht',
                        "Enjoy Curacao's stunning east coast views along the way",
                        'You might spot a school of dolphins during the trip',
                        'Your day, your way: scuba, snorkel, hike, explore, or relax',
                        "Stay cool with some ice-cold drinks at Niko's Bar",
                        'Sit back and relax at the private and stylish beach house',
                    ],
                },
                {
                    id: 'description',
                    title: 'Full description',
                    icon: 'description',
                    type: 'description',
                    content: `Departure: You'll board the boat at 7:15 AM at Santa Barbara Beach (Sandals Hotel, next to Boca 19 Restaurant). Upon arrival at Klein Curacao, relax on the beach or at the Beach House while the crew prepares a delightful breakfast for you. After breakfast, the island is yours to explore.

You can snorkel with sea turtles, go scuba diving, relax in the water, visit the iconic lighthouse and the stranded shipwreck, sunbathe, take a massage, and much more. Klein Curacao is an uninhabited coral island located southeast of Curacao in the Caribbean Sea.`,
                },
                {
                    id: 'included',
                    title: "What's included",
                    icon: 'check-list',
                    type: 'check-list',
                    items: [
                        'Round-trip to Klein Curacao',
                        'Private Beach house',
                        'Plenty of beds and shade',
                        'Unlimited soft drinks and water',
                        'Breakfast',
                        'BBQ lunch',
                    ],
                },
                {
                    id: 'additional',
                    title: 'Additional',
                    icon: 'bullet-list',
                    subtitle: 'Available at an extra cost',
                    type: 'bullet-list',
                    items: [
                        'Scuba Diving',
                        'Massage',
                        'Alcoholic beverages',
                        'Transfer Service',
                    ],
                },
                {
                    id: 'meeting',
                    title: 'Meeting point',
                    icon: 'location',
                    type: 'meeting-info',
                    location: 'The pier of Santa Barbara Beach (Sandals Hotel, next to Boca 19 Restaurant) or your reserved pickup location',
                    time: 'Boat departure time: 07:30 AM',
                    linkText: 'Open in Google Maps',
                    linkUrl: 'https://www.google.com/maps/place/Santa+Barbara+Beach+%26+Golf+Resort,+Curacao/@12.0836,-68.8989,17z',
                },
            ],
            showBookingButton: true,
            bookingTitle: 'Secure your booking',
            bookingContent: 'you only need to pay a deposit to secure your booking. The remaining of the payment needs to be paid directly to the tour operator.',
            bookingButtonText: 'Book this trip now!',
        }
    },
    {
        id: 'demo-itinerary',
        type: 'ITINERARY',
        data: {
            title: 'Itinerary',
            shortDescription: 'Dit is het programma van de dagtrip bij All Boat Charters:',
            items: [
                { id: '1', time: '10:15', description: 'Inchecken bij Mood Beach', side: 'left' },
                { id: '2', time: '10:30 – 12:15', description: 'Varen op de catamaran naar Klein Curacao', side: 'right' },
                { id: '3', time: '12:30 – 17:00', description: 'Ontspannen of het eiland ontdekken', side: 'left' },
                { id: '4', time: '12:30', description: 'BBQ-lunchbuffet aan boord', side: 'right' },
                { id: '5', time: '13:00 – 18:30', description: 'Premium open bar geopend', side: 'left' },
                { id: '6', time: '17:00 – 18:30', description: 'Sunset Cruise terug naar Curaçao', side: 'right' },
                { id: '7', time: '18:30', description: 'Aankomst bij Mood Beach', side: 'left' },
            ]
        }
    },
    {
        id: 'demo-images',
        type: 'IMAGES',
        data: {}
    },
    {
        id: 'demo-map',
        type: 'MAP',
        data: {
            embededMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.435773176045!2d-68.8989!3d12.0836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e84821033333333%3A0x3333333333333333!2sSanta%20Barbara%20Beach%20%26%20Golf%20Resort%2C%20Curacao!5e0!3m2!1sen!2sus!4v1614123456789!5m2!1sen!2sus'
        }
    },
    {
        id: 'demo-faq',
        type: 'FAQ',
        data: {
            title: 'Frequently Asked Questions',
            shortDescription: '',
            faqs: [
                {
                    question: 'What should I bring?',
                    answer: 'Sunscreen, comfortable walking shoes, and a camera are highly recommended.',
                },
                {
                    question: 'Is lunch included?',
                    answer: 'Yes, a traditional local lunch is included in the tour package.',
                },
            ]
        }
    },
    {
        id: 'demo-reviews',
        type: 'REVIEWS',
        data: {}
    },
    {
        id: 'demo-table',
        type: 'TABLE',
        data: {
            title: 'Tour Information',
            headers: { label: 'Feature', value: 'Details' },
            rows: [
                { id: 't1', type: 'row', icon: 'MapPin', label: 'Departure Point', value: 'Mood Beach, Mambo Boulevard' },
                { id: 't2', type: 'row', icon: 'Clock', label: 'Departure Time', value: '10:30 AM' },
                { id: 't3', type: 'row', icon: 'CalendarDays', label: 'Departure Days', value: 'Every Monday' },
                { id: 't4', type: 'row', icon: 'Timer', label: 'Duration', value: '~ 8.5 hours' },
                { id: 't5', type: 'row', icon: 'Watch', label: 'Return', value: '6:30 PM' },
                { id: 't6', type: 'row', icon: 'Info', label: 'Details', value: 'Departs later than other tours and sails back during sunset' },
                { id: 't7', type: 'row', icon: 'Users', label: 'Adults', value: '€134' },
                { id: 't8', type: 'row', icon: 'Baby', label: 'Children (4-12 years)', value: '€67' },
                { id: 't9', type: 'header', label: 'Optional extras (at an additional fee)' },
                { id: 't10', type: 'row', icon: 'Wine', label: 'Open Bar with Alcohol', value: 'Included' },
                { id: 't11', type: 'row', icon: 'Beer', label: 'Cocktail Bar', value: 'Available' },
                { id: 't12', type: 'header', label: 'Cancellation policy' },
                { id: 't13', type: 'row', icon: 'CheckCircle', label: 'Free cancellation', value: 'Up to 24 hours before the tour' },
            ]
        }
    }
];

export const DEFAULT_BLOCKS = [
    {
        id: 'initial-title',
        type: 'TITLE_DESTINATION',
        data: {}
    },
    {
        id: 'initial-gallery',
        type: 'GALLERY',
        data: {}
    }
];
