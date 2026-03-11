import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advisor from '@/lib/models/Advisor';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'advisor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const advisor = await Advisor.findById(auth.userId).select('-password').lean();
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    return NextResponse.json({
      advisor: {
        id: advisor._id.toString(),
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
        advisoryApproach: advisor.advisoryApproach,
        feePhilosophy: advisor.feePhilosophy,
        tendsToSuit: advisor.tendsToSuit,
        mayNotSuit: advisor.mayNotSuit,
        professionalBackground: advisor.professionalBackground,
        planningFocusAreas: advisor.planningFocusAreas,
      },
    });
  } catch (error: any) {
    console.error('Get advisor profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

const ALLOWED_PROFILE_KEYS = [
  'name', 'firm', 'bio', 'mobile', 'linkedInUrl', 'location', 'firmWebsite',
  'firmOverview', 'roleTitle', 'primaryClientBase', 'yearsOfExperience',
  'areasOfAdvice', 'typicalClientProfile', 'qualifications', 'jurisdictions',
  'regulatorName', 'licenseNumber', 'hasDisciplinaryActions', 'disciplinaryDetails',
  'advisoryApproach', 'feePhilosophy', 'tendsToSuit', 'mayNotSuit',
  'professionalBackground', 'planningFocusAreas',
];

export async function PATCH(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'advisor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await connectDB();

    const update: Record<string, unknown> = {};
    for (const key of ALLOWED_PROFILE_KEYS) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      const current = await Advisor.findById(auth.userId).select('-password').lean();
      if (!current) {
        return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
      }
      return NextResponse.json({ advisor: { ...current, id: current._id?.toString() } });
    }

    const updated = await Advisor.findByIdAndUpdate(
      auth.userId,
      { $set: update },
      { new: true, runValidators: true }
    )
      .select('-password')
      .lean();

    if (!updated) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    return NextResponse.json({
      advisor: {
        id: updated?._id.toString(),
        email: updated?.email,
        name: updated?.name,
        firm: updated?.firm,
        bio: updated?.bio,
        mobile: updated?.mobile,
        linkedInUrl: updated?.linkedInUrl,
        location: updated?.location,
        firmWebsite: updated?.firmWebsite,
        firmOverview: updated?.firmOverview,
        roleTitle: updated?.roleTitle,
        primaryClientBase: updated?.primaryClientBase,
        yearsOfExperience: updated?.yearsOfExperience,
        areasOfAdvice: updated?.areasOfAdvice,
        typicalClientProfile: updated?.typicalClientProfile,
        qualifications: updated?.qualifications,
        jurisdictions: updated?.jurisdictions,
        regulatorName: updated?.regulatorName,
        licenseNumber: updated?.licenseNumber,
        hasDisciplinaryActions: updated?.hasDisciplinaryActions,
        disciplinaryDetails: updated?.disciplinaryDetails,
        advisoryApproach: updated?.advisoryApproach,
        feePhilosophy: updated?.feePhilosophy,
        tendsToSuit: updated?.tendsToSuit,
        mayNotSuit: updated?.mayNotSuit,
        professionalBackground: updated?.professionalBackground,
        planningFocusAreas: updated?.planningFocusAreas,
      },
    });
  } catch (error: any) {
    console.error('Update advisor profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
