import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const value = process.env.UNSUBSCRIBE_SECRET ?? process.env.CRON_SECRET;
  if (!value) throw new Error("CRON_SECRET (or UNSUBSCRIBE_SECRET) is not set");
  return value;
}

export function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function token(userId: string) {
  return createHmac("sha256", secret()).update(`unsubscribe:${userId}`).digest("hex");
}

export function verifyUnsubscribeToken(userId: string, given: string) {
  const a = Buffer.from(token(userId));
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unsubscribeUrl(userId: string) {
  return `${appUrl()}/api/unsubscribe?u=${encodeURIComponent(userId)}&t=${token(userId)}`;
}