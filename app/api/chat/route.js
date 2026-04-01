import { SUPPORT_AGENT_SYSTEM_PROMPT } from '@/utils/system-prompts/support-agent-system-prompt';
import { createGroq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText } from 'ai';

export const maxDuration = 30;

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    const { messages } = await req.json();

    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        system: SUPPORT_AGENT_SYSTEM_PROMPT,
        messages: await convertToModelMessages(messages) });

    return result.toUIMessageStreamResponse();
}