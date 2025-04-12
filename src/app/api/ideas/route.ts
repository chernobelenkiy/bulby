import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all ideas from the database
    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        method: true,
        user: true
      }
    });
    
    // Transform the data to match the expected format
    const transformedIdeas = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description || '',
      createdAt: idea.createdAt,
      method: idea.method.name,
      userId: idea.userId,
      // Include notes and score
      dreamerNotes: idea.dreamerNotes || undefined,
      realistNotes: idea.realistNotes || undefined,
      criticNotes: idea.criticNotes || undefined,
      score: idea.score || 0
    }));
    
    return NextResponse.json({ ideas: transformedIdeas }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.method) {
      return NextResponse.json(
        { error: 'Title, description, and method are required fields' },
        { status: 400 }
      );
    }
    
    // Get the user from the authenticated session
    // In a real app, you would get the user from the session
    // For demo purposes, we'll get the first user
    const user = await prisma.user.findFirst();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get or create the method
    let method = await prisma.method.findFirst({
      where: {
        name: body.method
      }
    });
    
    if (!method) {
      // Create the method if it doesn't exist
      method = await prisma.method.create({
        data: {
          name: body.method,
          description: `${body.method} method`
        }
      });
    }
    
    // Create a new idea in the database
    const newIdea = await prisma.idea.create({
      data: {
        title: body.title,
        description: body.description,
        user: {
          connect: {
            id: user.id
          }
        },
        method: {
          connect: {
            id: method.id
          }
        },
        // Include notes and score
        dreamerNotes: body.dreamerNotes,
        realistNotes: body.realistNotes,
        criticNotes: body.criticNotes,
        score: body.score ? parseFloat(body.score) : 0
      },
      include: {
        method: true,
        user: true
      }
    });
    
    // Transform the data to match the expected format
    const transformedIdea = {
      id: newIdea.id,
      title: newIdea.title,
      description: newIdea.description || '',
      createdAt: newIdea.createdAt,
      method: newIdea.method.name,
      userId: newIdea.userId,
      // Include notes and score
      dreamerNotes: newIdea.dreamerNotes || undefined,
      realistNotes: newIdea.realistNotes || undefined,
      criticNotes: newIdea.criticNotes || undefined,
      score: newIdea.score || 0
    };
    
    return NextResponse.json({ idea: transformedIdea }, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
} 