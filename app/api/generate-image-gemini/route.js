import { google } from '@ai-sdk/google';
import { generateImage } from 'ai';

export const maxDuration = 60;



export async function POST(req) {
    try {
        const { prompt, referenceImage, aspectRatio = "1:1" } = await req.json();

        // Convert base64 to Uint8Array for Vertex AI provider compatibility
        const imageBuffer = referenceImage ? Buffer.from(referenceImage, 'base64') : null;
        const uint8Array = imageBuffer ? new Uint8Array(imageBuffer) : null;

        const { image } = await generateImage({
            model: google.image('imagen-4.0-generate-001'),
            prompt: {
                text: prompt,
                images: uint8Array ? [uint8Array] : [],
            },
            aspectRatio });

        return new Response(JSON.stringify({
            url: `data:${image.mediaType};base64,${image.base64}` }), { headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Vertex Generation Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}