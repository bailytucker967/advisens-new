import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReport, generateIntroPitch, suggestProducts } from "@/lib/claude";

export const maxDuration = 120;

// One route, two modes:
//   kind: "intro"      -> Introduction agent (Agent 1), pre-meeting pitch
//   kind: "assessment" -> Assessment agent (Agent 2), full report from notes
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || !["intro", "assessment", "suggest"].includes(body.kind)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  try {
    if (body.kind === "suggest") {
      const productIds = await suggestProducts({
        notes: body.notes ?? null,
        transcript: body.transcript ?? null,
        angle: body.products ?? null,
      });
      return NextResponse.json({ productIds });
    }

    if (body.kind === "intro") {
      const result = await generateIntroPitch({
        profile,
        prospect: {
          name: body.name ?? null,
          location: body.location ?? null,
          situation: body.situation ?? null,
          context: body.context ?? null,
        },
        pieces: Array.isArray(body.pieces) ? body.pieces : undefined,
      });
      return NextResponse.json({ markdown: result.content });
    }

    const result = await generateReport({
      profile,
      template: null,
      inputs: {
        title: body.name ? `Assessment — ${body.name}` : "Client assessment",
        report_type: "new_client_assessment",
        client_name: body.name ?? null,
        meeting_notes: body.notes ?? null,
        transcript: body.transcript ?? null,
        notetaker_url: null,
        additional_notes: [
          "Produce a FULL Titan report as a sequence of slides — each top-level ## heading is one slide. In order: '## Assessment Report' (cover with the client's name and a short executive summary), '## Asset Overview' (assets, liabilities, income and expenditure, led by an advisens-callouts row of headline figures), '## Exposures' (tax, currency and IHT exposure, with an advisens-bars or advisens-growth chart). Then ONE ## slide for EACH recommended product or structure, naming it and showing why it fits with the relevant numbers. Then '## Model Portfolio Service' (with an advisens-donut allocation), '## Client Servicing' (direct line to the adviser, quarterly call, annual meeting, wealth tracking, fee 0.25% per quarter), and a brief '## Next Steps' sign-off. Use the advisens-callouts / advisens-calc / advisens-growth / advisens-donut / advisens-bars blocks wherever figures support them. Write a thorough report, not a summary.",
          body.location ? `Location / residency: ${body.location}` : "",
          body.situation ? `Situation: ${body.situation}` : "",
          body.context ? `Context: ${body.context}` : "",
          body.products
            ? `Products and approach the adviser is taking the client down: ${body.products}`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
        attachment_text: null,
      },
    });
    return NextResponse.json({ markdown: result.content });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "generation failed" },
      { status: 500 },
    );
  }
}
