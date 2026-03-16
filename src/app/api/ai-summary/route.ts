import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { query, results } = await req.json();

        const contextSnippets = (results || [])
            .slice(0, 5)
            .map((r: { title: string; description: string }, i: number) =>
                `${i + 1}. ${r.title}: ${(r.description || '').slice(0, 150)}`
            )
            .join('\n');

        // Komutu en başa ve net bir şekilde ekliyoruz
        const systemPrompt = `Sen Seqoa için bir yardımcı asistansın. 
        Aşağıdaki arama sonuçlarına dayanarak, kullanıcının sorusunu tek bir kısa cümleyle TÜRKÇE olarak cevapla. 
        Asla İngilizce cevap verme. Kaynaklardan bahsetme.`;

        const userMessage = `Soru: "${query}"\nSonuçlar:\n${contextSnippets}`;
        const fullPrompt = `${systemPrompt}\n\n${userMessage}`;

        // HIZ İÇİN ÖNEMLİ: 'model=openai' genellikle en hızlısıdır. 
        // Eğer hala yavaşsa 'model=mistral' veya 'model=llama' deneyebilirsin.
        const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai&cache=true`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return NextResponse.json({ error: 'AI şu an meşgul.' }, { status: 502 });
        }

        const summary = await response.text();

        return NextResponse.json({ summary: summary.trim() });
    } catch (err) {
        console.error('AI hatası:', err);
        return NextResponse.json({ error: 'Sistemsel hata.' }, { status: 500 });
    }
}