import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Case from "@/lib/models/Case";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await Case.countDocuments({
      submittedAt: { $gte: startOfMonth, $lte: now },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Stats cases-this-month error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

