import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schemas for agent responses
const scamperGeneratorSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      scamperTechnique: z.string(),
      notes: z.string().optional(),
    })
  ),
  reasoning: z.string(),
});

const implementationSchema = z.object({
  evaluations: z.array(
    z.object({
      title: z.string(),
      score: z.number().min(1).max(10),
      implementation: z.string(),
      challenges: z.string(),
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements SCAMPER method to transform existing ideas
 * Uses a Multi-Agent Collaboration approach with specialized agents:
 * 1. SCAMPER Generator - creates ideas using specific SCAMPER techniques
 * 2. Implementation Evaluator - assesses feasibility and implementation details
 * 
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
  
  // 1. SCAMPER Generator agent - creates ideas using specific techniques
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
    
    Generate 7 creative ideas based on the user's prompt, using at least one SCAMPER technique for each idea.
    For each idea, provide:
    1. A descriptive title
    2. A detailed description 
    3. Which SCAMPER technique was primarily used (clearly label this)
    4. Optional additional notes about the idea
    
    Make sure to use different SCAMPER techniques across your ideas.
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt,
    schema: scamperGeneratorSchema,
  });

  // Only process the top 5 ideas to avoid overwhelming the second agent
  const topIdeas = scamperResponse.ideas.slice(0, 5);

  // 2. Implementation Evaluator agent - assesses feasibility and implementation
  const { object: implementationResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in evaluating the practicality and implementation of innovative ideas.
    Your job is to assess each idea based on its feasibility, implementation path, and potential challenges.
    For each idea, provide:
    1. A score from 1-10 reflecting overall feasibility and innovation value
    2. Implementation details - concrete steps to realize this idea
    3. Potential challenges and how to overcome them
    Be honest and thorough in your assessment.
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Evaluate these SCAMPER-generated ideas:
    ${topIdeas.map(idea => 
      `- ${idea.title}: ${idea.description} (SCAMPER Technique: ${idea.scamperTechnique})`
    ).join('\n')}`,
    schema: implementationSchema,
  });

  // Combine and process the results
  const finalIdeas: GeneratedIdea[] = topIdeas.map(idea => {
    const evaluation = implementationResponse.evaluations.find(
      evaluation => evaluation.title === idea.title
    );

    // Create labels based on selected language
    const scamperTechniqueLabel = language === 'ru' ? 'Техника SCAMPER:' : 'SCAMPER Technique:';
    const implementationLabel = language === 'ru' ? 'Реализация:' : 'Implementation:';
    const challengesLabel = language === 'ru' ? 'Проблемы и решения:' : 'Challenges:';

    return {
      title: idea.title,
      description: idea.description,
      score: evaluation?.score || 5,
      dreamerNotes: `${scamperTechniqueLabel} ${idea.scamperTechnique}${idea.notes ? `\n\n${idea.notes}` : ''}`,
      realistNotes: `${implementationLabel} ${evaluation?.implementation || ''}`,
      criticNotes: `${challengesLabel} ${evaluation?.challenges || ''}`,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 