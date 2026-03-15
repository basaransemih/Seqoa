import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query, results } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured. Please add GEMINI_API_KEY to .env.local' }, { status: 503 });
        }

        // Build a compact context from results (max 5 results, ~150 chars each)
        const contextSnippets = (results || [])
            .slice(0, 5)
            .map((r: { title: string; description: string }, i: number) =>
                `${i + 1}. ${r.title}: ${(r.description || '').slice(0, 150)}`
            )
            .join('\n');

        const systemPrompt = `You are the AI assistant for Seqoa, a meta-search engine. 
Based on the user's search query and top search results, write exactly one concise sentence that directly answers or contextualizes the query.
Be factual, neutral, and helpful. Write in plain English. Do not mention sources or say "based on results".`;

        const userMessage = `Search query: "${query}"\n\nTop results:\n${contextSnippets}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: systemPrompt + "\n\n" + userMessage }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 120,
                    temperature: 0.4,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            
            try {
                const errorJson = JSON.parse(errorText);
                const message = errorJson.error?.message || 'AI service unavailable.';
                return NextResponse.json({ error: message }, { status: response.status });
            } catch {
                return NextResponse.json({ error: 'AI service unavailable.' }, { status: 502 });
            }
        }

        const data = await response.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;

        return NextResponse.json({ summary });
    } catch (err) {
        console.error('AI summary route error:', err);
        return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
    }
}
