'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Social Media links
 */
export async function getSocialMedia() {
    try {
        const responsePromise = fetch(`${baseUrl}/settings/social-media`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { 
                revalidate: 3600, 
                tags: ['social-media'] 
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch social media links' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
