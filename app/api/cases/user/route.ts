import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    
    if (!auth || auth.role !== 'user') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const cases = await Case.find({ userId: auth.userId })
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error('Get user cases error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

