import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const host = request.headers.get('host') || 'default';
        const normalizedHost = host
            .toLowerCase()
            .trim()
            .replace(/^(https?:\/\/)?(www\.)?/, '')
            .replace(/\/$/, '');

        const { db } = await connectToDatabase();

        // First, check if there's a specific theme for this domain
        const domainCollection = db.collection('domains');
        const domain = await domainCollection.findOne({ domainName: normalizedHost });

        if (domain && domain.themeId) {
            return NextResponse.json({ themeId: domain.themeId });
        }

        // If not, check if the admin who owns this domain has a default theme
        if (domain) {
            const dashboardCollection = db.collection('admindashboard');
            const dashboard = await dashboardCollection.findOne({ adminId: domain.adminId });

            if (dashboard && dashboard.defaultTheme) {
                return NextResponse.json({ themeId: dashboard.defaultTheme });
            }
        }

        // Default fallback
        return NextResponse.json({ themeId: 'default' });

    } catch (error: any) {
        console.error('Error fetching theme:', error);
        return NextResponse.json(
            { themeId: 'default', error: error.message },
            { status: 500 }
        );
    }
}
