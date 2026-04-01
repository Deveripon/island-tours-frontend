import { auth } from '@/auth';

export async function POST(req) {
    try {
        // 1. Get the NextAuth session
        const session = await auth();

        if (!session || !session.accessToken) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401 });
        }

        const userAccessToken = session.accessToken;

        // 2. Get the incoming form data
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response(
                JSON.stringify({ message: 'No file provided' }),
                {
                    status: 400 });
        }

        // 3. Prepare the form data to send to your NestJS backend
        const backendFormData = new FormData();
        backendFormData.append('image', file);

        // 4. Call your NestJS backend API to upload the image
        const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/profile-photo`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${userAccessToken}`, // ✅ Use token from session
                    // Don't set Content-Type manually when sending FormData
                },
                body: backendFormData });

        const responseData = await uploadResponse.json();

        return new Response(JSON.stringify(responseData), {
            status: uploadResponse.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Something went wrong' }),
            {
                status: 500 });
    }
}

