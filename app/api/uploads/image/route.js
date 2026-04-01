// app/api/uploadS/image/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get('image');

        const formData = new FormData();
        formData.append('image', data.get('image'));
        formData.append('publicId', data.get('publicId'));
        formData.append('folder', data.get('folder') || 'drafts');
        formData.append('userId', data.get('userId') || 'anonymous');
        formData.append(
            'tags',
            data.get('tags') ? JSON.parse(formData.get('tags')) : []
        );

        if (!file) {
            return NextResponse.json(
                { message: 'No image file provided' },
                { status: 400 }
            );
        }

        //  image upload logic
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image`,
            {
                method: 'POST',
                body: formData });
        // Example response structure
        if (!response.ok) {
            const error = await response.json();
            return new Response(
                JSON.stringify({
                    message: error.message || 'Something went wrong' }),
                {
                    status: 500 });
        }
        const responseData = await response.json();

        return new Response(JSON.stringify(responseData), {
            status: response.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Something went wrong' }),
            {
                status: 500 });
    }
}

