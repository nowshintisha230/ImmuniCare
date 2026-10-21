import { formatDateKey } from "@/lib/format";
import type { Language } from "@/lib/i18n/dictionary";

export type DoseLine = { name: string; doseNumber: number; dueDate: string };
export type ChildReminder = {
  childName: string;
  today: DoseLine[];
  soon: DoseLine[];
  overdue: DoseLine[];
};

type Copy = {
  greeting: (name: string) => string;
  intro: string;
  today: string;
  soon: string;
  overdue: string;
  dose: (n: number) => string;
  due: string;
  action: string;
  button: string;
  note: string;
  unsub: string;
};

const COPY: Record<Language, Copy> = {
  bn: {
    greeting: (n) => `প্রিয় ${n},`,
    intro: "আপনার সন্তানের টিকার ব্যাপারে একটি রিমাইন্ডার:",
    today: "আজ দেওয়ার দিন",
    soon: "আগামী ৩ দিনের মধ্যে",
    overdue: "বাকি আছে (সময় পেরিয়ে গেছে)",
    dose: (n) => `${n} নম্বর ডোজ`,
    due: "নির্ধারিত",
    action: "টিকা আগে দেওয়া হয়ে থাকলে ড্যাশবোর্ডে “দেওয়া হয়েছে” মার্ক করুন। না হলে নিকটস্থ ইপিআই কেন্দ্রে যান।",
    button: "ড্যাশবোর্ড খুলুন",
    note: "ImmuniCare সাধারণ তথ্য দেয়, চিকিৎসা পরামর্শ নয়। তারিখ ইপিআই কেন্দ্র থেকে নিশ্চিত করুন।",
    unsub: "এই ইমেইল আর পেতে না চাইলে এখানে ক্লিক করুন",
  },
  en: {
    greeting: (n) => `Dear ${n},`,
    intro: "A reminder about your child's vaccines:",
    today: "Due today",
    soon: "Due within 3 days",
    overdue: "Overdue",
    dose: (n) => `dose ${n}`,
    due: "due",
    action: "If the dose was already given, mark it as given in your dashboard. If not, please visit your nearest EPI centre.",
    button: "Open dashboard",
    note: "ImmuniCare gives general information, not medical advice. Confirm dates with your EPI centre.",
    unsub: "Don't want these emails? Unsubscribe here",
  },
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function line(lang: Language, d: DoseLine) {
  const c = COPY[lang];
  return `${d.name}, ${c.dose(d.doseNumber)} (${c.due} ${formatDateKey(d.dueDate, lang)})`;
}

type Args = {
  parentName: string;
  reminders: ChildReminder[];
  unsubscribeUrl: string;
  appUrl: string;
};

export function buildReminderEmail({ parentName, reminders, unsubscribeUrl, appUrl }: Args) {
  const langs: Language[] = ["bn", "en"];
  const link = `${appUrl}/dashboard?tab=schedule`;

  const htmlBlocks = langs.map((lang) => {
    const c = COPY[lang];
    const groups = reminders
      .map((r) => {
        const sections = (
          [
            [c.today, r.today],
            [c.soon, r.soon],
            [c.overdue, r.overdue],
          ] as [string, DoseLine[]][]
        )
          .filter(([, list]) => list.length)
          .map(
            ([title, list]) =>
              `<p style="margin:8px 0 4px;font-weight:600">${esc(title)}</p><ul style="margin:0 0 8px;padding-left:20px">${list
                .map((d) => `<li>${esc(line(lang, d))}</li>`)
                .join("")}</ul>`,
          )
          .join("");
        return `<div style="margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:8px"><strong>${esc(r.childName)}</strong>${sections}</div>`;
      })
      .join("");

    return `<p>${esc(c.greeting(parentName))}</p><p>${esc(c.intro)}</p>${groups}<p>${esc(c.action)}</p><p><a href="${esc(
      link,
    )}" style="display:inline-block;background:#0f766e;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">${esc(
      c.button,
    )}</a></p>`;
  });

  const footer = langs
    .map((lang) => `<p style="font-size:12px;color:#6b7280">${esc(COPY[lang].note)}</p>`)
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111827">
<h2 style="color:#0f766e;margin-bottom:4px">ImmuniCare</h2>
${htmlBlocks.join('<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">')}
${footer}
<p style="font-size:12px"><a href="${esc(unsubscribeUrl)}">${esc(COPY.bn.unsub)}</a> / <a href="${esc(unsubscribeUrl)}">${esc(COPY.en.unsub)}</a></p>
</div>`;

  const textBlocks = langs.map((lang) => {
    const c = COPY[lang];
    const body = reminders
      .map((r) => {
        const parts = (
          [
            [c.today, r.today],
            [c.soon, r.soon],
            [c.overdue, r.overdue],
          ] as [string, DoseLine[]][]
        )
          .filter(([, list]) => list.length)
          .map(([title, list]) => `${title}:\n${list.map((d) => `  - ${line(lang, d)}`).join("\n")}`)
          .join("\n");
        return `${r.childName}\n${parts}`;
      })
      .join("\n\n");
    return `${c.greeting(parentName)}\n${c.intro}\n\n${body}\n\n${c.action}\n${link}`;
  });

  const text = `${textBlocks.join("\n\n----------\n\n")}\n\n${unsubscribeUrl}`;

  return { subject: "ImmuniCare: টিকার রিমাইন্ডার / Vaccine reminder", html, text };
}