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
    if (!auth || auth.role !== 'advisor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 });
    }

    const body = await request.json();
    const { response } = body;

    const trimmed = typeof response === 'string' ? response.trim() : '';
    if (!trimmed) {
      return NextResponse.json(
        { error: 'Response is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Check if advisor already responded
    const alreadyResponded = (caseDoc.responses || []).some(
      (r: any) => r.advisorId.toString() === auth.userId
    );
    if (alreadyResponded) {
      return NextResponse.json(
        { error: 'You have already responded to this case' },
        { status: 400 }
      );
    }

    const advisor = await Advisor.findById(auth.userId);
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }

caseDoc.responses = caseDoc.responses || [];
caseDoc.responses.push({
  advisorId: advisor._id,
  advisorName: advisor.name,
  advisorFirm: advisor.firm,
  response: trimmed,
  submittedAt: new Date(), // 👈 ADD THIS
  profileRevealed: false,
});


    // Update status if first response
    if (caseDoc.responses.length === 1) {
      caseDoc.status = 'responded';
    }

    await caseDoc.save();

    return NextResponse.json({
      success: true,
      case: {
        id: caseDoc._id.toString(),
        caseId: caseDoc.caseId,
        status: caseDoc.status,
      },
    });
  } catch (error: any) {
    console.error('Submit response error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
