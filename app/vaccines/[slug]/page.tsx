import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VaccineDetail } from "@/components/vaccines/vaccine-detail";
import { VACCINE_SLUGS, findVaccineBySlug } from "@/lib/content/vaccine-details";
import { VACCINES } from "@/lib/content/vaccine-info";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.values(VACCINE_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = findVaccineBySlug(slug);
  return { title: key ? `${VACCINES[key].name} vaccine` : "Vaccine" };
}

export default async function VaccinePage({ params }: Props) {
  const { slug } = await params;
  const key = findVaccineBySlug(slug);
  if (!key) notFound();
  return <VaccineDetail vaccineKey={key} />;
}