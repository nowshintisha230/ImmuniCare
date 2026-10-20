import type { Localized } from "@/lib/content/types";

export type KnowledgeEntry = {
  id: string;
  keywords: string[]; // lowercase, English + Bangla
  answer: Localized;
};

export const EMERGENCY_KEYWORDS = [
  "convuls", "seizure", "breathing", "unconscious", "faint", "allergic", "anaphyla", "turning blue",
  "খিঁচুনি", "খিচুনি", "শ্বাসকষ্ট", "শ্বাস নিতে", "অজ্ঞান", "নীল হয়ে",
];

export const EMERGENCY_ANSWER: Localized = {
  en: "This may be an emergency. Please take your child to the nearest doctor or hospital right now. Do not wait.",
  bn: "এটি জরুরি অবস্থা হতে পারে। এখনই আপনার সন্তানকে নিকটস্থ ডাক্তার বা হাসপাতালে নিয়ে যান। দেরি করবেন না।",
};

export const FALLBACK_ANSWER: Localized = {
  en: "Sorry, I don't have a reliable answer for that. Please ask your nearest EPI centre, vaccinator or doctor. You can ask me about the vaccine schedule, what each vaccine protects against, missed doses, or mild side effects.",
  bn: "দুঃখিত, এ বিষয়ে আমার কাছে নির্ভরযোগ্য উত্তর নেই। অনুগ্রহ করে নিকটস্থ ইপিআই কেন্দ্র, টিকাদানকর্মী বা ডাক্তারকে জিজ্ঞেস করুন। আপনি আমাকে টিকার সময়সূচি, কোন টিকা কোন রোগ থেকে রক্ষা করে, মিস হওয়া ডোজ বা সাধারণ পার্শ্বপ্রতিক্রিয়া সম্পর্কে জিজ্ঞেস করতে পারেন।",
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "schedule",
    keywords: ["schedule", "chart", "all vaccines", "which vaccines", "vaccine list", "সময়সূচি", "চার্ট", "কোন কোন টিকা", "সব টিকা", "টিকার তালিকা"],
    answer: {
      en: "Routine EPI schedule in Bangladesh:\n• At birth: BCG\n• 6 weeks: Pentavalent, OPV, PCV, IPV\n• 10 weeks: Pentavalent, OPV, PCV\n• 14 weeks: Pentavalent, OPV, PCV, IPV\n• 9 months: MR, TCV\n• 15 months: MR\n• Girls (grades 5-9, or age 10-14 out of school): HPV\n• Women 15-49: Td (5 doses)\nPlease confirm dates with your EPI centre.",
      bn: "বাংলাদেশের নিয়মিত ইপিআই সময়সূচি:\n• জন্মের সময়: BCG\n• ৬ সপ্তাহ: পেন্টাভ্যালেন্ট, OPV, PCV, IPV\n• ১০ সপ্তাহ: পেন্টাভ্যালেন্ট, OPV, PCV\n• ১৪ সপ্তাহ: পেন্টাভ্যালেন্ট, OPV, PCV, IPV\n• ৯ মাস: MR, TCV\n• ১৫ মাস: MR\n• মেয়েরা (৫ম–৯ম শ্রেণি, বা স্কুলের বাইরে ১০–১৪ বছর): HPV\n• ১৫–৪৯ বছর বয়সী নারী: Td (৫ ডোজ)\nতারিখ আপনার ইপিআই কেন্দ্র থেকে নিশ্চিত করুন।",
    },
  },
  {
    id: "bcg",
    keywords: ["bcg", "tuberculosis", "tb ", "birth", "newborn", "scar", "যক্ষ্মা", "জন্মের সময়", "নবজাতক", "দাগ"],
    answer: {
      en: "BCG protects against tuberculosis and is given at birth (or as soon as possible after). A small bump or scar at the injection spot is normal.",
      bn: "BCG যক্ষ্মা থেকে সুরক্ষা দেয় এবং জন্মের সময় (বা যত দ্রুত সম্ভব) দেওয়া হয়। ইনজেকশনের জায়গায় ছোট ফোলা বা দাগ হওয়া স্বাভাবিক।",
    },
  },
  {
    id: "penta",
    keywords: ["penta", "pentavalent", "diphtheria", "whooping", "hepatitis", "hib", "পেন্টা", "ডিপথেরিয়া", "হুপিং", "হেপাটাইটিস"],
    answer: {
      en: "The pentavalent vaccine protects against 5 diseases: diphtheria, tetanus, whooping cough, hepatitis B and Hib. It is given at 6, 10 and 14 weeks.",
      bn: "পেন্টাভ্যালেন্ট টিকা ৫টি রোগ থেকে রক্ষা করে: ডিপথেরিয়া, ধনুষ্টংকার, হুপিং কাশি, হেপাটাইটিস বি ও হিব। এটি ৬, ১০ ও ১৪ সপ্তাহে দেওয়া হয়।",
    },
  },
  {
    id: "polio",
    keywords: ["polio", "opv", "ipv", "drops", "পোলিও", "ড্রপ"],
    answer: {
      en: "Polio vaccines: OPV (oral drops) at 6, 10 and 14 weeks, and IPV (injection) at 6 and 14 weeks. Together they protect against polio paralysis.",
      bn: "পোলিও টিকা: OPV (মুখে খাওয়ার ড্রপ) ৬, ১০ ও ১৪ সপ্তাহে এবং IPV (ইনজেকশন) ৬ ও ১৪ সপ্তাহে। দুটি মিলে পোলিও পক্ষাঘাত থেকে রক্ষা করে।",
    },
  },
  {
    id: "pcv",
    keywords: ["pcv", "pneumonia", "pneumococcal", "নিউমোনিয়া", "নিউমোকক্কাল"],
    answer: {
      en: "PCV protects against serious pneumococcal infections such as pneumonia. It is given at 6, 10 and 14 weeks.",
      bn: "PCV নিউমোনিয়ার মতো গুরুতর নিউমোকক্কাল সংক্রমণ থেকে রক্ষা করে। এটি ৬, ১০ ও ১৪ সপ্তাহে দেওয়া হয়।",
    },
  },
  {
    id: "mr",
    keywords: ["mr ", "mr?", "mr.", "measles", "rubella", "9 month", "15 month", "হাম", "রুবেলা", "এমআর", "৯ মাস", "১৫ মাস"],
    answer: {
      en: "The MR vaccine protects against measles and rubella. Two doses are given: at 9 months and at 15 months.",
      bn: "MR টিকা হাম ও রুবেলা থেকে রক্ষা করে। দুই ডোজ দেওয়া হয়: ৯ মাসে এবং ১৫ মাসে।",
    },
  },
  {
    id: "tcv",
    keywords: ["tcv", "typhoid", "টাইফয়েড"],
    answer: {
      en: "The typhoid conjugate vaccine (TCV) is one dose given at 9 months, together with the first MR dose.",
      bn: "টাইফয়েড কনজুগেট টিকা (TCV) ৯ মাসে এক ডোজ দেওয়া হয়, প্রথম MR ডোজের সঙ্গে।",
    },
  },
  {
    id: "hpv",
    keywords: ["hpv", "cervical", "cancer", "জরায়ু", "ক্যান্সার"],
    answer: {
      en: "The HPV vaccine helps protect against cervical cancer. It is offered to girls in grades 5-9, or girls aged 10-14 who are out of school.",
      bn: "HPV টিকা জরায়ুমুখ ক্যান্সার থেকে সুরক্ষা দিতে সাহায্য করে। এটি ৫ম–৯ম শ্রেণির মেয়েদের, বা স্কুলের বাইরে থাকা ১০–১৪ বছর বয়সী মেয়েদের দেওয়া হয়।",
    },
  },
  {
    id: "td",
    keywords: ["td ", "tt ", "tetanus", "pregnan", "mother", "women", "ধনুষ্টংকার", "গর্ভবতী", "মা ", "নারী"],
    answer: {
      en: "Women aged 15-49 get 5 doses of tetanus (Td) vaccine. It protects both the mother and her newborn from tetanus. Ask your health worker about your dose dates.",
      bn: "১৫–৪৯ বছর বয়সী নারীরা ধনুষ্টংকার (Td) টিকার ৫ ডোজ পান। এটি মা ও নবজাতক উভয়কে ধনুষ্টংকার থেকে রক্ষা করে। ডোজের তারিখ স্বাস্থ্যকর্মীর কাছ থেকে জেনে নিন।",
    },
  },
  {
    id: "side-effects",
    keywords: ["fever", "temperature", "swelling", "pain", "crying", "side effect", "reaction", "after vaccin", "জ্বর", "পার্শ্বপ্রতিক্রিয়া", "ব্যথা", "ফোলা", "কাঁদ", "টিকার পর"],
    answer: {
      en: "After vaccination, mild fever, a sore or swollen spot, and fussiness are common and usually pass in 1-2 days. Keep your baby comfortable, breastfeed or feed often, and dress lightly. See a doctor if the fever is high or lasts more than 2 days, the baby cries non-stop, refuses feeds, or the swelling keeps growing. Go to a hospital immediately for convulsions, trouble breathing or swelling of the face.",
      bn: "টিকার পর হালকা জ্বর, ইনজেকশনের জায়গায় ব্যথা বা ফোলা এবং খিটখিটে ভাব সাধারণ, সাধারণত ১–২ দিনে ঠিক হয়ে যায়। শিশুকে আরামে রাখুন, বারবার বুকের দুধ বা খাবার দিন এবং হালকা পোশাক পরান। জ্বর বেশি হলে বা ২ দিনের বেশি থাকলে, শিশু একটানা কাঁদলে, খেতে না চাইলে বা ফোলা বাড়তে থাকলে ডাক্তার দেখান। খিঁচুনি, শ্বাসকষ্ট বা মুখ ফুলে গেলে সঙ্গে সঙ্গে হাসপাতালে যান।",
    },
  },
  {
    id: "missed",
    keywords: ["miss", "late", "delay", "forgot", "skipped", "overdue", "restart", "মিস", "দেরি", "ভুলে", "বাদ পড়ে", "আবার শুরু"],
    answer: {
      en: "If a dose is missed, don't panic and don't restart the series. Take your child to the nearest EPI centre as soon as possible and the health worker will continue from where you stopped. Bring the vaccination card.",
      bn: "কোনো ডোজ মিস হলে ঘাবড়াবেন না, আর সিরিজ নতুন করে শুরু করতে হবে না। যত দ্রুত সম্ভব নিকটস্থ ইপিআই কেন্দ্রে যান, স্বাস্থ্যকর্মী যেখানে থেমেছিলেন সেখান থেকে চালিয়ে যাবেন। টিকার কার্ড সঙ্গে নিন।",
    },
  },
  {
    id: "sick",
    keywords: ["cold", "cough", "sick", "ill", "unwell", "diarrhea", "diarrhoea", "সর্দি", "কাশি", "অসুস্থ", "ডায়রিয়া"],
    answer: {
      en: "A mild illness like a cold or mild cough is usually not a reason to delay vaccination. If your child has a high fever or is seriously ill, tell the vaccinator or doctor first and follow their advice.",
      bn: "সর্দি বা হালকা কাশির মতো সামান্য অসুস্থতায় সাধারণত টিকা পিছিয়ে দিতে হয় না। শিশুর বেশি জ্বর বা গুরুতর অসুস্থতা থাকলে আগে টিকাদানকর্মী বা ডাক্তারকে জানান এবং তাঁদের পরামর্শ মানুন।",
    },
  },
  {
    id: "where",
    keywords: ["where", "free", "cost", "price", "centre", "center", "clinic", "কোথায়", "বিনামূল্যে", "খরচ", "কেন্দ্র", "ক্লিনিক"],
    answer: {
      en: "Routine EPI vaccines are provided under the national programme at government health facilities and EPI outreach centres. Ask your local health worker or nearest government clinic about the centre and session days, and confirm whether any fee applies.",
      bn: "নিয়মিত ইপিআই টিকা জাতীয় কর্মসূচির আওতায় সরকারি স্বাস্থ্যকেন্দ্র ও ইপিআই আউটরিচ কেন্দ্রে দেওয়া হয়। কেন্দ্র ও টিকাদানের দিন সম্পর্কে স্থানীয় স্বাস্থ্যকর্মী বা নিকটস্থ সরকারি ক্লিনিকে জিজ্ঞেস করুন এবং কোনো ফি আছে কি না নিশ্চিত হয়ে নিন।",
    },
  },
  {
    id: "card",
    keywords: ["card", "record", "document", "কার্ড", "রেকর্ড"],
    answer: {
      en: "Keep your child's vaccination card safe and bring it to every visit. You can also record doses in ImmuniCare, but the card is the official record.",
      bn: "সন্তানের টিকার কার্ড যত্নে রাখুন এবং প্রতিবার সঙ্গে নিন। আপনি ImmuniCare-এও ডোজ রেকর্ড করতে পারেন, তবে কার্ডই সরকারি রেকর্ড।",
    },
  },
  {
    id: "app",
    keywords: ["immunicare", "app", "register", "account", "reminder", "অ্যাপ", "রেজিস্টার", "অ্যাকাউন্ট", "রিমাইন্ডার"],
    answer: {
      en: "ImmuniCare lets you register your child, see their vaccine schedule from the date of birth, get reminders and keep records. Create an account from the Register page to start.",
      bn: "ImmuniCare-এ আপনি সন্তানকে রেজিস্টার করতে, জন্ম তারিখ থেকে টিকার সময়সূচি দেখতে, রিমাইন্ডার পেতে এবং রেকর্ড রাখতে পারবেন। শুরু করতে Register পেজ থেকে অ্যাকাউন্ট খুলুন।",
    },
  },
];