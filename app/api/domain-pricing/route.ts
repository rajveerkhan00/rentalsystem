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
    console.log('🔍 SEARCHING FOR DOMAIN:', {
      original: domain,
      cleaned: cleanedDomain
    });
    
    const { db } = await connectToDatabase();
    
    // Get ALL documents from admindashboard collection
    const adminDataList = await db.collection('admindashboard').find({}).toArray();
    
    console.log(`📊 Found ${adminDataList.length} admin document(s)`);
    
    if (!adminDataList || adminDataList.length === 0) {
      console.log('❌ No admin documents found in collection');
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
    
    let foundDomain = null;
    let foundAdminData = null;
    
    // Search through ALL documents
    for (const adminData of adminDataList) {
      console.log(`\n🔎 Checking document: ${adminData._id}`);
      
      if (!adminData.domains || !Array.isArray(adminData.domains)) {
        console.log('  ⚠️ No domains array in this document');
        continue;
      }
      
      // Log all domains in this document
      console.log(`  📋 Domains in this document (${adminData.domains.length}):`);
      adminData.domains.forEach((d: any, i: number) => {
        console.log(`    ${i}: "${d.domainName}" - Status: ${d.status} - Cleaned: "${cleanDomainName(d.domainName)}"`);
      });
      
      // Search for matching domain in this document
      foundDomain = adminData.domains.find((d: any) => {
        if (!d.domainName || d.status !== 'active') {
          return false;
        }
        
        const dbDomainCleaned = cleanDomainName(d.domainName);
        console.log(`    🔄 Comparing: "${dbDomainCleaned}" === "${cleanedDomain}"`);
        
        return dbDomainCleaned === cleanedDomain;
      });
      
      if (foundDomain) {
        console.log(`    ✅ FOUND MATCHING DOMAIN: "${foundDomain.domainName}"`);
        foundAdminData = adminData;
        break;
      }
    }
    
    if (!foundDomain || !foundAdminData) {
      console.log(`\n❌ NO MATCHING DOMAIN FOUND for "${cleanedDomain}"`);
      console.log('⚠️ Using default pricing');
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
    
    console.log('\n🎯 SUCCESS! Domain matched successfully');
    console.log('💰 Pricing data from DB:', foundAdminData.pricing);
    console.log('📍 Location data from DB:', foundAdminData.location);
    console.log('🏷️ Found domain info:', {
      name: foundDomain.domainName,
      status: foundDomain.status,
      expiry: foundDomain.expiryDate
    });
    
    // Return the data from the document where domain was found
    return NextResponse.json({
      location: foundAdminData.location || {
        coordinates: { lat: 31.5656822, lng: 74.3141829 },
        city: 'Unknown',
        country: 'Unknown'
      },
      pricing: foundAdminData.pricing || {
        rentPerKm: 1,
        rentPerMile: 1.6,
        currency: 0,
        conversionRate: 1
      },
      domain: foundDomain,
      isDefault: false
    });
    
  } catch (error) {
    console.error('💥 ERROR in domain-pricing API:', error);
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