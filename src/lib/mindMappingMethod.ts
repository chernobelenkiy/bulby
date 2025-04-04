import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schema for Mind Mapping ideas
const mindMappingSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number().min(1).max(10),
      centralConcept: z.string(), // The main concept or topic
      branches: z.array(z.string()), // Main branches of the mind map
      connections: z.string(), // Identified connections between concepts
      insights: z.string(), // Insights gained from the mind mapping process
      applications: z.string(), // Practical applications of the idea
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements the Mind Mapping method for idea generation.
 * Mind mapping visually organizes information by starting with a central concept
 * and branching out with related ideas, helping discover connections and patterns.
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 ideas generated using mind mapping principles
 */
export async function generateIdeasUsingMindMappingMethod(
  prompt: string,
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // Generate ideas using the Mind Mapping method
  const { object: mindMappingResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in using Mind Mapping for idea generation and creative problem-solving.
    Mind Mapping is a technique that visually organizes information around a central concept, with branches
    representing different aspects or categories, and sub-branches for more detailed elements.
    
    Generate 5 comprehensive ideas based on the user's prompt, structured as if they emerged from a mind mapping process.
    For each idea, provide:
    1. A descriptive title
    2. A concise description
    3. A score from 1-10 reflecting overall quality
    4. The central concept that formed the core of this mind map
    5. 3-5 main branches that emerged from the central concept
    6. Connections identified between different branches or concepts
    7. Key insights gained from the mind mapping process
    8. Practical applications or implementations of the idea
    ${languageInstruction}`,
    prompt,
    schema: mindMappingSchema,
  });

  // Process the ideas - adapt mind mapping output to our standard format
  const finalIdeas = mindMappingResponse.ideas.map(idea => {
    return {
      title: idea.title,
      description: idea.description,
      score: idea.score,
      dreamerNotes: `Central Concept: ${idea.centralConcept}\n\nInsights: ${idea.insights}`,
      realistNotes: `Applications: ${idea.applications}\n\nConnections: ${idea.connections}`,
      criticNotes: `Main Branches:\n${idea.branches.map((branch, i) => `${i+1}. ${branch}`).join('\n')}`,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 