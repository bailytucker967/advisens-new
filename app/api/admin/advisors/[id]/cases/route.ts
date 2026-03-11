import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import Advisor from '@/lib/models/Advisor';
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
      return NextResponse.json({ error: 'Invalid advisor ID' }, { status: 400 });
    }

    await connectDB();

    const advisor = await Advisor.findById(id).select('-password').lean();
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

    const cases = await Case.find({ 'responses.advisorId': id })
      .sort({ submittedAt: -1 })
      .select('caseId submittedAt status situation areas responses')
      .lean();

    const casesWithMyResponse = cases
      .filter((c: any) => (c.responses || []).some((r: any) => r.advisorId.toString() === id))
      .map((c: any) => {
        const myResp = (c.responses || []).find((r: any) => r.advisorId.toString() === id);
        return {
          id: c._id.toString(),
          caseId: c.caseId,
          submittedAt: c.submittedAt,
          status: c.status,
          situation: c.situation?.slice(0, 150) + (c.situation?.length > 150 ? '...' : ''),
          areas: c.areas || [],
          respondedAt: myResp?.submittedAt,
        };
      });

    return NextResponse.json({
      advisor: { id: advisor._id.toString(), email: advisor.email, name: advisor.name, firm: advisor.firm },
      cases: casesWithMyResponse,
    });
  } catch (error: any) {
    console.error('Get advisor cases error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
