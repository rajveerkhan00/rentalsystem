import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId, UpdateFilter, Document } from 'mongodb';

interface SessionUser {
  id?: string;
  email?: string | null;
  role?: string | null;
}

interface DomainData {
  _id: string;
  domainName: string;
  status: 'active' | 'inactive' | 'pending';
  expiryDate: string;
  adminId: string;
  adminEmail: string;
  adminName?: string;
  adminLocation?: {
    country: string;
    city: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);
    
    if (!authSession || (authSession.user as SessionUser)?.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const dashboardCollection = db.collection('admindashboard');
    const usersCollection = db.collection('users');
    const adminCollection = db.collection('admin');

    const allDashboards = await dashboardCollection.find({}).toArray();
    const allUsers = await usersCollection.find({}).toArray();
    const userMap = new Map(allUsers.map(u => [u._id.toString(), u.email]));

    const allAdmins = await adminCollection.find({}).toArray();
    const adminNameMap = new Map(allAdmins.map(a => [a._id.toString(), a.name]));

    const allDomains: DomainData[] = [];

    for (const dashboard of allDashboards) {
      const adminEmail = userMap.get(dashboard.adminId) || dashboard.adminId || 'Unknown';
      const adminName = adminNameMap.get(dashboard.adminId) || 'N/A';
      const adminLocation = dashboard.location || {};

      if (dashboard.domains && Array.isArray(dashboard.domains)) {
        for (const domain of dashboard.domains) {
          const dashboardId = dashboard._id.toString();
          const uniqueId = `${dashboardId}-${domain.domainName}`;

          allDomains.push({
            _id: uniqueId,
            domainName: domain.domainName,
            status: domain.status || 'pending',
            expiryDate: domain.expiryDate || new Date().toISOString().split('T')[0],
            adminId: dashboard.adminId,
            adminEmail: adminEmail,
            adminName: adminName,
            adminLocation: {
              country: adminLocation.country || 'Unknown',
              city: adminLocation.city || 'Unknown'
            },
            createdAt: dashboard.lastUpdated?.toISOString() || new Date().toISOString(),
            updatedAt: dashboard.lastUpdated?.toISOString() || new Date().toISOString()
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: allDomains.length,
      domains: allDomains
    });

  } catch (error: any) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);

    if (!authSession || (authSession.user as SessionUser)?.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { domainId, status, expiryDate } = await request.json();

    if (!domainId) {
      return NextResponse.json(
        { message: 'Domain ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const dashboardCollection = db.collection('admindashboard');

    const [dashboardId, ...domainNameParts] = domainId.split('-');
    const domainName = domainNameParts.join('-');

    if (!dashboardId || !domainName) {
      return NextResponse.json(
        { message: 'Invalid domain ID format' },
        { status: 400 }
      );
    }

    console.log(`🔍 Looking for dashboard: ${dashboardId}, domain: ${domainName}`);

    let dashboard;
    try {
      dashboard = await dashboardCollection.findOne({ _id: new ObjectId(dashboardId) });
    } catch {
      dashboard = await dashboardCollection.findOne({ adminId: dashboardId });
    }

    if (!dashboard) {
      console.log(`❌ Dashboard not found with ID: ${dashboardId}`);
      return NextResponse.json(
        { message: 'Admin dashboard not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Found dashboard for admin: ${dashboard.adminId}`);

    const domainIndex = dashboard.domains.findIndex((d: any) => d.domainName === domainName);

    if (domainIndex === -1) {
      console.log(`❌ Domain not found: ${domainName}`);
      return NextResponse.json(
        { message: 'Domain not found in dashboard' },
        { status: 404 }
      );
    }

    console.log(`✅ Found domain at index: ${domainIndex}`);

    const updateObj: any = {};
    if (status) updateObj[`domains.${domainIndex}.status`] = status;
    if (expiryDate) updateObj[`domains.${domainIndex}.expiryDate`] = expiryDate;

    updateObj['lastUpdated'] = new Date();

    const result = await dashboardCollection.updateOne(
      { _id: dashboard._id, [`domains.${domainIndex}.domainName`]: domainName },
      { $set: updateObj }
    );

    console.log(`📝 Update result:`, result);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update domain' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Domain updated successfully',
      modified: result.modifiedCount
    });

  } catch (error: any) {
    console.error('❌ Error updating domain:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authSession = await getServerSession(authOptions);

    if (!authSession || (authSession.user as SessionUser)?.role !== 'superadmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('id');

    if (!domainId) {
      return NextResponse.json(
        { message: 'Domain ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const dashboardCollection = db.collection('admindashboard');

    const [dashboardId, ...domainNameParts] = domainId.split('-');
    const domainName = domainNameParts.join('-');

    if (!dashboardId || !domainName) {
      return NextResponse.json(
        { message: 'Invalid domain ID format' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting domain: ${domainName} from dashboard: ${dashboardId}`);

    let dashboard;
    try {
      dashboard = await dashboardCollection.findOne({ _id: new ObjectId(dashboardId) });
    } catch {
      dashboard = await dashboardCollection.findOne({ adminId: dashboardId });
    }

    if (!dashboard) {
      console.log(`❌ Dashboard not found with ID: ${dashboardId}`);
      return NextResponse.json(
        { message: 'Admin dashboard not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Found dashboard for admin: ${dashboard.adminId}`);

    // Use any type for $pull to satisfy TypeScript
    const result = await dashboardCollection.updateOne(
      { _id: dashboard._id },
      { 
        $pull: { domains: { domainName } as any },
        $set: { lastUpdated: new Date() }
      } as UpdateFilter<Document>
    );

    console.log(`📝 Delete result:`, result);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Domain not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Domain "${domainName}" deleted successfully`,
      deletedCount: result.modifiedCount
    });

  } catch (error: any) {
    console.error('❌ Error deleting domain:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Internal server error',
        success: false
      },
      { status: 500 }
    );
  }
}
