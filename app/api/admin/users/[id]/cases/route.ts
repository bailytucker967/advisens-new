import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import User from '@/lib/models/User';
import { getAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
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
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cases = await Case.find({ userId: id })
      .sort({ submittedAt: -1 })
      .select('caseId submittedAt status situation areas responses')
      .lean();

    return NextResponse.json({
      user: { id: user._id.toString(), email: user.email },
      cases: cases.map((c: any) => ({
        id: c._id.toString(),
        caseId: c.caseId,
        submittedAt: c.submittedAt,
        status: c.status,
        situation: c.situation?.slice(0, 150) + (c.situation?.length > 150 ? '...' : ''),
        areas: c.areas || [],
        responseCount: (c.responses || []).length,
      })),
    });
  } catch (error: any) {
    console.error('Get user cases error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
