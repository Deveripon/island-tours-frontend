import SectionTitle from './section-title';

export default function InstagramFeed({ siteInfo }) {
    if (
        !siteInfo?.enableInstagram ||
        !siteInfo?.instagramWidgetId
    ) {
        return null;
    }

    return (
        <div className=' bg-background dark:bg-background py-16 md:py-22 px-4'>
            <div className='container mx-auto'>
                {/* Header */}
                <SectionTitle
                    title='Follow us on'
                    highlightedText='Instagram'
                />

                <div className='max-w-7xl mx-auto'>
                    <div
                        className={siteInfo?.instagramWidgetId}
                        data-elfsight-app-lazy></div>
                </div>
            </div>
        </div>
    );
}

