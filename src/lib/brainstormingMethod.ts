import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schema for the brainstorming ideas
const brainstormingSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number().min(1).max(10),
      innovationFactor: z.string(),
      applicationAreas: z.string(),
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements Brainstorming method to generate a wide variety of ideas
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 ideas with evaluations
 */
export async function generateIdeasUsingBrainstormingMethod(
  prompt: string,
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // Generate multiple ideas using the brainstorming technique
  const { object: brainstormingResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in the brainstorming technique for idea generation.
    Your goal is to generate a wide variety of creative and innovative ideas without any filtering or judgment.
    Quantity is more important than quality at this stage.
    Generate at least 8 diverse ideas based on the user's prompt.
    For each idea, provide:
    1. A catchy title
    2. A concise description
    3. A score from 1-10 reflecting how innovative the idea is
    4. Innovation factor - what makes this idea stand out
    5. Possible application areas
    ${languageInstruction}`,
    prompt,
    schema: brainstormingSchema,
  });

  // Process the ideas
  const finalIdeas: GeneratedIdea[] = brainstormingResponse.ideas.map(idea => {
    return {
      title: idea.title,
      description: idea.description,
      score: idea.score,
      dreamerNotes: idea.innovationFactor,
      realistNotes: idea.applicationAreas,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 