import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Advisor from '@/lib/models/Advisor';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    if (auth.role === 'user') {
      const user = await User.findById(auth.userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      });
    } else if (auth.role === 'advisor') {
      const advisor = await Advisor.findById(auth.userId);
      if (!advisor) {
        return NextResponse.json(
          { error: 'Advisor not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        advisor: {
          id: advisor._id.toString(),
          email: advisor.email,
          role: advisor.role,
          name: advisor.name,
          firm: advisor.firm,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

