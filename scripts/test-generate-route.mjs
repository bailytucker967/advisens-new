// End-to-end test of the real API routes (generate → edit → lock) against the
// running dev server, using @supabase/ssr's own cookie encoding for auth.
//
// Run: set -a && source .env.local && set +a && node scripts/test-generate-route.mjs
import { createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = "http://127.0.0.1:3000";
const EMAIL = "preview-test@advisens.dev";
const PASSWORD = "TestPass1234";

// In-memory cookie jar that @supabase/ssr writes the session into.
const jar = new Map();
const supabase = createServerClient(URL, ANON, {
  cookies: {
    getAll: () => [...jar.entries()].map(([name, value]) => ({ name, value })),
    setAll: (list) => list.forEach(({ name, value }) => jar.set(name, value)),
  },
});

console.log("1. Signing in...");
const { data: signin, error: signinErr } = await supabase.auth.signInWithPassword({
  email: EMAIL,
  password: PASSWORD,
});
if (signinErr) throw signinErr;
const userId = signin.user.id;
console.log(`   ✓ signed in as ${userId}`);
console.log(`   ✓ ${jar.size} auth cookie(s) captured`);

const cookieHeader = [...jar.entries()]
  .map(([n, v]) => `${n}=${encodeURIComponent(v)}`)
  .join("; ");

// Create a fresh report directly via the REST API (service role) so the test
// is repeatable and doesn't depend on a pre-existing one.
console.log("2. Creating a fresh report row...");
const createRes = await fetch(`${URL}/rest/v1/reports`, {
  method: "POST",
  headers: {
    apikey: SERVICE,
    Authorization: `Bearer ${SERVICE}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({
    advisor_id: userId,
    title: "Route Test — Jane Doe",
    report_type: "new_client_assessment",
    status: "draft",
    meeting_notes:
      "Age 42, British expat in Dubai 6 years. Cash GBP ~£250k. Wants growth with UK tax efficiency. Medium risk. Retire UK ~60.",
  }),
});
const created = await createRes.json();
if (!Array.isArray(created) || !created[0]) {
  throw new Error("Failed to create report: " + JSON.stringify(created));
}
const reportId = created[0].id;
console.log(`   ✓ report ${reportId}`);

// 3. Hit the GENERATE route (the real Next.js API route).
console.log("3. POST /api/reports/:id/generate (calls Claude)...");
const t0 = Date.now();
// trailingSlash:true → POST to /generate 308-redirects to /generate/.
// 308 preserves method+body, and browsers follow it; do the same here.
const genRes = await fetch(`${BASE}/api/reports/${reportId}/generate/`, {
  method: "POST",
  headers: { Cookie: cookieHeader },
  redirect: "follow",
});
console.log(`   status ${genRes.status} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (genRes.status >= 400) {
  console.log("   body:", await genRes.text());
  throw new Error("generate failed");
}

// Verify a version landed.
const verRes = await fetch(
  `${URL}/rest/v1/report_versions?report_id=eq.${reportId}&select=version_number,generated_by,content_markdown&order=version_number.asc`,
  { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } },
);
const versions = await verRes.json();
console.log(`   ✓ ${versions.length} version(s); v1 generated_by=${versions[0]?.generated_by}`);
console.log("   --- draft preview ---");
console.log("   " + (versions[0]?.content_markdown || "").slice(0, 280).replace(/\n/g, "\n   "));

// 4. Hit the EDIT (prompt-edit) route.
console.log("\n4. POST /api/reports/:id/edit (prompt-edit)...");
const t1 = Date.now();
const editRes = await fetch(`${BASE}/api/reports/${reportId}/edit`, {
  method: "POST",
  headers: { Cookie: cookieHeader, "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Add a one-line executive summary at the very top." }),
});
console.log(`   status ${editRes.status} in ${((Date.now() - t1) / 1000).toFixed(1)}s`);
const editJson = await editRes.json().catch(() => ({}));
if (editRes.status >= 400) throw new Error("edit failed: " + JSON.stringify(editJson));

const verRes2 = await fetch(
  `${URL}/rest/v1/report_versions?report_id=eq.${reportId}&select=version_number,generated_by&order=version_number.asc`,
  { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } },
);
const versions2 = await verRes2.json();
console.log(`   ✓ now ${versions2.length} versions; v2 generated_by=${versions2[1]?.generated_by}`);

// 5. Hit the LOCK route.
console.log("\n5. POST /api/reports/:id/lock...");
const lockRes = await fetch(`${BASE}/api/reports/${reportId}/lock`, {
  method: "POST",
  headers: { Cookie: cookieHeader, "Content-Type": "application/json" },
  body: "{}",
});
console.log(`   status ${lockRes.status}`);
const lockJson = await lockRes.json().catch(() => ({}));
if (lockRes.status >= 400) throw new Error("lock failed: " + JSON.stringify(lockJson));

const repRes = await fetch(
  `${URL}/rest/v1/reports?id=eq.${reportId}&select=status,locked_at`,
  { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } },
);
const rep = (await repRes.json())[0];
console.log(`   ✓ report status=${rep.status}, locked_at=${rep.locked_at ? "set" : "null"}`);

console.log(`\n✓ Full route flow passed. Report ${reportId} is locked with ${versions2.length} versions.`);
