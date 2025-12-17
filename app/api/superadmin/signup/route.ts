import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, password, secretKey } = await request.json();

    // Validate all fields
    if (!email || !password || !secretKey) {
      return NextResponse.json(
        { message: 'Email, password, and secret key are required' },
        { status: 400 }
      );
    }

    // Server-side validation of secret key
    const validSecretKey = process.env.SUPER_ADMIN_SECRET_KEY || 'alijaved';
    if (secretKey !== validSecretKey) {
      return NextResponse.json(
        { message: 'Invalid secret key' },
        { status: 401 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if superadmin already exists (case-insensitive)
    const existingSuperAdmin = await db.collection('superadmin').findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') },
      role: 'superadmin'
    });
    
    if (existingSuperAdmin) {
      return NextResponse.json(
        { message: 'Super admin already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create superadmin document with NextAuth compatible fields
    const superAdmin = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
      loginAttempts: 0,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await db.collection('superadmin').insertOne(superAdmin);

    // Create response (no JWT token needed for NextAuth)
    return NextResponse.json(
      { 
        success: true,
        message: 'Super admin created successfully',
        user: {
          id: result.insertedId,
          email: superAdmin.email,
          role: superAdmin.role
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Signup error:', error.message);
    return NextResponse.json(
      { message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}