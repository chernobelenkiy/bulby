import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schema for the Six Thinking Hats ideas
const sixHatsSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number().min(1).max(10),
      whiteHat: z.string(), // Facts and information
      redHat: z.string(),   // Emotions and feelings
      blackHat: z.string(), // Caution and risks
      yellowHat: z.string(), // Benefits and optimism
      greenHat: z.string(), // Creativity and alternatives
      blueHat: z.string(),  // Process and overview
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements the Six Thinking Hats method by Edward de Bono
 * Six hats represent different thinking modes:
 * - White Hat: Facts and information
 * - Red Hat: Emotions and feelings
 * - Black Hat: Caution and logical negativity
 * - Yellow Hat: Benefits and logical positivity
 * - Green Hat: Creativity and alternatives
 * - Blue Hat: Process control and meta-thinking
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 ideas with evaluations from different perspectives
 */
export async function generateIdeasUsingSixHatsMethod(
  prompt: string,
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // Generate ideas using the Six Thinking Hats method
  const { object: sixHatsResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in the Six Thinking Hats method developed by Edward de Bono.
    The six hats represent different thinking modes:
    - White Hat: Focus on facts, figures, and objective information
    - Red Hat: Express emotions, feelings, and intuition
    - Black Hat: Apply caution and identify risks, problems, and obstacles
    - Yellow Hat: Focus on benefits, feasibility, and optimism
    - Green Hat: Generate creative alternatives and new possibilities
    - Blue Hat: Manage the thinking process and draw conclusions
    
    Generate 5 comprehensive ideas based on the user's prompt, analyzing each from all six thinking perspectives.
    For each idea, provide:
    1. A descriptive title
    2. A concise description
    3. A score from 1-10 reflecting overall quality
    4. White Hat analysis (facts and information)
    5. Red Hat analysis (emotional response)
    6. Black Hat analysis (potential problems)
    7. Yellow Hat analysis (benefits and value)
    8. Green Hat analysis (creative extensions)
    9. Blue Hat overview (process summary)
    ${languageInstruction}`,
    prompt,
    schema: sixHatsSchema,
  });

  // Process the ideas
  const finalIdeas = sixHatsResponse.ideas.map(idea => {
    // Combine perspectives into our standard format
    return {
      title: idea.title,
      description: idea.description,
      score: idea.score,
      dreamerNotes: `${idea.yellowHat}\n\n${idea.greenHat}`, // Optimism and creativity
      realistNotes: `${idea.whiteHat}\n\n${idea.blueHat}`,   // Facts and overview
      criticNotes: `${idea.blackHat}\n\n${idea.redHat}`,     // Caution and emotions
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 