'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Tenant Site Info
 */
export async function getSiteInfo() {

    try {
        const responsePromise = fetch(`${baseUrl}/settings/site-info`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: {
                revalidate: 3600,
                tags: ['site-info']
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch site info' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
