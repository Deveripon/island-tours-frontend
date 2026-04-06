'use server';

import { getAllBookings } from './bookingActions/read';
import { getAllInquiries, getInquiryStats } from './inquiryActions/read';
import { getAllTrips } from './trips';

import { getAllUsers } from './userActions/read';

/**
 * Aggregates individual data points to provide dashboard statistics.
 * This is a workaround since a unified dashboard stats endpoint doesn't exist yet.
 */
export async function getDashboardStats() {
    try {
        // Parallel fetch all necessary data
        const [
            bookingsResponse,
            inquiriesResponse,
            inquiryStatsResponse,
            tripsResponse,
            usersResponse
        ] = await Promise.all([
            getAllBookings('?limit=1000'),
            getAllInquiries('?limit=1000'),
            getInquiryStats(),
            getAllTrips('?limit=1000'),
            getAllUsers()
        ]);

        let bookings = bookingsResponse?.success ? (Array.isArray(bookingsResponse.result) ? bookingsResponse.result : bookingsResponse.result?.data || []) : [];
        if (!Array.isArray(bookings)) bookings = [];

        let inquiries = inquiriesResponse?.success ? (Array.isArray(inquiriesResponse.result) ? inquiriesResponse.result : inquiriesResponse.result?.data || []) : [];
        if (!Array.isArray(inquiries)) inquiries = [];

        const inquiryStats = inquiryStatsResponse?.success ? (inquiryStatsResponse.result?.data || inquiryStatsResponse.result || {}) : {};

        let trips = tripsResponse?.success ? (Array.isArray(tripsResponse.result) ? tripsResponse.result : tripsResponse.result?.data || []) : [];
        if (!Array.isArray(trips)) trips = [];

        let users = usersResponse?.success ? (Array.isArray(usersResponse.result) ? usersResponse.result : usersResponse.result?.data || []) : [];
        if (!Array.isArray(users)) users = [];

        // Aggregate stats
        // Note: Some of these calculations are estimations based on available data

        // Calculate Revenue (assuming bookings have an amount field)
        const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b?.payment?.amount) || 0), 0);
        const thisMonthRevenue = bookings
            .filter(b => {
                const date = new Date(b.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            })
            .reduce((sum, b) => sum + (Number(b?.payment?.amount) || 0), 0);

        // Bookings status breakdown
        const bookingStatus = {
            draft: bookings.filter(b => b.status === 'DRAFT' || b.status === 'PENDING').length,
            confirmed: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PAID').length,
            cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
            completed: bookings.filter(b => b.status === 'COMPLETED').length,
        };

        // Trips status breakdown
        const tripsStatus = {
            draft: trips.filter(t => t.status === 'DRAFT').length,
            published: trips.filter(t => t.status === 'PUBLISHED').length,
            archived: trips.filter(t => t.status === 'ARCHIVED').length,
        };

        const result = {
            data: {
                revenue: {
                    totalRevenue,
                    thisMonth: thisMonthRevenue,
                    lastMonth: 0, // No easy way to get historical without more processing
                    netRevenue: totalRevenue * 0.9, // Estimation
                },
                bookings: {
                    total: bookings.length,
                    thisMonth: bookings.filter(b => {
                        const date = new Date(b.createdAt);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length,
                    lastMonth: 0,
                    upcoming: bookings.filter(b => new Date(b.tripStartDate) > new Date()).length,
                    byStatus: bookingStatus
                },
                trips: {
                    total: trips.length,
                    createdThisMonth: trips.filter(t => {
                        const date = new Date(t.createdAt);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length,
                    withBookings: trips.filter(t => t._count?.bookings > 0).length,
                    byStatus: tripsStatus
                },
                customers: {
                    total: users.length,
                    newThisMonth: users.filter(u => {
                        const date = new Date(u.createdAt);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length,
                    newLastMonth: 0,
                    verified: users.filter(u => u.isEmailVerified).length
                },
                recentActivity: {
                    recentBookings: bookings.slice(0, 10),
                    recentPayments: bookings.filter(b => b.payment).slice(0, 10),
                    recentCustomers: users.slice(0, 10)
                }
            }
        };

        return { success: true, result };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            error: { message: error?.message || 'Failed to aggregate dashboard stats' }
        };
    }
}
