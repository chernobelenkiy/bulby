import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;
    
    // Find the idea by ID in the database
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        method: true,
        user: true
      }
    });
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    // Transform the data to match the expected format
    const transformedIdea = {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      createdAt: idea.createdAt,
      method: idea.method.name,
      userId: idea.userId,
      // Include notes and score
      dreamerNotes: idea.dreamerNotes || undefined,
      realistNotes: idea.realistNotes || undefined,
      criticNotes: idea.criticNotes || undefined,
      score: idea.score || 0
    };
    
    return NextResponse.json({ idea: transformedIdea }, { status: 200 });
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Check if the idea exists
    const existingIdea = await prisma.idea.findUnique({
      where: { id }
    });
    
    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    // Update allowed fields
    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        // Allow updating notes and score
        dreamerNotes: body.dreamerNotes !== undefined ? body.dreamerNotes : undefined,
        realistNotes: body.realistNotes !== undefined ? body.realistNotes : undefined,
        criticNotes: body.criticNotes !== undefined ? body.criticNotes : undefined,
        score: body.score !== undefined ? body.score : undefined,
      },
      include: {
        method: true,
        user: true
      }
    });
    
    // Transform the data to match the expected format
    const transformedIdea = {
      id: updatedIdea.id,
      title: updatedIdea.title,
      description: updatedIdea.description,
      createdAt: updatedIdea.createdAt,
      method: updatedIdea.method.name,
      userId: updatedIdea.userId,
      // Include notes and score
      dreamerNotes: updatedIdea.dreamerNotes || undefined,
      realistNotes: updatedIdea.realistNotes || undefined,
      criticNotes: updatedIdea.criticNotes || undefined,
      score: updatedIdea.score || 0
    };
    
    return NextResponse.json({ idea: transformedIdea }, { status: 200 });
  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;
    
    // Check if the idea exists
    const existingIdea = await prisma.idea.findUnique({
      where: { id },
      include: {
        method: true
      }
    });
    
    if (!existingIdea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    // Delete the idea
    await prisma.idea.delete({
      where: { id }
    });
    
    // Transform the deleted idea data to match the expected format
    const transformedIdea = {
      id: existingIdea.id,
      title: existingIdea.title,
      description: existingIdea.description,
      createdAt: existingIdea.createdAt,
      method: existingIdea.method.name,
      userId: existingIdea.userId,
      // Include notes and score
      dreamerNotes: existingIdea.dreamerNotes || undefined,
      realistNotes: existingIdea.realistNotes || undefined,
      criticNotes: existingIdea.criticNotes || undefined,
      score: existingIdea.score || 0
    };
    
    return NextResponse.json({ 
      message: 'Idea deleted successfully',
      idea: transformedIdea
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
} 