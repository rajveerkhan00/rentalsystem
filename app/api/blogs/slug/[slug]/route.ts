
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { cleanDomain } from '@/lib/db.utils';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await context.params;
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');

        const { db } = await connectToDatabase();

        let query: any = { slug: slug };

        if (domain) {
            const cleaned = cleanDomain(domain);
            const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            query.domainName = {
                $regex: new RegExp(`^(https?:\\/\\/)?(www\\.)?${escaped}\\/?$`, 'i')
            };
        }

        const blog = await db.collection('blogs').findOne(query);

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}
