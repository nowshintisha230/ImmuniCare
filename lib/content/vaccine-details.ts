import type { Localized } from "./types";
import type { VaccineKey } from "./vaccine-info";

const L = (en: string, bn: string): Localized => ({ en, bn });

export const VACCINE_SLUGS: Record<VaccineKey, string> = {
  BCG: "bcg",
  PENTA: "pentavalent",
  OPV: "opv",
  IPV: "ipv",
  PCV: "pcv",
  MR: "mr",
  TCV: "tcv",
  ROTA: "rotavirus",
  HEPA: "hepatitis-a",
  VAR: "varicella",
  FLU: "influenza",
  MMR: "mmr",
  HPV: "hpv",
};

export function findVaccineBySlug(slug: string): VaccineKey | undefined {
  return (Object.keys(VACCINE_SLUGS) as VaccineKey[]).find((k) => VACCINE_SLUGS[k] === slug);
}

export type VaccineDetailData = {
  about: Localized;
  route: Localized;
  sideEffects: Localized[];
  cautions: Localized[];
};

export const VACCINE_DETAILS: Record<VaccineKey, VaccineDetailData> = {
  BCG: {
    about: L(
      "BCG protects babies from severe forms of tuberculosis (TB), such as TB meningitis. TB mostly spreads through the air from person to person.",
      "BCG টিকা শিশুকে যক্ষ্মার (টিবি) গুরুতর রূপ, যেমন টিবি মেনিনজাইটিস, থেকে রক্ষা করে। যক্ষ্মা সাধারণত বাতাসের মাধ্যমে একজন থেকে আরেকজনে ছড়ায়।",
    ),
    route: L("Injection into the skin of the upper arm", "বাহুর চামড়ার ভেতরে ইনজেকশন"),
    sideEffects: [
      L("A small bump forms, may become a tiny sore, then heals with a small scar in a few weeks. This is normal.", "ছোট একটি ফোলা দাগ হয়, ছোট ঘা হতে পারে, কয়েক সপ্তাহে শুকিয়ে ছোট দাগ থাকে। এটি স্বাভাবিক।"),
      L("Keep the spot clean and dry. Do not apply creams, powder or tight bandages.", "জায়গাটি পরিষ্কার ও শুকনো রাখুন। ক্রিম, পাউডার বা শক্ত ব্যান্ডেজ দেবেন না।"),
      L("Rarely, glands under the arm swell. See a doctor if it grows large or oozes pus.", "কদাচিৎ বগলের গ্রন্থি ফুলে যায়। বেশি ফুলে গেলে বা পুঁজ বের হলে ডাক্তার দেখান।"),
    ],
    cautions: [
      L("BCG is a live vaccine. Tell the vaccinator if the baby has a weak immune system or is very sick.", "BCG একটি জীবিত টিকা। শিশুর রোগ প্রতিরোধ ক্ষমতা কম থাকলে বা খুব অসুস্থ হলে টিকাদানকর্মীকে জানান।"),
    ],
  },
  PENTA: {
    about: L(
      "One injection protects against five diseases: diphtheria, tetanus, whooping cough, hepatitis B and Hib (which causes meningitis and pneumonia). Three doses are needed for full protection.",
      "একটি ইনজেকশনে পাঁচটি রোগ থেকে সুরক্ষা: ডিপথেরিয়া, ধনুষ্টংকার, হুপিং কাশি, হেপাটাইটিস বি এবং হিব (যা মেনিনজাইটিস ও নিউমোনিয়া ঘটায়)। পূর্ণ সুরক্ষার জন্য ৩ ডোজ লাগে।",
    ),
    route: L("Injection, usually in the thigh", "ইনজেকশন, সাধারণত উরুতে"),
    sideEffects: [
      L("Mild fever, fussiness or crying for a day or two.", "১–২ দিন হালকা জ্বর, খিটখিটে ভাব বা কান্না।"),
      L("Pain, redness or a hard lump where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা, লালচে ভাব বা শক্ত ফোলা।"),
      L("Sleepiness or less interest in feeding.", "ঘুম ঘুম ভাব বা খাওয়ায় আগ্রহ কম।"),
    ],
    cautions: [
      L("Tell the vaccinator if the baby had convulsions, collapse or a severe reaction after an earlier dose.", "আগের ডোজের পর শিশুর খিঁচুনি, নেতিয়ে পড়া বা গুরুতর প্রতিক্রিয়া হলে টিকাদানকর্মীকে জানান।"),
    ],
  },
  OPV: {
    about: L(
      "Oral polio vaccine protects against polio, a virus that can cause permanent paralysis. It is given as drops in the mouth.",
      "মুখে খাওয়ার পোলিও টিকা পোলিও থেকে রক্ষা করে, যে ভাইরাস স্থায়ী পক্ষাঘাত ঘটাতে পারে। এটি মুখে ফোঁটা হিসেবে দেওয়া হয়।",
    ),
    route: L("Drops in the mouth", "মুখে ফোঁটা"),
    sideEffects: [
      L("Usually none. Serious side effects are very rare.", "সাধারণত কিছু হয় না। গুরুতর পার্শ্বপ্রতিক্রিয়া খুবই বিরল।"),
    ],
    cautions: [
      L("Tell the vaccinator if the baby has a weak immune system. Mild illness such as a cold is not a reason to skip.", "শিশুর রোগ প্রতিরোধ ক্ষমতা কম থাকলে টিকাদানকর্মীকে জানান। সর্দির মতো হালকা অসুস্থতায় টিকা বাদ দিতে হয় না।"),
    ],
  },
  IPV: {
    about: L(
      "Injectable polio vaccine adds extra protection against polio. fIPV means a fractional (smaller) dose, which some programmes use while still protecting children.",
      "ইনজেকশনের পোলিও টিকা পোলিও থেকে বাড়তি সুরক্ষা দেয়। fIPV মানে ভগ্নাংশ (ছোট) ডোজ, যা কিছু কর্মসূচিতে ব্যবহৃত হয় এবং তবুও শিশুকে সুরক্ষা দেয়।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness or redness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা বা লালচে ভাব।"),
      L("Mild fever for a day.", "একদিন হালকা জ্বর।"),
    ],
    cautions: [
      L("Tell the vaccinator about any severe allergic reaction to a previous dose.", "আগের ডোজে গুরুতর অ্যালার্জি হলে টিকাদানকর্মীকে জানান।"),
    ],
  },
  PCV: {
    about: L(
      "PCV protects against pneumococcal bacteria, a major cause of pneumonia, meningitis and blood infection in young children.",
      "PCV নিউমোকক্কাল ব্যাকটেরিয়া থেকে রক্ষা করে, যা ছোট শিশুদের নিউমোনিয়া, মেনিনজাইটিস ও রক্তের সংক্রমণের প্রধান কারণ।",
    ),
    route: L("Injection, usually in the thigh", "ইনজেকশন, সাধারণত উরুতে"),
    sideEffects: [
      L("Mild fever, irritability or sleepiness.", "হালকা জ্বর, খিটখিটে ভাব বা ঘুম ঘুম ভাব।"),
      L("Soreness or swelling at the injection spot.", "ইনজেকশনের জায়গায় ব্যথা বা ফোলা।"),
      L("Reduced appetite for a day or two.", "১–২ দিন ক্ষুধা কম।"),
    ],
    cautions: [
      L("Tell the vaccinator about any severe allergic reaction to an earlier dose.", "আগের ডোজে গুরুতর অ্যালার্জি হলে টিকাদানকর্মীকে জানান।"),
    ],
  },
  MR: {
    about: L(
      "MR protects against measles (high fever, rash, and can cause pneumonia and brain swelling) and rubella (dangerous for unborn babies if a mother catches it in pregnancy). Two doses give strong protection.",
      "MR হাম (তীব্র জ্বর, র‍্যাশ, এবং নিউমোনিয়া ও মস্তিষ্কের প্রদাহ হতে পারে) এবং রুবেলা (গর্ভাবস্থায় মায়ের হলে অনাগত শিশুর জন্য ক্ষতিকর) থেকে রক্ষা করে। দুই ডোজে শক্তিশালী সুরক্ষা মেলে।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা।"),
      L("Mild fever and a light rash 5 to 12 days later. These pass by themselves.", "৫–১২ দিন পর হালকা জ্বর ও হালকা র‍্যাশ হতে পারে। নিজে নিজেই ঠিক হয়ে যায়।"),
    ],
    cautions: [
      L("MR is a live vaccine. Tell the vaccinator if the child has a weak immune system, a very high fever, or had a severe allergy before. It is not given in pregnancy.", "MR একটি জীবিত টিকা। শিশুর রোগ প্রতিরোধ ক্ষমতা কম থাকলে, অনেক বেশি জ্বর থাকলে বা আগে গুরুতর অ্যালার্জি হলে জানান। গর্ভাবস্থায় এটি দেওয়া হয় না।"),
    ],
  },
  TCV: {
    about: L(
      "The typhoid conjugate vaccine protects against typhoid fever, which spreads through contaminated food and water and causes a long illness with high fever. Clean water and handwashing still matter.",
      "টাইফয়েড কনজুগেট টিকা টাইফয়েড জ্বর থেকে রক্ষা করে, যা দূষিত খাবার ও পানির মাধ্যমে ছড়ায় এবং দীর্ঘস্থায়ী তীব্র জ্বর ঘটায়। পরিষ্কার পানি ও হাত ধোয়া এখনও জরুরি।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness or swelling where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা বা ফোলা।"),
      L("Mild fever or tiredness for a day or two.", "১–২ দিন হালকা জ্বর বা ক্লান্তি।"),
    ],
    cautions: [
      L("Tell the vaccinator about any severe allergic reaction to a previous dose.", "আগের ডোজে গুরুতর অ্যালার্জি হলে টিকাদানকর্মীকে জানান।"),
    ],
  },
  ROTA: {
    about: L(
      "Rotavirus vaccine protects against rotavirus, the most common cause of severe watery diarrhoea and dehydration in babies. It is given as drops and should be started early: the first dose before 15 weeks.",
      "রোটাভাইরাস টিকা রোটাভাইরাস থেকে রক্ষা করে, যা শিশুদের তীব্র পানির মতো ডায়রিয়া ও পানিশূন্যতার সবচেয়ে সাধারণ কারণ। এটি ফোঁটা হিসেবে দেওয়া হয় এবং আগেই শুরু করতে হয়: প্রথম ডোজ ১৫ সপ্তাহের আগে।",
    ),
    route: L("Drops in the mouth", "মুখে ফোঁটা"),
    sideEffects: [
      L("Mild irritability, mild diarrhoea or vomiting for a day or two.", "১–২ দিন হালকা খিটখিটে ভাব, হালকা ডায়রিয়া বা বমি।"),
      L("Very rarely, a bowel blockage (intussusception) in the first week after a dose. Seek care at once for severe vomiting, severe belly pain, or blood in the stool.", "খুব কদাচিৎ ডোজের প্রথম সপ্তাহে অন্ত্রে প্যাঁচ (ইন্টাসাসেপশন) হতে পারে। তীব্র বমি, তীব্র পেটব্যথা বা মলে রক্ত দেখলে সঙ্গে সঙ্গে চিকিৎসা নিন।"),
    ],
    cautions: [
      L("Tell the doctor if the baby had a bowel blockage before or has a serious immune problem.", "শিশুর আগে অন্ত্রে প্যাঁচ হয়ে থাকলে বা গুরুতর রোগ প্রতিরোধ সমস্যা থাকলে ডাক্তারকে জানান।"),
    ],
  },
  HEPA: {
    about: L(
      "Hepatitis A vaccine protects against hepatitis A, a liver infection spread through contaminated food and water. It causes jaundice, tiredness and fever. Usually two doses, about 6 months apart.",
      "হেপাটাইটিস এ টিকা হেপাটাইটিস এ থেকে রক্ষা করে, যা দূষিত খাবার ও পানির মাধ্যমে ছড়ানো লিভারের সংক্রমণ। এতে জন্ডিস, ক্লান্তি ও জ্বর হয়। সাধারণত দুই ডোজ, প্রায় ৬ মাস ব্যবধানে।",
    ),
    route: L("Usually an injection", "সাধারণত ইনজেকশন"),
    sideEffects: [
      L("Soreness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা।"),
      L("Mild fever, headache or less appetite for a day.", "একদিন হালকা জ্বর, মাথাব্যথা বা ক্ষুধা কম।"),
    ],
    cautions: [
      L("Tell the doctor about any severe allergic reaction to a previous dose. Complete both doses for best protection.", "আগের ডোজে গুরুতর অ্যালার্জি হলে ডাক্তারকে জানান। সেরা সুরক্ষার জন্য দুই ডোজই সম্পন্ন করুন।"),
    ],
  },
  VAR: {
    about: L(
      "Varicella vaccine protects against chickenpox, which causes an itchy blister rash and fever and can lead to skin infection, pneumonia, or shingles later. Two doses give the best protection.",
      "ভ্যারিসেলা টিকা জলবসন্ত (চিকেন পক্স) থেকে রক্ষা করে, যাতে চুলকানিযুক্ত ফোসকার র‍্যাশ ও জ্বর হয় এবং পরে ত্বকের সংক্রমণ, নিউমোনিয়া বা শিংলস হতে পারে। দুই ডোজে সবচেয়ে ভালো সুরক্ষা।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness or redness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা বা লালচে ভাব।"),
      L("Mild fever, and in some children a few chickenpox-like spots 1 to 4 weeks later.", "হালকা জ্বর, এবং কিছু শিশুর ১–৪ সপ্তাহ পর কয়েকটি জলবসন্তের মতো দাগ হতে পারে।"),
    ],
    cautions: [
      L("Live vaccine. Tell the doctor if the child has a weak immune system or takes steroids. It is not given in pregnancy.", "জীবিত টিকা। শিশুর রোগ প্রতিরোধ ক্ষমতা কম থাকলে বা স্টেরয়েড চললে ডাক্তারকে জানান। গর্ভাবস্থায় দেওয়া হয় না।"),
    ],
  },
  FLU: {
    about: L(
      "Influenza vaccine protects against seasonal flu, which causes fever, cough and body aches and can lead to pneumonia, especially in young children. The virus changes, so the vaccine is repeated every year.",
      "ইনফ্লুয়েঞ্জা টিকা মৌসুমি ফ্লু থেকে রক্ষা করে, যাতে জ্বর, কাশি ও শরীর ব্যথা হয় এবং বিশেষ করে ছোট শিশুদের নিউমোনিয়া হতে পারে। ভাইরাস বদলায়, তাই প্রতি বছর টিকা নিতে হয়।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা।"),
      L("Mild fever or muscle aches for a day or two.", "১–২ দিন হালকা জ্বর বা মাংসপেশিতে ব্যথা।"),
    ],
    cautions: [
      L("Not for babies under 6 months. Tell the doctor about any severe allergy.", "৬ মাসের কম বয়সী শিশুর জন্য নয়। গুরুতর অ্যালার্জি থাকলে ডাক্তারকে জানান।"),
    ],
  },
  MMR: {
    about: L(
      "MMR protects against measles, mumps (swollen cheeks and glands) and rubella. In Bangladesh the EPI gives MR, so ask your doctor how MMR fits with the doses your child already had.",
      "MMR হাম, মাম্পস (গাল ও গ্রন্থি ফুলে যাওয়া) এবং রুবেলা থেকে রক্ষা করে। বাংলাদেশে ইপিআই MR দেয়, তাই আপনার সন্তান যে ডোজ পেয়েছে তার সাথে MMR কীভাবে মেলাবেন ডাক্তারকে জিজ্ঞেস করুন।",
    ),
    route: L("Injection", "ইনজেকশন"),
    sideEffects: [
      L("Soreness where the injection was given.", "ইনজেকশনের জায়গায় ব্যথা।"),
      L("Fever and a light rash 1 to 2 weeks later. Occasionally mild swelling of the cheeks.", "১–২ সপ্তাহ পর জ্বর ও হালকা র‍্যাশ। মাঝে মাঝে গাল সামান্য ফুলে যায়।"),
    ],
    cautions: [
      L("Live vaccine. Tell the doctor if the child has a weak immune system or a severe allergy. It is not given in pregnancy.", "জীবিত টিকা। শিশুর রোগ প্রতিরোধ ক্ষমতা কম থাকলে বা গুরুতর অ্যালার্জি থাকলে ডাক্তারকে জানান। গর্ভাবস্থায় দেওয়া হয় না।"),
    ],
  },
  HPV: {
    about: L(
      "HPV vaccine protects against human papillomavirus, which causes most cervical cancers and some other cancers. It works best when given before exposure, at 9 to 14 years.",
      "HPV টিকা হিউম্যান প্যাপিলোমাভাইরাস থেকে রক্ষা করে, যা বেশিরভাগ জরায়ুমুখ ক্যান্সার ও আরও কিছু ক্যান্সারের কারণ। ৯–১৪ বছর বয়সে, সংস্পর্শে আসার আগে নিলে সবচেয়ে ভালো কাজ করে।",
    ),
    route: L("Injection in the upper arm", "বাহুতে ইনজেকশন"),
    sideEffects: [
      L("Sore arm, mild fever, headache or tiredness.", "বাহুতে ব্যথা, হালকা জ্বর, মাথাব্যথা বা ক্লান্তি।"),
      L("Some teenagers feel faint, so sit for about 15 minutes after the injection.", "কিছু কিশোর-কিশোরীর মাথা ঘুরতে পারে, তাই ইনজেকশনের পর প্রায় ১৫ মিনিট বসে থাকুন।"),
    ],
    cautions: [
      L("Not given in pregnancy. Tell the doctor about any severe allergic reaction to a previous dose.", "গর্ভাবস্থায় দেওয়া হয় না। আগের ডোজে গুরুতর অ্যালার্জি হলে ডাক্তারকে জানান।"),
    ],
  },
};

export const DETAIL_TEXT = {
  back: L("Back to vaccines", "টিকার তালিকায় ফিরুন"),
  about: L("About this vaccine", "এই টিকা সম্পর্কে"),
  facts: L("Quick facts", "সংক্ষেপে তথ্য"),
  how: L("How it is given", "কীভাবে দেওয়া হয়"),
  sideEffects: L("Possible side effects", "সম্ভাব্য পার্শ্বপ্রতিক্রিয়া"),
  cautions: L("Before vaccination", "টিকা দেওয়ার আগে"),
  urgentTitle: L("Go to a doctor or hospital immediately if", "এসব হলে সঙ্গে সঙ্গে ডাক্তার বা হাসপাতালে যান"),
  urgent: [
    L("Convulsions, or difficulty breathing", "খিঁচুনি বা শ্বাসকষ্ট"),
    L("Swelling of the face or lips, or a widespread rash soon after the injection", "মুখ বা ঠোঁট ফুলে যাওয়া, বা টিকার পরপরই সারা শরীরে র‍্যাশ"),
    L("Very high fever, or fever lasting more than 2 days", "অনেক বেশি জ্বর, বা ২ দিনের বেশি জ্বর"),
    L("Non-stop crying for 3 hours or more, or unusual drowsiness", "৩ ঘণ্টা বা বেশি একটানা কান্না, বা অস্বাভাবিক নেতিয়ে থাকা"),
  ],
  disclaimer: L(
    "This is general information, not medical advice. Always follow your vaccinator's or doctor's guidance.",
    "এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়। সবসময় আপনার টিকাদানকর্মী বা ডাক্তারের নির্দেশনা মানুন।",
  ),
  track: L("Track this vaccine in ImmuniCare", "ImmuniCare-এ এই টিকা ট্র্যাক করুন"),
};