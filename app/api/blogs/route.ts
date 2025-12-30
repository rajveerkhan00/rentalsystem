
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const domain = searchParams.get('domain');

        const { db } = await connectToDatabase();

        // If domain is provided, filter by it. otherwise return empty or all?
        // Requirement says "blogs for ABC is different, blogs for DEF is different".
        // If no domain param, maybe returns all (for admin overview) or empty.
        // Let's support filtering.

        const query = domain ? { domainName: domain } : {};

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
