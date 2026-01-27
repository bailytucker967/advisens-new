import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdvisorApplication from '@/lib/models/AdvisorApplication';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Create new application
    const application = new AdvisorApplication({
      firstName: body.firstName,
      lastName: body.lastName,
      professionalEmail: body.professionalEmail.toLowerCase(),
      mobile: body.mobile,
      linkedInUrl: body.linkedInUrl,
      location: {
        country: body.locationCountry,
        city: body.locationCity,
      },
      primaryClientBase: body.primaryClientBase,
      firmName: body.firmName,
      firmWebsite: body.firmWebsite,
      roleTitle: body.roleTitle,
      employmentType: body.employmentType,
      firmType: body.firmType,
      firmLocation: body.firmLocation,
      firmOverview: body.firmOverview,
      isRegulated: body.isRegulated,
      regulatorName: body.regulatorName,
      licenseNumber: body.licenseNumber,
      jurisdictions: body.jurisdictions || [],
      hasDisciplinaryActions: body.hasDisciplinaryActions,
      disciplinaryDetails: body.disciplinaryDetails,
      yearsOfExperience: body.yearsOfExperience,
      areasOfAdvice: body.areasOfAdvice || [],
      typicalClientProfile: body.typicalClientProfile,
      qualifications: body.qualifications,
      acknowledgesNoCommissions: body.acknowledgesNoCommissions,
      acknowledgesNoContact: body.acknowledgesNoContact,
      acknowledgesHonestResponse: body.acknowledgesHonestResponse,
      acknowledgesConfidentiality: body.acknowledgesConfidentiality,
      acknowledgesSelective: body.acknowledgesSelective,
      whyJoinAdvisens: body.whyJoinAdvisens,
      ethicalAdviceMeaning: body.ethicalAdviceMeaning,
      status: 'pending',
    });

    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Advisor application error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

