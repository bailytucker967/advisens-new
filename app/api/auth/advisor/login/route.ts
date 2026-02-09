import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advisor from '@/lib/models/Advisor';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find advisor and include password for comparison
    const advisor = await Advisor.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!advisor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await advisor.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: advisor._id.toString(),
      role: 'advisor',
      email: advisor.email,
    });

    const response = NextResponse.json(
      {
        success: true,
        advisor: {
          id: advisor._id.toString(),
          email: advisor.email,
          role: advisor.role,
          name: advisor.name,
          firm: advisor.firm,
        },
      },
      { status: 200 }
    );

    // Set token in cookie (path: '/' ensures it's sent with all requests)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Advisor login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

