import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advisor from '@/lib/models/Advisor';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, name, firm, bio } = body;

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

    // Check if advisor already exists
    const existingAdvisor = await Advisor.findOne({ email: email.toLowerCase() });
    if (existingAdvisor) {
      return NextResponse.json(
        { error: 'Advisor with this email already exists' },
        { status: 409 }
      );
    }

    // Create new advisor
    const advisor = new Advisor({
      email: email.toLowerCase(),
      password,
      role: 'advisor',
      name,
      firm,
      bio,
    });

    await advisor.save();

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
      { status: 201 }
    );

    // Set token in cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Advisor signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

