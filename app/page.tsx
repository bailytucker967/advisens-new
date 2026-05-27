import { readFileSync } from "fs";
import { join } from "path";
import PlatformClient from "./PlatformClient";

/**
 * Server Component: reads the prototype HTML at build time and hands the
 * extracted body markup, head content, and script source to a Client
 * Component that mounts it natively (no iframe).
 *
 * Why this pattern:
 *   - Eliminates iframe (Vercel toolbar, dev tools, anchor navigation,
 *     scroll position all behave normally inside the React tree).
 *   - Keeps the prototype as a single HTML file we can iterate on without
 *     rewriting JSX.
 *   - Lets us progressively extract sections to native JSX components when
 *     we want to drop in 21st.dev / v0 / shadcn pieces.
 */
export default function PlatformPage() {
  const html = readFileSync(
    join(process.cwd(), "public/prototype.html"),
    "utf-8",
  );

  // Extract body inner content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const rawBody = bodyMatch ? bodyMatch[1] : "";

  // Extract head content (link/style/preconnect tags)
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const rawHead = headMatch ? headMatch[1] : "";

  // Strip <title>, <meta charset>, and viewport (handled by Next.js layout)
  const cleanedHead = rawHead
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]*charset[^>]*>/gi, "")
    .replace(/<meta[^>]*name=["']viewport[^>]*>/gi, "");

  // Pull all <script> contents out of the body so we can run them after mount
  const scriptMatches = [...rawBody.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  const scriptSource = scriptMatches.map((m) => m[1]).join("\n\n");

  // Body markup without <script> tags
  const bodyWithoutScripts = rawBody.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  return (
    <PlatformClient
      headContent={cleanedHead}
      bodyContent={bodyWithoutScripts}
      scriptSource={scriptSource}
    />
  );
}
