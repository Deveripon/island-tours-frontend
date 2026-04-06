'use client';
import { useVisibleSections } from '../../../../../../hooks/use-visible-section';
import SectionToggler from './section-toggler';
import { SetupGuide } from './setup-guide';
import Statistics from './states/statistics';
// import Statistics from './states/statistics';

export default function PageComponents({ statsPromise, loggedInUser }) {
    const [visibleSections, setVisibleSections] = useVisibleSections();
    return (
        <>
            <SectionToggler
                visibleSections={visibleSections}
                setVisibleSections={setVisibleSections}
            />
            {visibleSections['quick-setup'] && (
                <SetupGuide loggedInUser={loggedInUser} />
            )}

            <Statistics
                visibleSections={visibleSections}
                statsPromise={statsPromise}
            />
        </>
    );
}
