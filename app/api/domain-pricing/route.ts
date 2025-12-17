import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Log the query for debugging
    console.log('Searching for domain:', domain);
    
    const adminData = await db.collection('admindashboard').findOne({
      'domains.domainName': domain,
      'domains.status': 'active'
    });

    console.log('Found admin data:', adminData ? 'Yes' : 'No');

    if (!adminData) {
      console.log('Returning default pricing');
      return NextResponse.json({
        pricing: {
          rentPerKm: 1,
          rentPerMile: 1.6,
          currency: 0,
          conversionRate: 1
        },
        location: {
          coordinates: { lat: 31.5656822, lng: 74.3141829 },
          city: 'Default',
          country: 'Default'
        },
        domain: null,
        isDefault: true
      });
    }

    // Find the specific domain
    const domainInfo = adminData.domains.find((d: any) => 
      d.domainName === domain && d.status === 'active'
    );

    console.log('Domain info:', domainInfo);
    console.log('Pricing data:', adminData.pricing);

    return NextResponse.json({
      location: adminData.location || {
        coordinates: { lat: 31.5656822, lng: 74.3141829 },
        city: 'Unknown',
        country: 'Unknown'
      },
      pricing: adminData.pricing || {
        rentPerKm: 1,
        rentPerMile: 1.6,
        currency: 0,
        conversionRate: 1
      },
      domain: domainInfo,
      isDefault: false
    });
    
  } catch (error) {
    console.error('Error fetching domain pricing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch domain pricing',
        pricing: {
          rentPerKm: 1,
          rentPerMile: 1.6,
          currency: 0,
          conversionRate: 1
        },
        location: {
          coordinates: { lat: 31.5656822, lng: 74.3141829 },
          city: 'Default',
          country: 'Default'
        },
        domain: null,
        isDefault: true
      },
      { status: 500 }
    );
  }
}