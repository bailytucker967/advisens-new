import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advisor from '@/lib/models/Advisor';
import Case from '@/lib/models/Case';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const advisors = await Advisor.find({}).sort({ createdAt: -1 }).select('-password').lean();

    const advisorIds = advisors.map((a) => a._id);

    const casesRespondedCounts = await Case.aggregate([
      { $unwind: '$responses' },
      { $match: { 'responses.advisorId': { $in: advisorIds } } },
      { $group: { _id: '$responses.advisorId', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      casesRespondedCounts.map((r) => [r._id.toString(), r.count])
    );

    return NextResponse.json({
      advisors: advisors.map((a) => ({
        id: a._id.toString(),
        email: a.email,
        name: a.name,
        firm: a.firm,
        role: a.role,
        createdAt: a.createdAt,
        casesResponded: countMap.get(a._id.toString()) ?? 0,
      })),
    });
  } catch (error: any) {
    console.error('Get advisors error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, password, name, firm } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Advisor.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Advisor with this email already exists' },
        { status: 400 }
      );
    }

    const advisor = new Advisor({
      email: email.toLowerCase(),
      password,
      role: 'advisor',
      name: name || '',
      firm: firm || '',
    });
    await advisor.save();

    return NextResponse.json({
      success: true,
      advisor: {
        id: advisor._id.toString(),
        email: advisor.email,
        name: advisor.name,
        firm: advisor.firm,
        role: advisor.role,
      },
    });
  } catch (error: any) {
    console.error('Add advisor error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
