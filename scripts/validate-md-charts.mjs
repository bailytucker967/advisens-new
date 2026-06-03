// Validate every ```advisens-* chart block in a markdown file parses as JSON.
// Usage: node scripts/validate-md-charts.mjs <file.md>
import { readFile } from "node:fs/promises";
const path = process.argv[2];
const src = await readFile(path, "utf8");
const re = /```advisens-(\w+)\s*\n([\s\S]*?)```/g;
let m, ok = 0, bad = 0;
while ((m = re.exec(src)) !== null) {
  try {
    JSON.parse(m[2]);
    ok++;
    console.log(`OK   advisens-${m[1]}`);
  } catch (e) {
    bad++;
    console.log(`FAIL advisens-${m[1]}: ${e.message}\n---\n${m[2].slice(0, 240)}\n---`);
  }
}
console.log(`\n${ok} valid, ${bad} invalid`);
process.exit(bad ? 1 : 0);
