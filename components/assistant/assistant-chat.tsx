"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { ASSISTANT_TEXT } from "@/lib/content/home";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

export function AssistantChat() {
  const { l, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, messages: next.slice(-12) }),
      });
      if (!res.ok) throw new Error();
      const { reply } = await res.json();
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold">{l(ASSISTANT_TEXT.title)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{l(ASSISTANT_TEXT.subtitle)}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-card p-4">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {ASSISTANT_TEXT.suggestions.map((s) => (
              <Button key={s.en} type="button" variant="outline" size="sm" onClick={() => send(l(s))}>
                {l(s)}
              </Button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {m.content}
            </p>
          </div>
        ))}
        {loading && <p className="text-sm text-muted-foreground">{l(ASSISTANT_TEXT.thinking)}</p>}
        {error && <p className="text-sm text-destructive">{l(ASSISTANT_TEXT.error)}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex gap-2"
      >
        <Input
          value={input}
          maxLength={1000}
          onChange={(e) => setInput(e.target.value)}
          placeholder={l(ASSISTANT_TEXT.placeholder)}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {l(ASSISTANT_TEXT.send)}
        </Button>
      </form>
    </div>
  );
}