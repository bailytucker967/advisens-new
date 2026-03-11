import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdvisorApplication from '@/lib/models/AdvisorApplication';
import Advisor from '@/lib/models/Advisor';
import { getAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 });
    }

    await connectDB();

    const application = await AdvisorApplication.findById(id).select('+password');
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status === 'approved') {
      return NextResponse.json(
        { error: 'Application already approved. Advisor may already exist.' },
        { status: 400 }
      );
    }

    if (application.status === 'rejected') {
      return NextResponse.json(
        { error: 'Application was rejected' },
        { status: 400 }
      );
    }

    // Check if advisor already exists with this email
    const existingAdvisor = await Advisor.findOne({ email: application.professionalEmail.toLowerCase() });
    if (existingAdvisor) {
      application.status = 'approved';
      application.reviewedAt = new Date();
      application.reviewedBy = auth.userId;
      await application.save();
      return NextResponse.json({
        success: true,
        message: 'Advisor already exists with this email. Application marked as approved.',
      });
    }

    if (!application.password || application.password.length < 6) {
      return NextResponse.json(
        { error: 'Application has no valid password. Cannot create advisor login.' },
        { status: 400 }
      );
    }

    // Create advisor with full profile from application
    const advisor = new Advisor({
      email: application.professionalEmail.toLowerCase(),
      password: application.password,
      role: 'advisor',
      name: `${application.firstName} ${application.lastName}`.trim(),
      firm: application.firmName,
      mobile: application.mobile,
      linkedInUrl: application.linkedInUrl,
      location: application.location ? { country: application.location.country, city: application.location.city } : undefined,
      firmWebsite: application.firmWebsite,
      firmOverview: application.firmOverview,
      roleTitle: application.roleTitle,
      primaryClientBase: application.primaryClientBase,
      yearsOfExperience: application.yearsOfExperience,
      areasOfAdvice: application.areasOfAdvice || [],
      typicalClientProfile: application.typicalClientProfile,
      qualifications: application.qualifications,
      jurisdictions: application.jurisdictions || [],
      regulatorName: application.regulatorName,
      licenseNumber: application.licenseNumber,
      hasDisciplinaryActions: application.hasDisciplinaryActions,
      disciplinaryDetails: application.disciplinaryDetails,
    });
    await advisor.save();

    // Update application status and clear password (skip validation since we're intentionally removing password)
    await AdvisorApplication.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'approved',
          reviewedAt: new Date(),
          reviewedBy: auth.userId,
        },
        $unset: { password: 1 },
      },
      { runValidators: false }
    );

    return NextResponse.json({
      success: true,
      advisor: {
        id: advisor._id.toString(),
        email: advisor.email,
        name: advisor.name,
        firm: advisor.firm,
      },
    });
  } catch (error: any) {
    console.error('Approve application error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
