import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePasswords, hashPassword } from '@/lib/utils';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get admin from database
    const adminId = new ObjectId(token.id as string);
    const admin = await db.collection('admin').findOne({ 
      _id: adminId,
      role: 'admin'
    });
    
    if (!admin) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if account is active
    if (admin.isActive === false) {
      return NextResponse.json(
        { message: 'Account is disabled' },
        { status: 403 }
      );
    }

    // Verify current password
    const isPasswordValid = await comparePasswords(currentPassword, admin.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    await db.collection('admin').updateOne(
      { _id: adminId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
          resetToken: null, // Clear any reset tokens
          resetTokenExpiry: null,
        }
      }
    );

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}