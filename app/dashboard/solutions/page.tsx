import { PageHeader } from "../_components/PageHeader";
import { SOLUTION_SECTIONS } from "@/lib/solutions-catalog";
import { SolutionsBrowser } from "./SolutionsBrowser";

export const metadata = { title: "Solutions · TWI Report Generator" };

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Titan solutions library"
        description="Every Titan solution, with its exact master-deck slides — the governed template every adviser builds from. Search a provider, topic or country, or tap a category to jump straight there."
      />
      <SolutionsBrowser sections={SOLUTION_SECTIONS} />
    </>
  );
}
