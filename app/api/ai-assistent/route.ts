import { NextResponse } from "next/server";
import { z } from "zod";
import { emergencyAnswer, isEmergency, knowledgeContext, localAnswer } from "@/lib/assistant/local-answer";

const bodySchema = z.object({
  language: z.enum(["en", "bn"]),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1000) }))
    .min(1)
    .max(12),
});

type Language = "en" | "bn";

async function askGemini(
  apiKey: string,
  language: Language,
  messages: { role: "user" | "assistant"; content: string }[],
) {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const system = `You are ImmuniCare Assistant for childhood vaccination in Bangladesh (national EPI programme).
Answer ONLY using the facts below. Keep answers short and simple. Reply in ${language === "bn" ? "Bangla" : "English"}.
You are not a doctor: never diagnose or give medicine doses. For emergencies, tell the parent to go to a doctor or hospital immediately.
If the facts do not answer the question, say you are not sure and suggest the nearest EPI centre or doctor.

Facts:
${knowledgeContext(language)}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 600, temperature: 0.2 },
      }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!res.ok) throw new Error(`gemini ${res.status}`);

  const data = await res.json();
  const text: string = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
  return text || null;
}

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const { messages, language } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  
  if (isEmergency(lastUser)) {
    return NextResponse.json({ reply: emergencyAnswer(language) });
  }

  
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const reply = await askGemini(apiKey, language, messages);
      if (reply) return NextResponse.json({ reply });
    } catch (error) {
      console.error("gemini error:", error);
    }
  }

  
  return NextResponse.json({ reply: localAnswer(lastUser, language) });
}