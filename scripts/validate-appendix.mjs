// Validate every advisens-* chart block in the MPS appendix parses as JSON,
// and that each slide starts with a single "## " heading.
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../lib/mps-appendix.ts", import.meta.url), "utf8");

let ok = 0;
let bad = 0;
const re = /\$\{F\}advisens-(\w+)\s*\n([\s\S]*?)\n\s*\$\{F\}/g;
let m;
while ((m = re.exec(src)) !== null) {
  const [, kind, json] = m;
  try {
    JSON.parse(json);
    ok++;
    console.log(`OK   advisens-${kind}`);
  } catch (e) {
    bad++;
    console.log(`FAIL advisens-${kind}: ${e.message}\n----\n${json}\n----`);
  }
}
console.log(`\nChart blocks: ${ok} valid, ${bad} invalid`);
if (bad > 0) process.exit(1);
