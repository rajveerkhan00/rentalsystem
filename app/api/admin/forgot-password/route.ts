import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Find admin in database
    const admin = await db.collection('admin').findOne({ 
      email: email.toLowerCase().trim(),
      role: 'admin'
    });
    
    if (!admin) {
      // Return generic message for security
      return NextResponse.json(
        { message: 'If an admin account exists, you will receive a password reset email' },
        { status: 200 }
      );
    }

    // Check if account is active
    if (admin.isActive === false) {
      return NextResponse.json(
        { message: 'Account is disabled. Contact super admin.' },
        { status: 403 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to database
    await db.collection('admin').updateOne(
      { _id: admin._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        }
      }
    );

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Password Reset Request</h2>
          <p>You requested a password reset for your Admin account.</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
          <p><strong>Note:</strong> This link can only be used once.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Admin System.
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Password reset email sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to send reset email' },
      { status: 500 }
    );
  }
}