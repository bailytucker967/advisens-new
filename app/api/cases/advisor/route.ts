import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    
    if (!auth || auth.role !== 'advisor') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all cases (advisors can see all submitted cases)
    // In a real app, you might want to filter by areas of expertise
    const cases = await Case.find({ status: { $in: ['submitted', 'responded'] } })
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('Get advisor cases error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

