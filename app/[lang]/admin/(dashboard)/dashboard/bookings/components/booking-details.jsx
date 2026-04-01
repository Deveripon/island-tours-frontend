import CustomerContactInformation from './booking-details/customer-contact-information';
import Header from './booking-details/header';
import TravellerInformation from './booking-details/traveller-information';
import TripOverview from './booking-details/trip-overview';

export default function BookingDetails({ bookingData }) {

    return (
        <div className='min-h-screen bg-background p-6'>
            {/* Header */}

            <div className='grid grid-cols-1 '>
                <Header bookingData={bookingData} />
                {/* Left Column */}
                <div className='lg:col-span-2 space-y-4'>
                    {/* Trip Overview */}
                    <TripOverview bookingData={bookingData} />

                    {/* Traveller Information */}
                    <TravellerInformation bookingData={bookingData} />
                    {/* Contact Information */}
                    <CustomerContactInformation bookingData={bookingData} />
                    {/* Addons Information */}
                </div>

                {/* Right Column */}
                {/*   <div className='space-y-8'> */}
                {/* Pricing Breakdown */}
                {/*  <PriceBreakdown bookingData={bookingData} /> */}

                {/* Payment Schedule */}
                {/*          {bookingData.paymentSchedule.length > 0 && (
                        <PaymentSchedule bookingData={bookingData} />
                    )} */}

                {/* Quick Actions */}
                {/*     <Card className='shadow-sm border-slate-200/60'>
                        <CardHeader className='pb-4'>
                            <CardTitle className='text-sm font-medium text-slate-900'>
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <Button
                                className='w-full text-sm font-medium'
                                variant='outline'>
                                Contact Customer
                            </Button>
                        </CardContent>
                    </Card> */}
                {/*  </div> */}
            </div>
            {/*      {bookingData.addons && bookingData.addons.length > 0 && (
                <Card className='shadow-sm my-4 border-slate-200/60'>
                    <CardHeader className='pb-4'>
                        <CardTitle className='text-sm font-medium text-slate-900'>
                            Selected Add-ons
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {bookingData.addons.map(addon => (
                            <div
                                key={addon.id}
                                className='p-4 bg-slate-50/50 rounded-lg border border-slate-200/60'>
                                <div className='flex justify-between items-start mb-2'>
                                    <h4 className='font-medium text-slate-900'>
                                        {addon.name}
                                    </h4>
                                    <span className='text-sm font-semibold text-slate-900'>
                                        {formatCurrency(
                                            addon.price,
                                            addon.currency
                                        )}
                                    </span>
                                </div>
                                {addon.subtitle && (
                                    <p className='text-sm text-slate-600 mb-2'>
                                        {addon.subtitle}
                                    </p>
                                )}
                                {addon.description && (
                                    <p className='text-sm text-slate-600 mb-2'>
                                        {addon.description}
                                    </p>
                                )}
                                {addon.category && (
                                    <div className='flex items-center gap-2 mb-2'>
                                        <span className='text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                                            {addon.category}
                                        </span>
                                        <span className='text-sm text-slate-500'>
                                            {addon.pricingModel
                                                .replace('_', ' ')
                                                .toLowerCase()}
                                        </span>
                                    </div>
                                )}
                                {addon.benifits && (
                                    <div className='text-sm text-slate-600'>
                                        <strong>Benefits:</strong>{' '}
                                        {addon.benifits}
                                    </div>
                                )}
                                {addon.included && (
                                    <div className='text-sm text-slate-600'>
                                        <strong>Included:</strong>{' '}
                                        {addon.included}
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )} */}
            {/*         <div className='mt-4'>
                <h3 className='text-lg py-4 font-semibold text-gray-700'>
                    Modified Itinerary
                </h3>
                <IterneryPreview itinerary={bookingData.modifiedItinerary} />
            </div> */}
        </div>
    );
}

