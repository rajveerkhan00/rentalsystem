import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/utils';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // Verify superadmin token using NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    });
    
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { name, email, password } = await request.json(); // Add name

    if (!name || !email || !password) { // Check for name
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if admin already exists in the 'admin' collection
    const existingAdmin = await db.collection('admin').findOne({ 
      email: email.toLowerCase().trim(),
    });
    
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin document - store in 'admin' collection
    const admin = {
      name: name.trim(), // Add name
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true, // Default to active
      createdBy: token.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into 'admin' collection
    await db.collection('admin').insertOne(admin);

    return NextResponse.json(
      { message: 'Admin added successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add admin error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify superadmin token using NextAuth
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    });
    
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Get all admins from 'admin' collection
    const admins = await db.collection('admin')
      .find({})
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      { admins },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// New endpoint to toggle admin status (enable/disable)
export async function PATCH(request: NextRequest) {
  try {
    // Verify superadmin token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    });
    
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { adminId, isActive } = await request.json();

    if (!adminId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { message: 'Admin ID and status are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(adminId);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid admin ID format' },
        { status: 400 }
      );
    }
    
    // Update admin status in 'admin' collection
    const result = await db.collection('admin').updateOne(
      { _id: objectId },
      { 
        $set: { 
          isActive,
          updatedAt: new Date(),
          updatedBy: token.email
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: `Admin ${isActive ? 'enabled' : 'disabled'} successfully`,
        isActive 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Toggle admin status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// New endpoint to delete admin
export async function DELETE(request: NextRequest) {
  try {
    // Verify superadmin token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || ''
    });
    
    if (!token || token.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('id');

    if (!adminId) {
      return NextResponse.json(
        { message: 'Admin ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(adminId);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid admin ID format' },
        { status: 400 }
      );
    }
    
    // Delete admin from 'admin' collection
    const result = await db.collection('admin').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete admin error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}