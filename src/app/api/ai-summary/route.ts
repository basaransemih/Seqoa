import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query, results } = await req.json();

        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Hugging Face API key not configured. Please add HUGGINGFACE_API_KEY to .env.local' }, { status: 503 });
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

        // Hugging Face strictly follows this format for open-source models
        const prompt = `<|system|>\n${systemPrompt}</s>\n<|user|>\n${userMessage}</s>\n<|assistant|>\n`;

        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 120,
                    temperature: 0.4,
                    return_full_text: false,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Hugging Face API error:', errorText);
            
            try {
                const errorJson = JSON.parse(errorText);
                const message = errorJson.error || 'AI service unavailable.';
                return NextResponse.json({ error: message }, { status: response.status });
            } catch {
                return NextResponse.json({ error: 'AI service unavailable.' }, { status: 502 });
            }
        }

        const data = await response.json();
        // Hugging Face returns an array with generated_text
        let summary = data[0]?.generated_text?.trim() || null;
        
        // Clean up any weird prefixes sometimes generated
        if (summary) {
             summary = summary.replace(/^Summary:/i, '').trim();
             summary = summary.replace(/^Here is a one-sentence summary:/i, '').trim();
        }

        return NextResponse.json({ summary });
    } catch (err) {
        console.error('AI summary route error:', err);
        return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
    }
}
