// Dump Jane Doe's report inputs + client record + current v1 markdown, so a
// regeneration stays consistent with her existing persona.
import { createClient } from "@supabase/supabase-js";
import { writeFile } from "node:fs/promises";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const reportId = process.argv[2] || "b077c0e8-5b28-487c-af77-b065e41be46b";

const { data: report } = await supabase
  .from("reports")
  .select("*, clients(*)")
  .eq("id", reportId)
  .maybeSingle();

const r = { ...report };
const client = r.clients;
delete r.clients;

console.log("=== REPORT ROW ===");
for (const [k, v] of Object.entries(r)) {
  if (typeof v === "string" && v.length > 400) console.log(`${k}: [${v.length} chars]`);
  else console.log(`${k}:`, v);
}
console.log("\n=== CLIENT ROW ===");
console.log(client);

console.log("\n=== meeting_notes ===\n" + (r.meeting_notes || "(none)"));
console.log("\n=== additional_notes ===\n" + (r.additional_notes || "(none)"));
console.log("\n=== transcript ===\n" + (r.transcript ? `[${r.transcript.length} chars]` : "(none)"));

const { data: versions } = await supabase
  .from("report_versions")
  .select("id, version_number, content_markdown")
  .eq("report_id", reportId)
  .order("version_number", { ascending: false });
if (versions?.length) {
  await writeFile("/tmp/jane_v1.md", versions[versions.length - 1].content_markdown);
  console.log(`\n=== wrote /tmp/jane_v1.md (${versions[versions.length - 1].content_markdown.length} chars, v${versions[versions.length - 1].version_number}) ===`);
  console.log("Versions present:", versions.map((v) => v.version_number).join(", "));
}
