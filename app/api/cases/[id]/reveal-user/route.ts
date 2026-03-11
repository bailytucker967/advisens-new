import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Case from '@/lib/models/Case';
import User from '@/lib/models/User';
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

    await connectDB();

    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Check if advisor already revealed user
    const userRevealedTo = caseDoc.userRevealedTo || [];
    const alreadyRevealed = userRevealedTo.some(
      (u: any) => u.advisorId.toString() === auth.userId
    );

    if (alreadyRevealed) {
      const user = await User.findById(caseDoc.userId).lean();
      return NextResponse.json({
        success: true,
        user: { email: user?.email },
      });
    }

    // Add advisor to userRevealedTo
    caseDoc.userRevealedTo = userRevealedTo;
    caseDoc.userRevealedTo.push({
      advisorId: new mongoose.Types.ObjectId(auth.userId),
      revealedAt: new Date(),
    });
    await caseDoc.save();

    const user = await User.findById(caseDoc.userId).lean();

    return NextResponse.json({
      success: true,
      user: { email: user?.email },
    });
  } catch (error: any) {
    console.error('Reveal user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
