import { v4 as uuidv4 } from 'uuid';
export const tripPackageOptions = {
    // Tour Types (checkbox - multiple selection)
    tourTypes: [
        { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Adventure Tours' },
        { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'Cultural Tours' },
        { id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'Wildlife Safari' },
        { id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'Beach & Island' },
        {
            id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
            name: 'Mountain Trekking',
        },
        { id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', name: 'City Tours' },
        { id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8', name: 'Food & Culinary' },
        {
            id: '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
            name: 'Photography Tours',
        },
        {
            id: '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
            name: 'Spiritual & Wellness',
        },
        {
            id: '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
            name: 'Historical Tours',
        },
        { id: '6ba7b819-9dad-11d1-80b4-00c04fd430c8', name: 'Eco Tourism' },
        { id: '6ba7b81a-9dad-11d1-80b4-00c04fd430c8', name: 'Luxury Tours' },
        {
            id: '6ba7b81b-9dad-11d1-80b4-00c04fd430c8',
            name: 'Budget Backpacking',
        },
        {
            id: '6ba7b81c-9dad-11d1-80b4-00c04fd430c8',
            name: 'Honeymoon Packages',
        },
        { id: '6ba7b81d-9dad-11d1-80b4-00c04fd430c8', name: 'Family Tours' },
        { id: '6ba7b81e-9dad-11d1-80b4-00c04fd430c8', name: 'Solo Travel' },
    ],

    // Currency (select - single selection)
    currencies: [
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'USD - US Dollar' },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'EUR - Euro' },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            name: 'GBP - British Pound',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440004',
            name: 'BDT - Bangladeshi Taka',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440005',
            name: 'INR - Indian Rupee',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440006',
            name: 'AUD - Australian Dollar',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440007',
            name: 'CAD - Canadian Dollar',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440008',
            name: 'JPY - Japanese Yen',
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440009',
            name: 'SGD - Singapore Dollar',
        },
        { id: '550e8400-e29b-41d4-a716-44665544000a', name: 'THB - Thai Baht' },
        {
            id: '550e8400-e29b-41d4-a716-44665544000b',
            name: 'MYR - Malaysian Ringgit',
        },
        {
            id: '550e8400-e29b-41d4-a716-44665544000c',
            name: 'AED - UAE Dirham',
        },
    ],

    // Difficulty Levels (select - single selection)
    difficultyLevels: [
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            name: 'Easy - Suitable for all ages',
        },
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
            name: 'Moderate - Basic fitness required',
        },
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
            name: 'Challenging - Good fitness required',
        },
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
            name: 'Strenuous - High fitness required',
        },
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
            name: 'Expert - Professional level required',
        },
    ],

    // Suitable For (checkbox - multiple selection)
    suitableFor: [
        {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Families with Kids',
        },
        { id: '123e4567-e89b-12d3-a456-426614174002', name: 'Couples' },
        { id: '123e4567-e89b-12d3-a456-426614174003', name: 'Solo Travelers' },
        { id: '123e4567-e89b-12d3-a456-426614174004', name: 'Groups' },
        { id: '123e4567-e89b-12d3-a456-426614174005', name: 'Senior Citizens' },
        { id: '123e4567-e89b-12d3-a456-426614174006', name: 'Young Adults' },
        {
            id: '123e4567-e89b-12d3-a456-426614174007',
            name: 'Adventure Seekers',
        },
        {
            id: '123e4567-e89b-12d3-a456-426614174008',
            name: 'First-time Visitors',
        },
        { id: '123e4567-e89b-12d3-a456-426614174009', name: 'Repeat Visitors' },
        {
            id: '123e4567-e89b-12d3-a456-42661417400a',
            name: 'Budget Travelers',
        },
        {
            id: '123e4567-e89b-12d3-a456-42661417400b',
            name: 'Luxury Travelers',
        },
        {
            id: '123e4567-e89b-12d3-a456-42661417400c',
            name: 'Business Travelers',
        },
    ],

    // Tour Styles (checkbox - multiple selection)
    tourStyles: [
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8a', name: 'Private Tour' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8c', name: 'Self-Guided' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8d', name: 'Guided Tour' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8e', name: 'Customizable' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be8f', name: 'Fixed Itinerary' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be90', name: 'All-Inclusive' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be91', name: 'Semi-Inclusive' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be92', name: 'Basic Package' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be93', name: 'Premium Package' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be94', name: 'Flexible Dates' },
        { id: 'c9bf9e57-1685-4c89-bafb-ff5af830be95', name: 'Fixed Dates' },
    ],

    // Inclusions (checkbox - multiple selection)
    inclusions: [
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0851', name: 'Accommodation' },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
            name: 'Meals (Breakfast)',
        },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0853', name: 'Meals (Lunch)' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0854', name: 'Meals (Dinner)' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0855', name: 'All Meals' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0856', name: 'Transportation' },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f0857',
            name: 'Airport Transfers',
        },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f0858',
            name: 'Professional Guide',
        },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0859', name: 'Entry Tickets' },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f085a',
            name: 'Activities & Excursions',
        },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f085b',
            name: 'Travel Insurance',
        },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f085c', name: 'Visa Assistance' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f085d', name: '24/7 Support' },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f085e',
            name: 'Equipment Rental',
        },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f085f',
            name: 'Photography Service',
        },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0860', name: 'Welcome Drinks' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0861', name: 'Cultural Shows' },
        {
            id: 'd290f1ee-6c54-4b01-90e6-d701748f0862',
            name: 'Shopping Assistance',
        },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0863', name: 'Local SIM Card' },
        { id: 'd290f1ee-6c54-4b01-90e6-d701748f0864', name: 'WiFi Access' },
    ],

    // Exclusions (checkbox - multiple selection)
    exclusions: [
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d101',
            name: 'International Flights',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d102',
            name: 'Domestic Flights',
        },
        { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d103', name: 'Visa Fees' },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d104',
            name: 'Travel Insurance',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d105',
            name: 'Personal Expenses',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d106',
            name: 'Tips & Gratuities',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d107',
            name: 'Alcoholic Beverages',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d108',
            name: 'Laundry Services',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d109',
            name: 'Optional Activities',
        },
        { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10a', name: 'Room Service' },
        { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10b', name: 'Spa Treatments' },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10c',
            name: 'Photography Fees',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10d',
            name: 'Medical Expenses',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10e',
            name: 'Emergency Evacuation',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d10f',
            name: 'Equipment Purchase',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d110',
            name: 'Single Room Supplement',
        },
        {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d111',
            name: 'Peak Season Surcharge',
        },
        { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d112', name: 'Fuel Surcharge' },
    ],

    // Age Categories (select - single selection)
    ageCategories: [
        { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', name: 'Adults (18+)' },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e',
            name: 'Family Friendly (5+)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6f',
            name: 'Youth Groups (12-25)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb70',
            name: 'Senior Friendly (55+)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb71',
            name: 'Teens & Adults (13+)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb72',
            name: 'Young Adults (18-35)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb73',
            name: 'Middle Age (25-55)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb74',
            name: 'Kids Friendly (3+)',
        },
        {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb75',
            name: 'Mature Travelers (45+)',
        },
    ],

    // Preparation Requirements (checkbox - multiple selection)
    preparationRequirements: [
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', name: 'Valid Passport' },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bee', name: 'Visa Required' },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bef', name: 'Vaccinations' },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf0',
            name: 'Travel Insurance',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf1',
            name: 'Medical Certificate',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf2',
            name: 'Fitness Level Check',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf3',
            name: 'Swimming Ability',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf4',
            name: 'Hiking Experience',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf5',
            name: 'Special Equipment',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf6',
            name: 'Weather Appropriate Clothing',
        },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf7', name: 'Sun Protection' },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf8',
            name: 'Insect Repellent',
        },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bf9', name: 'First Aid Kit' },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bfa',
            name: 'Emergency Contacts',
        },
        {
            id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bfb',
            name: 'Dietary Restrictions Info',
        },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bfc', name: 'Medication List' },
    ],

    // Policies (checkbox - multiple selection)
    policies: [
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
            name: 'Free Cancellation (24hrs)',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90ae8',
            name: 'Free Cancellation (48hrs)',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90ae9',
            name: 'Free Cancellation (7 days)',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aea',
            name: 'Partial Refund Policy',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aeb',
            name: 'No Refund Policy',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aec',
            name: 'Rescheduling Allowed',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aed',
            name: 'Weather Dependent',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aee',
            name: 'Minimum Group Size',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90aef',
            name: 'Maximum Group Size',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90af0',
            name: 'Age Restrictions',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90af1',
            name: 'Health Requirements',
        },
        { id: '7c9e6679-7425-40de-944b-e07fc1f90af2', name: 'Smoking Policy' },
        { id: '7c9e6679-7425-40de-944b-e07fc1f90af3', name: 'Pet Policy' },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90af4',
            name: 'Photography Policy',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90af5',
            name: 'Environmental Policy',
        },
        {
            id: '7c9e6679-7425-40de-944b-e07fc1f90af6',
            name: 'Safety Guidelines',
        },
    ],

    // FAQ Categories (checkbox - multiple selection)
    faqCategories: [
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1a',
            name: 'Booking & Payment',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1b',
            name: 'Cancellation & Refunds',
        },
        { id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1c', name: 'What to Bring' },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1d',
            name: 'Weather & Climate',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1e',
            name: 'Safety & Security',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b1f',
            name: 'Accommodation Details',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b20',
            name: 'Transportation Info',
        },
        { id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b21', name: 'Food & Dining' },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b22',
            name: 'Cultural Guidelines',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b23',
            name: 'Health & Medical',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b24',
            name: 'Visa & Documentation',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b25',
            name: 'Group Size & Composition',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b26',
            name: 'Activities & Excursions',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b27',
            name: 'Communication & Language',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b28',
            name: 'Emergency Procedures',
        },
        {
            id: 'e4d909c2-d5a6-4b5a-9c4e-2f5c8a5e9b29',
            name: 'Travel Insurance',
        },
    ],

    // Customization Options (checkbox - multiple selection)
    customizationOptions: [
        { id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b4a', name: 'Extend Duration' },
        { id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b4b', name: 'Reduce Duration' },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b4c',
            name: 'Add Destinations',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b52',
            name: 'Private Transportation',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b53',
            name: 'Meal Preferences',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b54',
            name: 'Special Occasions',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b55',
            name: 'Photography Package',
        },
        { id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b56', name: 'Guide Language' },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b57',
            name: 'Group Size Adjustment',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b58',
            name: 'Departure Date Change',
        },
        {
            id: '3f3e2e8a-8b5d-4c1e-a2b7-9f8e7d6c5b59',
            name: 'Special Requests',
        },
    ],

    // General Categories (select - single selection)
    generalCategories: [
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c4d', name: 'Domestic Tours' },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c4e',
            name: 'International Tours',
        },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c4f',
            name: 'Weekend Getaways',
        },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c50',
            name: 'Extended Holidays',
        },
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c51', name: 'Business Travel' },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c52',
            name: 'Educational Tours',
        },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c53',
            name: 'Religious Pilgrimage',
        },
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c54', name: 'Medical Tourism' },
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c55', name: 'Sports Tourism' },
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c56', name: 'Festival Tours' },
        { id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c57', name: 'Seasonal Tours' },
        {
            id: 'b4d4e8c9-2a1b-4f5e-8d3c-7e9f1a2b3c58',
            name: 'Theme-based Tours',
        },
    ],
};

/**
 * Transforms API data into the tripPackageOptions format
 * @param {Object} apiData - The data from API
 * @returns {Object} Transformed data matching tripPackageOptions structure
 */
export function transformApiDataToPackageOptions(apiData) {
    const result = {};

    // Helper function to find existing item by name or create new one
    const findOrCreateItem = (sourceArray, name) => {
        const existing = sourceArray.find(item => item.name === name);
        return existing || { id: uuidv4(), name };
    };

    // Transform Tour Types
    if (apiData.tourTypes) {
        result.tourTypes = apiData.tourTypes.map(name =>
            findOrCreateItem(tripPackageOptions.tourTypes, name)
        );
    }

    // Transform Difficulties
    if (apiData.difficulties) {
        result.difficulties = apiData.difficulties.map(name =>
            findOrCreateItem(tripPackageOptions.difficultyLevels, name)
        );
    }

    // Transform Suitable For
    if (apiData.suitableFor) {
        result.suitableFor = apiData.suitableFor.map(name =>
            findOrCreateItem(tripPackageOptions.suitableFor, name)
        );
    }

    // Transform Tour Styles
    if (apiData.tourStyles) {
        result.tourStyles = apiData.tourStyles.map(name =>
            findOrCreateItem(tripPackageOptions.tourStyles, name)
        );
    }

    // Transform Currencies
    if (apiData.currencies) {
        result.currencies = apiData.currencies.map(name =>
            findOrCreateItem(tripPackageOptions.currencies, name)
        );
    }

    // Transform Countries (create new array as it doesn't exist in original)
    if (apiData.countries) {
        result.countries = apiData.countries.map(name => ({
            id: uuidv4(),
            name }));
    }

    // Transform Destinations (create new array as it doesn't exist in original)
    if (apiData.destinations) {
        result.destinations = apiData.destinations.map(name => ({
            id: uuidv4(),
            name }));
    }

    return result;
}

