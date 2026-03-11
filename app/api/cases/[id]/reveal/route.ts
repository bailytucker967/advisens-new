import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import Advisor from '@/lib/models/Advisor';
import { getAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 });
    }

    const body = await request.json();
    const { advisorId } = body;

    if (!advisorId || !mongoose.Types.ObjectId.isValid(advisorId)) {
      return NextResponse.json({ error: 'Invalid advisor ID' }, { status: 400 });
    }

    await connectDB();

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (caseDoc.userId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const responseIndex = (caseDoc.responses || []).findIndex(
      (r: any) => r.advisorId.toString() === advisorId
    );
    if (responseIndex === -1) {
      return NextResponse.json(
        { error: 'Advisor has not responded to this case' },
        { status: 400 }
      );
    }

    const responseEntry = caseDoc.responses[responseIndex];
    if (responseEntry.profileRevealed) {
      return NextResponse.json({
        success: true,
        message: 'Profile already revealed',
        advisor: {
          email: (await Advisor.findById(advisorId).lean())?.email,
          name: responseEntry.advisorName,
          firm: responseEntry.advisorFirm,
        },
      });
    }

    responseEntry.profileRevealed = true;
    responseEntry.profileRevealedAt = new Date();
    caseDoc.status = 'profile_revealed';
    await caseDoc.save();

    const advisor = await Advisor.findById(advisorId).select('-password').lean();

    // Return full advisor profile for trust and due diligence
    return NextResponse.json({
      success: true,
      advisor: {
        email: advisor?.email,
        name: advisor?.name ?? responseEntry.advisorName,
        firm: advisor?.firm ?? responseEntry.advisorFirm,
        bio: advisor?.bio,
        mobile: advisor?.mobile,
        linkedInUrl: advisor?.linkedInUrl,
        location: advisor?.location,
        firmWebsite: advisor?.firmWebsite,
        firmOverview: advisor?.firmOverview,
        roleTitle: advisor?.roleTitle,
        primaryClientBase: advisor?.primaryClientBase,
        yearsOfExperience: advisor?.yearsOfExperience,
        areasOfAdvice: advisor?.areasOfAdvice,
        typicalClientProfile: advisor?.typicalClientProfile,
        qualifications: advisor?.qualifications,
        jurisdictions: advisor?.jurisdictions,
        regulatorName: advisor?.regulatorName,
        licenseNumber: advisor?.licenseNumber,
        hasDisciplinaryActions: advisor?.hasDisciplinaryActions,
        disciplinaryDetails: advisor?.disciplinaryDetails,
      },
    });
  } catch (error: any) {
    console.error('Reveal profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
