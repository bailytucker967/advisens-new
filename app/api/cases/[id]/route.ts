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
    if (!auth || (auth.role !== 'user' && auth.role !== 'advisor' && auth.role !== 'admin')) {
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

    // User: only their own cases (admin can view any)
    if (auth.role === 'user') {
      if (caseDoc.userId.toString() !== auth.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Populate responses - hide advisor name/firm until profileRevealed (for user)
    const responsesWithDetails = await Promise.all(
      (caseDoc.responses || []).map(async (r: any) => {
        const advisor = await Advisor.findById(r.advisorId).select('-password').lean();
        const isUser = auth.role === 'user';
        const isAdmin = auth.role === 'admin';
        // User: hide advisor name until profile revealed. Admin: always show.
        const showAdvisorInfo = isAdmin || !isUser || r.profileRevealed;
        const base: Record<string, unknown> = {
          _id: r._id,
          advisorId: r.advisorId.toString(),
          advisorName: showAdvisorInfo ? (r.advisorName || advisor?.name) : undefined,
          advisorFirm: showAdvisorInfo ? (r.advisorFirm || advisor?.firm) : undefined,
          advisorEmail: (showAdvisorInfo && advisor) ? advisor.email : undefined,
          response: r.response,
          responseSections: r.responseSections || undefined,
          submittedAt: r.submittedAt,
          profileRevealed: r.profileRevealed,
          profileRevealedAt: r.profileRevealedAt,
        };
        // Include full advisor profile when revealed (for user) or always for admin
        if ((isUser && r.profileRevealed && advisor) || (isAdmin && advisor)) {
          base.advisorProfile = {
            email: advisor.email,
            name: advisor.name,
            firm: advisor.firm,
            bio: advisor.bio,
            mobile: advisor.mobile,
            linkedInUrl: advisor.linkedInUrl,
            location: advisor.location,
            firmWebsite: advisor.firmWebsite,
            firmOverview: advisor.firmOverview,
            roleTitle: advisor.roleTitle,
            primaryClientBase: advisor.primaryClientBase,
            yearsOfExperience: advisor.yearsOfExperience,
            areasOfAdvice: advisor.areasOfAdvice,
            typicalClientProfile: advisor.typicalClientProfile,
            qualifications: advisor.qualifications,
            jurisdictions: advisor.jurisdictions,
            regulatorName: advisor.regulatorName,
            licenseNumber: advisor.licenseNumber,
            hasDisciplinaryActions: advisor.hasDisciplinaryActions,
            disciplinaryDetails: advisor.disciplinaryDetails,
          };
        }
        return base;
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
    if (auth.role === 'advisor' || auth.role === 'admin') {
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
