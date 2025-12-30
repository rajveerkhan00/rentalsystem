
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

import { cleanDomain } from '@/lib/db.utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');

        const { db } = await connectToDatabase();

        let query = {};
        if (domain) {
            const cleaned = cleanDomain(domain);
            // Match strict or with protocols using regex for flexibility
            // Escaping the dot for regex safety
            const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Regex to match:
            // ^(https?://)?(www\.)?cleaned(/)?$
            // This covers: cleaned, www.cleaned, http://cleaned, https://cleaned, https://www.cleaned, etc.
            // Case insensitive
            query = {
                domainName: {
                    $regex: new RegExp(`^(https?:\\/\\/)?(www\\.)?${escaped}\\/?$`, 'i')
                }
            };
        }

        const blogs = await db.collection('blogs').find(query).sort({ date: -1 }).toArray();

        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { db } = await connectToDatabase();

        const newBlog = {
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            image: body.image,
            author: body.author,
            date: body.date,
            slug: body.slug,
            domainName: body.domainName,
            createdAt: new Date(),
        };

        const result = await db.collection('blogs').insertOne(newBlog);

        return NextResponse.json({ ...newBlog, _id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Failed to create blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
