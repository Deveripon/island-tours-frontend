'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Tenant Site Theme
 */
export async function getSiteTheme() {
    try {
        const responsePromise = fetch(`${baseUrl}/settings/site-theme`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: {
                revalidate: 3600,
                tags: ['site-theme']
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch site theme' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
