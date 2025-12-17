import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Type definitions
interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string | null;
}

// Function to normalize domain
function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '')
    .replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession || (authSession.user as SessionUser)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { domainName } = await request.json();

    if (!domainName || typeof domainName !== 'string') {
      return NextResponse.json(
        { error: 'Valid domain name is required' },
        { status: 400 }
      );
    }

    // Normalize domain name
    const normalizedDomain = normalizeDomain(domainName);
    
    console.log(`🔍 Checking domain: "${domainName}" -> Normalized: "${normalizedDomain}"`);

    const { db } = await connectToDatabase();
    
    // Check ALL admindashboard documents to see if any admin has this domain
    const dashboardCollection = db.collection('admindashboard');
    
    // Query ALL admin dashboards to find any that have this domain in their domains array
    const adminWithDomain = await dashboardCollection.findOne({
      'domains.domainName': { 
        $regex: new RegExp(`^${normalizedDomain}$`, 'i') 
      }
    });

    console.log(`🔍 Found admin with domain:`, adminWithDomain ? adminWithDomain.adminId : 'None');
    
    if (adminWithDomain) {
      // Check if it's the current user's domain
      const currentUserId = (authSession.user as SessionUser)?.id;
      
      console.log(`🔍 Current user ID: ${currentUserId}, Domain owner ID: ${adminWithDomain.adminId}`);
      
      if (adminWithDomain.adminId === currentUserId) {
        return NextResponse.json({
          exists: true,
          isOwnDomain: true,
          domain: normalizedDomain,
          originalDomain: domainName,
          message: `Domain "${normalizedDomain}" is already in your list`
        });
      }
      
      // Return info about the admin who owns this domain
      let ownerInfo = 'another admin';
      if (adminWithDomain.location) {
        const loc = adminWithDomain.location;
        if (loc.city && loc.country) {
          ownerInfo = `${loc.city}, ${loc.country}`;
        } else if (loc.country) {
          ownerInfo = loc.country;
        } else if (loc.city) {
          ownerInfo = loc.city;
        }
      }
      
      return NextResponse.json({
        exists: true,
        isOwnDomain: false,
        domain: normalizedDomain,
        originalDomain: domainName,
        ownedBy: adminWithDomain.adminId,
        ownerInfo: ownerInfo,
        message: `Domain "${normalizedDomain}" is already registered by ${ownerInfo}`
      });
    }

    return NextResponse.json({
      exists: false,
      domain: normalizedDomain,
      originalDomain: domainName,
      message: `Domain "${normalizedDomain}" is available`
    });
    
  } catch (error: any) {
    console.error('❌ Error checking domain:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check domain availability',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}