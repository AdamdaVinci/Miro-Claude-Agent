import Anthropic from '@anthropic-ai/sdk';
import {NextResponse} from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY, // Získání klíče z proměnných prostředí
});

export async function POST(request: Request) {
    try {
        const {prompt, context} = await request.json();

        if (!prompt) {
            return NextResponse.json({error: 'Prompt is required'}, {status: 400});
        }

        // Sestavení zprávy pro Claude
        const userMessage = `Context from Miro board:
${context}

User query: ${prompt}`;

        const msg = await anthropic.messages.create({
            model: 'claude-3-opus-20240229', // Nebo jiný model, např. claude-3-haiku-20240307
            max_tokens: 1024,
            messages: [{role: 'user', content: userMessage}],
        });

        // Extrahování textové odpovědi
        const claudeResponse = msg.content[0]?.type === 'text' ? msg.content[0].text : 'No text response from Claude.';

        return NextResponse.json({response: claudeResponse});
    } catch (error) {
        console.error("Error calling Claude API:", error);
        // Vrácení obecné chybové zprávy
        return NextResponse.json({error: 'Failed to get response from Claude API'}, {status: 500});
    }
} 