import type { Localized } from "./types";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const RECORD_TEXT = {
  download: L("Download PDF", "পিডিএফ ডাউনলোড"),
  title: L("Vaccination record", "টিকার রেকর্ড"),
  back: L("Back to dashboard", "ড্যাশবোর্ডে ফিরুন"),
  hint: L(
    "In the print window, choose “Save as PDF” as the destination. To change the language, use the language button in the top bar first.",
    "প্রিন্ট উইন্ডোতে গন্তব্য হিসেবে “Save as PDF” বেছে নিন। ভাষা বদলাতে চাইলে আগে উপরের বারের ভাষা বোতাম ব্যবহার করুন।",
  ),
  child: L("Child details", "সন্তানের তথ্য"),
  parent: L("Parent", "অভিভাবক"),
  generated: L("Generated on", "তৈরির তারিখ"),
  summary: L("Summary", "সারসংক্ষেপ"),
  government: L("Government EPI vaccines", "সরকারি ইপিআই টিকা"),
  private: L("Private / additional vaccines (optional)", "প্রাইভেট / অতিরিক্ত টিকা (ঐচ্ছিক)"),
  vaccine: L("Vaccine", "টিকা"),
  dose: L("Dose", "ডোজ"),
  dueDate: L("Due date", "নির্ধারিত তারিখ"),
  status: L("Status", "অবস্থা"),
  givenOn: L("Given on", "দেওয়ার তারিখ"),
  disclaimer: L(
    "This record is generated from the information entered in ImmuniCare. It is not an official government vaccination certificate. Please keep your child's EPI vaccination card safe.",
    "এই রেকর্ড ImmuniCare-এ দেওয়া তথ্য থেকে তৈরি। এটি সরকারি টিকা সনদ নয়। অনুগ্রহ করে সন্তানের ইপিআই টিকার কার্ড যত্নে রাখুন।",
  ),
  notFound: L("This child was not found.", "এই সন্তানকে খুঁজে পাওয়া যায়নি।"),
};