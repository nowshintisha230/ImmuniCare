import type { Language } from "@/lib/i18n/dictionary";
import {
  EMERGENCY_ANSWER,
  EMERGENCY_KEYWORDS,
  FALLBACK_ANSWER,
  KNOWLEDGE,
} from "./knowledge";

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
}

export function isEmergency(text: string) {
  const q = normalize(text);
  return EMERGENCY_KEYWORDS.some((k) => q.includes(k));
}

export function emergencyAnswer(language: Language) {
  return EMERGENCY_ANSWER[language];
}

export function localAnswer(text: string, language: Language) {
  const q = normalize(text);
  let best: { score: number; answer: string } | null = null;

  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) score += keyword.length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer[language] };
    }
  }

  return best?.answer ?? FALLBACK_ANSWER[language];
}

export function knowledgeContext(language: Language) {
  return KNOWLEDGE.map((e) => `- ${e.answer[language].replace(/\n/g, " ")}`).join("\n");
}