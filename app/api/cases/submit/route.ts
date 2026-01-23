import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Case from '@/lib/models/Case';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      email,
      password,
      basedIn,
      timeHorizon,
      hadAdviceBefore,
      perspectives,
      situation,
      unclear,
      lookingFor,
      areas,
      consentNotAdvice,
      consentShareAnonymously,
    } = body;

    // Validate required fields
    if (!email || !password || !situation || !consentNotAdvice || !consentShareAnonymously) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists, if not create one
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        password,
        role: 'user',
      });
      await user.save();
    } else {
      // Verify password if user exists
      const userWithPassword = await User.findById(user._id).select('+password');
      const isPasswordValid = await userWithPassword!.comparePassword(password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password for existing account' },
          { status: 401 }
        );
      }
    }

    // Create case
    const newCase = new Case({
      userId: user._id,
      basedIn,
      timeHorizon,
      hadAdviceBefore,
      perspectives: perspectives || [],
      situation,
      unclear,
      lookingFor,
      areas: areas || [],
      status: 'submitted',
    });

    await newCase.save();

    // Generate token for the user
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: 'user',
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      {
        success: true,
        case: {
          id: newCase._id.toString(),
          caseId: newCase.caseId,
          status: newCase.status,
        },
        user: {
          id: user._id.toString(),
          email: user.email,
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
    console.error('Case submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

