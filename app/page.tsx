import { AboutSection } from "@/components/home/about-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeedbackSection } from "@/components/home/feedback-section";
import { Hero } from "@/components/home/hero";
import { HowSection } from "@/components/home/how-section";
import { ScheduleSection } from "@/components/home/schedule-section";
import { WhySection } from "@/components/home/why-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <ScheduleSection />
      <WhySection />
      <HowSection />
      <FeedbackSection />
      <AboutSection />
    </>
  );
}