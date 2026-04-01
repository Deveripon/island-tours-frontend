import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormNavButtons } from './form-navigation';

export function FormContent({
    formSections,
    activeTab,
    setActiveTab,
    onNext,
    onPrevious,
    onSubmit,
    isSubmitting,
    currentTabIndex,
    mode,
    className,
    tenant,
    destinations,
    tourOperators,
    isFetchingOptions }) {
    const formSectionsWithOutSEO = formSections.filter(
        section => section.id !== 'seo'
    );
    const isFirstStep = currentTabIndex === 0;
    const isLastStep = currentTabIndex === formSectionsWithOutSEO.length - 1;

    return (
        <div className={className}>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'>
                <TabsList className='hidden'>
                    {formSections.map((section, index) => (
                        <TabsTrigger key={index} value={section.id}>
                            {section.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {formSections.map((section, index) => (
                    <TabsContent
                        key={index}
                        value={section.id}
                        className='mt-0 overflow-visible'>
                        <section.Component
                            tenant={tenant}
                            destinations={destinations}
                            tourOperators={tourOperators}
                            isFetchingOptions={isFetchingOptions}
                        />
                    </TabsContent>
                ))}
            </Tabs>

            {}
            {activeTab !== 'seo' && (
                <FormNavButtons
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                    mode={mode}
                />
            )}
        </div>
    );
}

