import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AdvisorApplication from '@/lib/models/AdvisorApplication';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const applications = await AdvisorApplication.find({})
      .sort({ createdAt: -1 })
      .select('-password') // Never return password
      .lean();

    return NextResponse.json({
      applications: applications.map((a: any) => ({
        id: a._id.toString(),
        firstName: a.firstName,
        lastName: a.lastName,
        professionalEmail: a.professionalEmail,
        firmName: a.firmName,
        roleTitle: a.roleTitle,
        status: a.status,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
