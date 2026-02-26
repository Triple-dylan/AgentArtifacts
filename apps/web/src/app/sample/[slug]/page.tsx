import { redirect } from "next/navigation";
import { loadCatalog } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return loadCatalog()
    .filter((r) => r.lead_magnet === "Y")
    .map((r) => ({ slug: r.slug }));
}

export default async function SamplePage({ params }: Props) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
