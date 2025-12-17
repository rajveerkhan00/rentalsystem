import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePasswords, generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // ONLY check in superadmin collection
    const superAdmin = await db.collection('superadmin').findOne({ 
      email: email.toLowerCase().trim(),
      role: 'superadmin' 
    });
    
    if (!superAdmin) {
      return NextResponse.json(
        { message: 'Invalid super admin credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (superAdmin.isActive === false) {
      return NextResponse.json(
        { message: 'Super admin account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, superAdmin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(superAdmin._id.toString());

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        token,
        user: {
          id: superAdmin._id,
          email: superAdmin.email,
          role: superAdmin.role,
          isActive: superAdmin.isActive
        }
      },
      { status: 200 }
    );

    // Set cookie with token
    response.cookies.set('superadmin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Super Admin Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}