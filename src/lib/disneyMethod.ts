import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schemas for the agent responses
const dreamerSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      notes: z.string().optional(),
    })
  ),
  reasoning: z.string(),
});

const realistSchema = z.object({
  evaluations: z.array(
    z.object({
      title: z.string(),
      feasibility: z.number().min(1).max(10),
      resources: z.string(),
      challenges: z.string(),
      notes: z.string(),
    })
  ),
  reasoning: z.string(),
});

const criticSchema = z.object({
  critiques: z.array(
    z.object({
      title: z.string(),
      score: z.number().min(1).max(10),
      weaknesses: z.string(),
      improvements: z.string(),
      notes: z.string(),
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements Walt Disney's creative method using three AI agents:
 * 1. Dreamer - generates creative ideas
 * 2. Realist - evaluates feasibility
 * 3. Critic - identifies weaknesses and suggests improvements
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 generated ideas with evaluations
 */
export async function generateIdeasUsingDisneyMethod(
  prompt: string, 
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // 1. Dreamer agent - generates creative ideas
  const { object: dreamerResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are a creative Dreamer in Walt Disney's method of idea generation. 
    Your role is to think big, be imaginative, and generate innovative ideas without worrying about practicality. 
    Generate 5-7 creative ideas based on the user's prompt.
    ${languageInstruction}`,
    prompt,
    schema: dreamerSchema,
  });

  // Only process the top 5 ideas from the dreamer to avoid overwhelming
  const topIdeas = dreamerResponse.ideas.slice(0, 5);

  // 2. Realist agent - evaluates feasibility
  const { object: realistResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are a practical Realist in Walt Disney's method of idea generation.
    Your role is to evaluate ideas from a practical standpoint, considering resources needed, feasibility, and implementation challenges.
    Analyze each idea and provide a feasibility score (1-10) and practical considerations.
    ${languageInstruction}`,
    prompt: `Evaluate these ideas from a practical perspective:
    ${topIdeas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: realistSchema,
  });

  // 3. Critic agent - finds weaknesses and suggests improvements
  const { object: criticResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are a constructive Critic in Walt Disney's method of idea generation.
    Your role is to identify potential weaknesses, problems, and risks with each idea.
    Be constructive but thorough in your criticism, and suggest possible improvements.
    ${languageInstruction}`,
    prompt: `Critique these ideas and suggest improvements:
    ${topIdeas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: criticSchema,
  });

  // Combine and process the results
  const finalIdeas: GeneratedIdea[] = topIdeas.map(idea => {
    const realistEval = realistResponse.evaluations.find(
      evaluation => evaluation.title === idea.title
    );
    const criticEval = criticResponse.critiques.find(
      critique => critique.title === idea.title
    );

    // Calculate a final score based on realist feasibility and critic score
    const realistScore = realistEval?.feasibility || 5;
    const criticScore = criticEval?.score || 5;
    const finalScore = Math.round((realistScore + criticScore) / 2);

    return {
      title: idea.title,
      description: idea.description,
      score: finalScore,
      dreamerNotes: idea.notes,
      realistNotes: realistEval?.notes,
      criticNotes: criticEval?.notes,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 