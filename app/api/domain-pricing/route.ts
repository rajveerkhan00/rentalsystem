import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Helper function to clean domain name
function cleanDomainName(domain: string): string {
  if (!domain) return '';
  
  let cleaned = domain.trim();
  
  // Remove protocol (http://, https://)
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  
  // Remove www. prefix
  cleaned = cleaned.replace(/^www\./i, '');
  
  // Remove trailing slash
  cleaned = cleaned.replace(/\/$/, '');
  
  // Remove port if present
  cleaned = cleaned.split(':')[0];
  
  return cleaned.toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let domain = searchParams.get('domain');
    
    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Clean the incoming domain
    const cleanedDomain = cleanDomainName(domain);
    console.log('🔍 Searching for domain:', {
      original: domain,
      cleaned: cleanedDomain
    });
    
    const { db } = await connectToDatabase();
    
    // First, try to find the document
    const adminData = await db.collection('admindashboard').findOne({});
    
    console.log('📊 Found admin document:', adminData ? 'Yes' : 'No');
    
    if (!adminData || !adminData.domains || !Array.isArray(adminData.domains)) {
      console.log('❌ No admin data or domains array found');
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
    
    // Log all domains for debugging
    console.log('📋 All domains in database:');
    adminData.domains.forEach((d: any, i: number) => {
      console.log(`  ${i}: "${d.domainName}" - Status: ${d.status}`);
    });
    
    // Try to find the domain (exact match or cleaned match)
    let foundDomain = null;
    
    // First try exact match
    foundDomain = adminData.domains.find((d: any) => 
      d.domainName && d.status === 'active' && 
      cleanDomainName(d.domainName) === cleanedDomain
    );
    
    // If not found, try partial match (domain contains the cleaned domain)
    if (!foundDomain) {
      foundDomain = adminData.domains.find((d: any) => 
        d.domainName && d.status === 'active' && 
        cleanDomainName(d.domainName).includes(cleanedDomain)
      );
    }
    
    // If still not found, try the other way around (cleaned domain contains db domain)
    if (!foundDomain) {
      foundDomain = adminData.domains.find((d: any) => 
        d.domainName && d.status === 'active' && 
        cleanedDomain.includes(cleanDomainName(d.domainName))
      );
    }
    
    console.log('🎯 Found matching domain:', foundDomain ? 'Yes' : 'No');
    
    if (!foundDomain) {
      console.log('⚠️ No active domain found, using defaults');
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
    
    console.log('✅ Domain found:', foundDomain.domainName);
    console.log('💰 Pricing data:', adminData.pricing);
    console.log('📍 Location data:', adminData.location);
    
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
      domain: foundDomain,
      isDefault: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching domain pricing:', error);
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