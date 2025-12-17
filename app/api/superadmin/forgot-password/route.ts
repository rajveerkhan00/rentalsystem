import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
    
    // Find superadmin - check if email exists in the Rentalsystem.superadmin collection
    const superAdmin = await db.collection('superadmin').findOne({ 
      email: email.toLowerCase().trim(),
      role: 'superadmin' 
    });
    
    // If no superadmin found with this email, return error
    if (!superAdmin) {
      return NextResponse.json(
        { message: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to database
    await db.collection('superadmin').updateOne(
      { _id: superAdmin._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        }
      }
    );

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: `"Super Admin Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Super Admin Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to right, #000000, #333333); padding: 20px; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Password Reset Request</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 5px 5px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              You have requested to reset your password for your Super Admin account.
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Click the button below to reset your password. This link will expire in 1 hour.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #000000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; margin: 15px 0;">
              <code style="font-size: 13px; color: #333; word-break: break-all;">
                ${resetUrl}
              </code>
            </div>
            <p style="font-size: 14px; color: #999; line-height: 1.6;">
              If you didn't request this password reset, please ignore this email. Your account is secure.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            <p style="font-size: 12px; color: #777; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    
    // More specific error message
    let errorMessage = 'Failed to process password reset request';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email configuration error. Please contact support.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Email server connection failed.';
    }
    
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}