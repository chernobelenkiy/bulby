import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schema for the SCAMPER ideas
const scamperSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number().min(1).max(10),
      scamperTechnique: z.string(),
      implementation: z.string(),
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements SCAMPER method to transform existing ideas
 * SCAMPER stands for:
 * - Substitute
 * - Combine
 * - Adapt
 * - Modify
 * - Put to another use
 * - Eliminate
 * - Reverse
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 ideas with evaluations
 */
export async function generateIdeasUsingScamperMethod(
  prompt: string,
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // Generate ideas using the SCAMPER method
  const { object: scamperResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in the SCAMPER method for idea generation and transformation.
    SCAMPER stands for:
    - Substitute: Replace part of a concept with something else
    - Combine: Merge elements or ideas together
    - Adapt: Modify for another purpose or use
    - Modify: Change aspects like size, shape, or frequency
    - Put to another use: Find new uses for existing things
    - Eliminate: Remove elements or simplify concepts
    - Reverse: Flip aspects or consider opposite approaches
    
    Generate 7 creative ideas based on the user's prompt, using one SCAMPER technique for each idea.
    For each idea, provide:
    1. A descriptive title
    2. A detailed description
    3. A score from 1-10 reflecting feasibility and innovation
    4. Which SCAMPER technique was primarily used
    5. Implementation notes
    ${languageInstruction}`,
    prompt,
    schema: scamperSchema,
  });

  // Process the ideas
  const finalIdeas = scamperResponse.ideas.map(idea => {
    return {
      title: idea.title,
      description: idea.description,
      score: idea.score,
      dreamerNotes: idea.scamperTechnique,
      realistNotes: idea.implementation,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 