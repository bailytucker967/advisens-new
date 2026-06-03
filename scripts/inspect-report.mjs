// Print a report's latest-version slide headings, to confirm the MPS appendix
// splice point. Usage: node scripts/inspect-report.mjs [reportId]
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key);

const reportId = process.argv[2] || "b077c0e8-5b28-487c-af77-b065e41be46b";

const { data: report } = await supabase
  .from("reports")
  .select("id, title, status, current_version_id")
  .eq("id", reportId)
  .maybeSingle();
console.log("REPORT:", report?.title, "| status:", report?.status, "| id:", report?.id);

const { data: versions } = await supabase
  .from("report_versions")
  .select("id, version_number, content_markdown")
  .eq("report_id", reportId)
  .order("version_number", { ascending: false });

if (!versions || versions.length === 0) {
  console.log("No versions found.");
  process.exit(0);
}
const v = versions.find((x) => x.id === report?.current_version_id) || versions[0];
console.log(`Versions: ${versions.length}. Showing v${v.version_number} (${v.content_markdown.length} chars)\n`);

const headings = v.content_markdown
  .split("\n")
  .filter((l) => /^##\s+/.test(l))
  .map((l, i) => `  ${i + 1}. ${l.replace(/^##\s+/, "")}`);
console.log(`## slide headings (${headings.length}):`);
console.log(headings.join("\n"));

const closeRe = /^##\s+.*\b(client servicing|ongoing service|servicing|next steps|sign[\s-]?off|in summary|conclusion)\b/i;
const closeLine = v.content_markdown.split("\n").find((l) => closeRe.test(l));
console.log("\nSplice point (first close heading matched):", closeLine || "NONE — appendix would NOT splice");
