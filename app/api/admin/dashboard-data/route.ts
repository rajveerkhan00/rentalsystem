import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// Type definitions
interface DashboardData {
  location: {
    country: string;
    province: string;
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    rentPerMile: number;
    rentPerKm: number;
    currency: string;
    conversionRate: number;
  };
  domains: Array<{
    domainName: string;
    status: 'active' | 'inactive' | 'pending';
    expiryDate?: string;
  }>;
  lastUpdated: Date;
}

interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string | null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession || (authSession.user as SessionUser)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = (authSession.user as SessionUser)?.id;
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    const collection = db.collection('admindashboard');
    
    // Get dashboard data for the admin
    const dashboardData = await collection.findOne({ 
      adminId: userId 
    });
    
    if (!dashboardData) {
      // Return default structure if no data exists
      const defaultData: DashboardData & { adminId: string } = {
        adminId: userId,
        location: {
          country: '',
          province: '',
          city: '',
          address: '',
          coordinates: { lat: 30.67, lng: 69.36 }
        },
        pricing: {
          rentPerMile: 0,
          rentPerKm: 0,
          currency: 'USD',
          conversionRate: 1
        },
        domains: [],
        lastUpdated: new Date()
      };
      
      return NextResponse.json(defaultData);
    }
    
    // Remove _id from response
    const { _id, ...responseData } = dashboardData;
    
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession || (authSession.user as SessionUser)?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = (authSession.user as SessionUser)?.id;
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID not found' },
        { status: 400 }
      );
    }
    
    const data: DashboardData = await request.json();
    
    // Validate data
    if (!data.location || !data.pricing || !data.domains) {
      return NextResponse.json(
        { message: 'Invalid data structure' },
        { status: 400 }
      );
    }
    
    const { db, client } = await connectToDatabase();
    const dashboardCollection = db.collection('admindashboard');
    const domainsCollection = db.collection('domains');
    
    // Validate each domain for uniqueness across all users
    for (const domainData of data.domains) {
      // Normalize domain
      const normalizedDomain = domainData.domainName
        .toLowerCase()
        .trim()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .replace(/\/$/, '');
      
      // Check if domain exists for any other admin
      const existingDomain = await domainsCollection.findOne({
        domainName: normalizedDomain,
        adminId: { $ne: userId } // Check for other admins, not current admin
      });
      
      if (existingDomain) {
        // Get admin info who owns this domain
        const adminOwner = await dashboardCollection.findOne({ 
          adminId: existingDomain.adminId 
        }, {
          projection: {
            'location.country': 1,
            'location.city': 1,
            'location.address': 1
          }
        });
        
        let ownerInfo = 'another admin';
        if (adminOwner?.location) {
          const loc = adminOwner.location;
          ownerInfo = `${loc.city || ''} ${loc.country || ''}`.trim() || 'another admin';
        }
        
        return NextResponse.json(
          { 
            message: `Domain "${normalizedDomain}" is already registered by ${ownerInfo}`,
            domain: normalizedDomain,
            ownedBy: existingDomain.adminId,
            conflict: true
          },
          { status: 409 }
        );
      }
    }
    
    // Start a MongoDB session for transaction
    const mongoSession = client.startSession();
    
    try {
      await mongoSession.withTransaction(async () => {
        // 1. Update or insert dashboard data
        const updateData = {
          ...data,
          adminId: userId,
          lastUpdated: new Date()
        };
        
        await dashboardCollection.updateOne(
          { adminId: userId },
          { $set: updateData },
          { upsert: true, session: mongoSession }
        );
        
        // 2. Update domains collection
        // First, remove old domains for this admin
        await domainsCollection.deleteMany(
          { adminId: userId },
          { session: mongoSession }
        );
        
        // Then insert new domains
        if (data.domains.length > 0) {
          const domainDocuments = data.domains.map(domain => ({
            domainName: domain.domainName
              .toLowerCase()
              .trim()
              .replace(/^(https?:\/\/)?(www\.)?/, '')
              .replace(/\/$/, ''),
            status: domain.status,
            expiryDate: domain.expiryDate ? new Date(domain.expiryDate) : null,
            adminId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          
          await domainsCollection.insertMany(domainDocuments, { session: mongoSession });
        }
      });
      
    } catch (transactionError: any) {
      // Handle duplicate domain error during insertion
      if (transactionError.code === 11000) {
        return NextResponse.json(
          { 
            message: 'A domain you tried to add already exists in the system. Please refresh and try again.',
            error: 'Domain conflict during save',
            conflict: true
          },
          { status: 409 }
        );
      }
      
      throw transactionError;
    } finally {
      await mongoSession.endSession();
    }
    
    return NextResponse.json({ 
      message: 'Data saved successfully',
      success: true,
      domainsCount: data.domains.length
    });
    
  } catch (error: any) {
    console.error('Error saving dashboard data:', error);
    
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        details: error.code || 'Unknown error code'
      },
      { status: 500 }
    );
  }
}