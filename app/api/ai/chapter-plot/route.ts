import { NextResponse } from "next/server";
import { generateFallbackChapterPlot, type ChapterPlotInput } from "@/lib/chapter-plot";

export async function POST(request: Request) {
  const input = (await request.json()) as ChapterPlotInput;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      mode: "local",
      ...generateFallbackChapterPlot(input)
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        instructions:
          "Jesteś polskim story editorem. Generuj konkretne, użyteczne plany rozdziałów. Zwracaj wyłącznie poprawny JSON bez markdown.",
        input: `Wygeneruj pełną fabułę rozdziałów dla książki. Dane: ${JSON.stringify(input)}. Format JSON: { "logline": string, "actStructure": string[], "chapters": [{ "number": number, "title": string, "pov": string, "place": string, "goal": string, "plotFunction": string, "emotionalFunction": string, "externalConflict": string, "internalConflict": string, "romanticTension": string, "revealedSecret": string, "openingScene": string, "middleScene": string, "endingScene": string, "cliffhanger": string, "readerFeeling": string, "songOrVibe": string }] }`,
        max_output_tokens: 6000
      })
    });

    if (!response.ok) {
      return NextResponse.json({ mode: "local", ...generateFallbackChapterPlot(input) });
    }

    const data = await response.json();
    const text =
      data.output_text ??
      data.output?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? []).map((content: { text?: string }) => content.text ?? "").join("") ??
      "";
    const parsed = JSON.parse(text);

    return NextResponse.json({ mode: "ai", ...parsed });
  } catch {
    return NextResponse.json({ mode: "local", ...generateFallbackChapterPlot(input) });
  }
}
