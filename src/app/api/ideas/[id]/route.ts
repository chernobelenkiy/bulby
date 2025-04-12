import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        method: true,
        user: true,
      },
    });

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const transformedIdea = {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      createdAt: idea.createdAt,
      method: idea.method.name,
      userId: idea.userId,
      dreamerNotes: idea.dreamerNotes || undefined,
      realistNotes: idea.realistNotes || undefined,
      criticNotes: idea.criticNotes || undefined,
      score: idea.score || 0,
    };

    return NextResponse.json({ idea: transformedIdea }, { status: 200 });
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
  }
}
