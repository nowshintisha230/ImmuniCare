import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistant/assistant-chat";

export const metadata: Metadata = { title: "ImmuniCare Assistant" };

export default function AssistantPage() {
  return <AssistantChat />;
}