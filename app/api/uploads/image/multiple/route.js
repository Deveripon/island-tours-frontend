import { NextResponse } from 'next/server';

// app/api/upload/image/multiple/route.js
export async function POST(req) {
    try {
        const data = await req.formData();
        const files = data.getAll('gallery'); // Use getAll() to get multiple files

        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: 'No image files provided' },
                { status: 400 }
            );
        }

        // Create new FormData for the external API
        const formData = new FormData();

        // Append all files
        files.forEach(file => {
            formData.append('gallery', file);
        });

        // Append other data
        formData.append('folder', data.get('folder') || 'drafts');
        formData.append('userId', data.get('userId') || 'anonymous');

        // Handle tags properly
        const tagsData = data.get('tags');
        if (tagsData) {
            formData.append('tags', tagsData); // Don't parse here, send as string
        }

        // Multiple image upload logic
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image/multiple`,
            {
                method: 'POST',
                body: formData });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: error.message || 'Something went wrong' },
                { status: response.status }
            );
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);
    } catch (error) {
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        );
    }
}

