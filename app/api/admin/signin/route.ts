import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePasswords } from '@/lib/utils';

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
    
    // ONLY check in admin collection
    const admin = await db.collection('admin').findOne({ 
      email: email.toLowerCase().trim(),
      role: 'admin' 
    });
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Check if account is active
    if (admin.isActive === false) {
      return NextResponse.json(
        { message: 'Admin account is disabled' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, admin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create response (no JWT needed for session-based auth)
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive
        }
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error('Admin Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}