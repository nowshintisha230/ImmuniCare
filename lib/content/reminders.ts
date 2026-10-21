import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const REMINDER_TEXT = {
  label: L("Email reminders", "ইমেইল রিমাইন্ডার"),
  hint: L(
    "Get an email 3 days before a dose, on the due day, and a weekly note about overdue doses. Sent around 8 AM.",
    "ডোজের ৩ দিন আগে, নির্ধারিত দিনে এবং বাকি থাকা ডোজের জন্য সপ্তাহে একবার ইমেইল পাবেন। সকাল প্রায় ৮টায় পাঠানো হয়।",
  ),
  sendTest: L("Send a test email", "টেস্ট ইমেইল পাঠান"),
  testSent: L("Test email sent. Check your inbox and spam folder.", "টেস্ট ইমেইল পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।"),
  testLimit: L("You can send one test email per day.", "দিনে একটি টেস্ট ইমেইল পাঠানো যায়।"),
  testFailed: L("Could not send the email. Please try later.", "ইমেইল পাঠানো যায়নি। পরে চেষ্টা করুন।"),
  notConfigured: L("Email sending is not set up yet.", "ইমেইল পাঠানোর ব্যবস্থা এখনো চালু হয়নি।"),
};