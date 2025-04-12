import { generateObject } from 'ai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';
import { aiModel } from './ai-models';

// Schemas for agent responses
const ideaGeneratorSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      notes: z.string().optional(),
    })
  ),
  reasoning: z.string(),
});

const evaluatorSchema = z.object({
  evaluations: z.array(
    z.object({
      title: z.string(),
      score: z.number().min(1).max(10),
      innovationFactors: z.string(),
      applicationAreas: z.string(),
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements Brainstorming method to generate a wide variety of ideas
 * Uses a Multi-Agent Collaboration approach with specialized agents:
 * 1. Idea Generator - focuses on quantity and diversity of ideas
 * 2. Evaluator - rates ideas based on innovation and application areas
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
  
  // 1. Idea Generator agent - focuses on quantity and diversity
  const { object: generatorResponse } = await generateObject({
    model: aiModel,
    system: `You are an expert in the brainstorming technique for idea generation.
    Your goal is to generate as many creative and innovative ideas as possible without any filtering or judgment.
    Remember that in brainstorming, quantity is more important than quality at this stage.
    Generate at least 8 diverse ideas based on the user's prompt.
    For each idea, provide:
    1. A catchy title
    2. A concise description
    3. Optional notes on what makes this idea interesting or unique
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt,
    schema: ideaGeneratorSchema,
  });

  // Only process the top 6 ideas to avoid overwhelming the evaluator
  const topIdeas = generatorResponse.ideas.slice(0, 6);

  // 2. Evaluator agent - assesses innovation and application areas
  const { object: evaluatorResponse } = await generateObject({
    model: aiModel,
    system: `You are an expert in evaluating innovative ideas.
    Your job is to assess each idea based on its innovation factor and potential application areas.
    For each idea, provide:
    1. A score from 1-10 reflecting the overall quality and innovation
    2. Innovation factors - what makes this idea innovative or unique
    3. Potential application areas where this idea could be implemented
    Be honest and critical in your evaluations.
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Evaluate these brainstormed ideas:
    ${topIdeas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: evaluatorSchema,
  });

  // Combine and process the results
  const finalIdeas: GeneratedIdea[] = topIdeas.map(idea => {
    const evaluation = evaluatorResponse.evaluations.find(
      evaluation => evaluation.title === idea.title
    );

    // Create labels based on selected language
    const notesLabel = language === 'ru' ? 'Заметки:' : 'Notes:';
    const applicationsLabel = language === 'ru' ? 'Области применения:' : 'Application Areas:';
    const innovationLabel = language === 'ru' ? 'Факторы инноваций:' : 'Innovation Factors:';

    return {
      title: idea.title,
      description: idea.description,
      score: evaluation?.score || 5,
      dreamerNotes: idea.notes ? `${notesLabel} ${idea.notes}` : undefined,
      realistNotes: evaluation?.applicationAreas ? `${applicationsLabel} ${evaluation.applicationAreas}` : undefined,
      criticNotes: evaluation?.innovationFactors ? `${innovationLabel} ${evaluation.innovationFactors}` : undefined,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 