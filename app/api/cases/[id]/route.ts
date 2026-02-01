import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import Advisor from '@/lib/models/Advisor';
import User from '@/lib/models/User';
import { getAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || (auth.role !== 'user' && auth.role !== 'advisor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 });
    }

    await connectDB();

    const caseDoc = await Case.findById(id).lean();
    if (!caseDoc) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // User: only their own cases
    if (auth.role === 'user') {
      if (caseDoc.userId.toString() !== auth.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Populate responses - hide advisor name/firm until profileRevealed (for user)
    const responsesWithDetails = await Promise.all(
      (caseDoc.responses || []).map(async (r: any) => {
        const advisor = await Advisor.findById(r.advisorId).lean();
        const isUser = auth.role === 'user';
        // User: hide advisor name until profile revealed
        const showAdvisorInfo = !isUser || r.profileRevealed;
        return {
          _id: r._id,
          advisorId: r.advisorId.toString(),
          advisorName: showAdvisorInfo ? (r.advisorName || advisor?.name) : undefined,
          advisorFirm: showAdvisorInfo ? (r.advisorFirm || advisor?.firm) : undefined,
          advisorEmail: r.profileRevealed && advisor ? advisor.email : undefined,
          response: r.response,
          submittedAt: r.submittedAt,
          profileRevealed: r.profileRevealed,
          profileRevealedAt: r.profileRevealedAt,
        };
      })
    );

    // Advisor: get user email only if this advisor has revealed user
    let userEmail: string | undefined;
    if (auth.role === 'advisor') {
      const userRevealedTo = (caseDoc as any).userRevealedTo || [];
      const hasRevealed = userRevealedTo.some((u: any) => u.advisorId.toString() === auth.userId);
      if (hasRevealed && caseDoc.userId) {
        const user = await User.findById(caseDoc.userId).lean();
        userEmail = user?.email;
      }
    }

    const responseCase: Record<string, unknown> = {
      ...caseDoc,
      userId: caseDoc.userId?.toString(),
      responses: responsesWithDetails,
    };
    if (auth.role === 'advisor') {
      responseCase.userEmail = userEmail;
      responseCase.userRevealed = userEmail != null;
    }
    if (auth.role === 'user') {
      responseCase.userRevealedTo = (caseDoc as any).userRevealedTo || [];
    }

    return NextResponse.json({ case: responseCase });
  } catch (error: any) {
    console.error('Get case error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
