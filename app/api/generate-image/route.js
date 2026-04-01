import { createVertex } from '@ai-sdk/google-vertex';
import { generateImage } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

// IMPORTANT: Increase body size limit for base64 images
export const bodyParser = {
    sizeLimit: '10mb',
};

const vertex = createVertex({
    project: process.env.GOOGLE_VERTEX_PROJECT,
    location: process.env.GOOGLE_VERTEX_LOCATION,
    googleCloudCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
        ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
        : undefined });


export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt, referenceImages, aspectRatio = "1:1" } = body;

        const isEditing = referenceImages && referenceImages.length > 0;

        if (isEditing) {
            // Convert to Buffer
            // Handling the array of images
            const buffers = referenceImages?.map(img => Buffer.from(img, 'base64')) || [];
            const { image } = await generateImage({
                model: vertex.image('imagen-3.0-capability-001'),
                prompt: {
                    text: prompt,
                    images: buffers,
                    mask: buffers[0],
                },
                providerOptions: {
                    vertex: {
                        editMode: 'EDIT_MODE_DEFAULT',
                    },
                } });
            return Response.json({
                url: `data:${image.mediaType};base64,${image.base64}` });

        } else {
            const { image } = await generateImage({
                model: vertex.image('imagen-4.0-ultra-generate-001'),
                prompt,
                aspectRatio });

            return Response.json({ url: `data:${image.mediaType};base64,${image.base64}` });
        }
    } catch (error) {
        console.error("Vertex Error:", error);
        return Response.json({
            error: error instanceof z.ZodError ? "Invalid input data" : error.message
        }, { status: 500 });
    }
}