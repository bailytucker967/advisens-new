import { createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = "http://127.0.0.1:3000";

const jar = new Map();
const supabase = createServerClient(URL, ANON, {
  cookies: {
    getAll: () => [...jar.entries()].map(([name, value]) => ({ name, value })),
    setAll: (list) => list.forEach(({ name, value }) => jar.set(name, value)),
  },
});
await supabase.auth.signInWithPassword({
  email: "preview-test@advisens.dev",
  password: "TestPass1234",
});
const cookie = [...jar.entries()].map(([n, v]) => `${n}=${encodeURIComponent(v)}`).join("; ");

// Find a report that has at least one version.
const r = await fetch(
  `${URL}/rest/v1/reports?select=id,title,current_version_id&current_version_id=not.is.null&order=created_at.desc&limit=1`,
  { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } },
);
const reports = await r.json();
if (!reports[0]) { console.log("No report with a version found."); process.exit(0); }
const { id, title } = reports[0];
console.log(`Fetching report page: ${title} (${id})`);

const page = await fetch(`${BASE}/dashboard/reports/${id}/`, { headers: { Cookie: cookie } });
const html = await page.text();
console.log("status:", page.status);
console.log("white document container present:", html.includes("bg-white text-slate-800"));
console.log("rendered <h1> heading present:", /<h1[^>]*>/.test(html));
console.log("rendered <table> present:", /<table/.test(html));
console.log("OLD dark-card class gone:", !html.includes("whitespace-pre-wrap"));
