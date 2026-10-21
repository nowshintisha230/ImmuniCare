import { connection } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";
import { prisma } from "@/lib/prisma";

function page(ok: boolean) {
  const body = ok
    ? "<h2>আপনি আনসাবস্ক্রাইব হয়েছেন / You are unsubscribed</h2><p>আপনি আর টিকার ইমেইল রিমাইন্ডার পাবেন না। চাইলে প্রোফাইল থেকে আবার চালু করতে পারবেন।<br>You will no longer get vaccine reminder emails. You can turn them back on from your profile.</p>"
    : "<h2>লিংকটি সঠিক নয় / Invalid link</h2><p>প্রোফাইল থেকে ইমেইল রিমাইন্ডার বন্ধ করুন।<br>Please turn off email reminders from your profile.</p>";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ImmuniCare</title></head><body style="font-family:Arial,sans-serif;max-width:480px;margin:60px auto;padding:0 16px;color:#111827">${body}<p><a href="/">ImmuniCare</a></p></body></html>`;
}

export async function GET(req: Request) {
  await connection();
  const params = new URL(req.url).searchParams;
  const userId = params.get("u") ?? "";
  const token = params.get("t") ?? "";

  let ok = false;
  try {
    if (userId && token && verifyUnsubscribeToken(userId, token)) {
      await prisma.user.update({ where: { id: userId }, data: { emailReminders: false } });
      ok = true;
    }
  } catch {
    ok = false;
  }

  return new Response(page(ok), {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}