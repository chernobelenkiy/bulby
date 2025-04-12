import { generateObject } from 'ai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';
import { aiModel } from './ai-models';

// Schemas for agent responses
const ideaCreatorSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  reasoning: z.string(),
});

const whiteHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      facts: z.string(), // Facts and information
    })
  ),
  reasoning: z.string(),
});

const redHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      emotions: z.string(), // Emotions and feelings
    })
  ),
  reasoning: z.string(),
});

const blackHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      risks: z.string(), // Caution and risks
    })
  ),
  reasoning: z.string(),
});

const yellowHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      benefits: z.string(), // Benefits and optimism
    })
  ),
  reasoning: z.string(),
});

const greenHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      creativity: z.string(), // Creativity and alternatives
    })
  ),
  reasoning: z.string(),
});

const blueHatSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      overview: z.string(), // Process and overview
      score: z.number().min(1).max(10), // Overall quality score
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements the Six Thinking Hats method by Edward de Bono using Multi-Agent Collaboration
 * Each hat represents a different thinking mode and is implemented as a separate agent:
 * - White Hat Agent: Facts and information
 * - Red Hat Agent: Emotions and feelings
 * - Black Hat Agent: Caution and logical negativity
 * - Yellow Hat Agent: Benefits and logical positivity
 * - Green Hat Agent: Creativity and alternatives
 * - Blue Hat Agent: Process control and meta-thinking (also assigns final scores)
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
  
  // 1. Idea Creator - generate initial ideas
  const { object: ideaCreatorResponse } = await generateObject({
    model: aiModel,
    system: `You are a creative idea generator.
    Generate 4 innovative and diverse ideas based on the user's prompt.
    For each idea, provide:
    1. A clear, descriptive title
    2. A concise description of the idea (2-3 sentences)
    
    These ideas will later be analyzed using Edward de Bono's Six Thinking Hats method.
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt,
    schema: ideaCreatorSchema,
  });

  const ideas = ideaCreatorResponse.ideas;

  // 2. White Hat Agent - Facts and information
  const { object: whiteHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the White Hat thinker in the Six Thinking Hats method.
    Your role is to focus purely on facts, data, and information without interpretation.
    For each idea, provide an objective analysis focusing only on:
    - Available data and facts
    - Information needs and gaps
    - Objective observations
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Provide a White Hat analysis (facts and information only) for each of these ideas:
    ${ideas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: whiteHatSchema,
  });

  // 3. Red Hat Agent - Emotions and feelings
  const { object: redHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the Red Hat thinker in the Six Thinking Hats method.
    Your role is to focus on emotions, feelings, and intuition without justification.
    For each idea, provide an analysis focusing only on:
    - Emotional reactions to the idea
    - Intuitive responses
    - How people might feel about the idea
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Provide a Red Hat analysis (emotions and feelings only) for each of these ideas:
    ${ideas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: redHatSchema,
  });

  // 4. Black Hat Agent - Caution and risks
  const { object: blackHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the Black Hat thinker in the Six Thinking Hats method.
    Your role is to identify risks, problems, and obstacles.
    For each idea, provide a critical analysis focusing only on:
    - Potential risks and dangers
    - Logical flaws or weaknesses
    - Obstacles to implementation
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Provide a Black Hat analysis (caution and potential problems) for each of these ideas:
    ${ideas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: blackHatSchema,
  });

  // 5. Yellow Hat Agent - Benefits and optimism
  const { object: yellowHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the Yellow Hat thinker in the Six Thinking Hats method.
    Your role is to identify benefits, value, and positive aspects.
    For each idea, provide an optimistic analysis focusing only on:
    - Potential benefits and advantages
    - Value proposition
    - Positive impact and outcomes
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Provide a Yellow Hat analysis (benefits and value) for each of these ideas:
    ${ideas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: yellowHatSchema,
  });

  // 6. Green Hat Agent - Creativity and alternatives
  const { object: greenHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the Green Hat thinker in the Six Thinking Hats method.
    Your role is to focus on creativity, new possibilities, and alternatives.
    For each idea, provide a creative analysis focusing only on:
    - How the idea could be expanded or improved
    - Creative alternatives and variations
    - Novel approaches to implementation
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Provide a Green Hat analysis (creative possibilities) for each of these ideas:
    ${ideas.map(idea => `- ${idea.title}: ${idea.description}`).join('\n')}`,
    schema: greenHatSchema,
  });

  // 7. Blue Hat Agent - Process and overview (also assigns scores)
  const { object: blueHatResponse } = await generateObject({
    model: aiModel,
    system: `You are the Blue Hat thinker in the Six Thinking Hats method.
    Your role is to provide process control, overall evaluation, and conclusions.
    For each idea, provide a comprehensive overview focusing on:
    - A summary of the key points from all perspectives
    - Overall evaluation of the idea's potential
    - A score from 1-10 reflecting the overall quality of the idea
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Review these ideas and provide a Blue Hat overview (process control and summary).
    
    For each idea, consider these analyses that were previously done:
    ${ideas.map(idea => {
      const whiteHat = whiteHatResponse.analyses.find(a => a.title === idea.title);
      const redHat = redHatResponse.analyses.find(a => a.title === idea.title);
      const blackHat = blackHatResponse.analyses.find(a => a.title === idea.title);
      const yellowHat = yellowHatResponse.analyses.find(a => a.title === idea.title);
      const greenHat = greenHatResponse.analyses.find(a => a.title === idea.title);
      
      return `## ${idea.title}: ${idea.description}
      - White Hat (Facts): ${whiteHat?.facts || 'No analysis'}
      - Red Hat (Emotions): ${redHat?.emotions || 'No analysis'}
      - Black Hat (Risks): ${blackHat?.risks || 'No analysis'}
      - Yellow Hat (Benefits): ${yellowHat?.benefits || 'No analysis'}
      - Green Hat (Creativity): ${greenHat?.creativity || 'No analysis'}`;
    }).join('\n\n')}`,
    schema: blueHatSchema,
  });

  // Combine all analyses into the final ideas format
  const finalIdeas: GeneratedIdea[] = ideas.map(idea => {
    const whiteHat = whiteHatResponse.analyses.find(a => a.title === idea.title);
    const redHat = redHatResponse.analyses.find(a => a.title === idea.title);
    const blackHat = blackHatResponse.analyses.find(a => a.title === idea.title);
    const yellowHat = yellowHatResponse.analyses.find(a => a.title === idea.title);
    const greenHat = greenHatResponse.analyses.find(a => a.title === idea.title);
    const blueHat = blueHatResponse.analyses.find(a => a.title === idea.title);

    // Create labels based on selected language
    const whiteHatLabel = language === 'ru' ? 'Белая шляпа (Факты):' : 'White Hat (Facts):';
    const redHatLabel = language === 'ru' ? 'Красная шляпа (Эмоции):' : 'Red Hat (Emotions):';
    const blackHatLabel = language === 'ru' ? 'Черная шляпа (Риски):' : 'Black Hat (Risks):';
    const yellowHatLabel = language === 'ru' ? 'Желтая шляпа (Преимущества):' : 'Yellow Hat (Benefits):';
    const greenHatLabel = language === 'ru' ? 'Зеленая шляпа (Креативность):' : 'Green Hat (Creativity):';
    const blueHatLabel = language === 'ru' ? 'Синяя шляпа (Обзор):' : 'Blue Hat (Overview):';

    return {
      title: idea.title,
      description: idea.description,
      score: blueHat?.score || 5,
      dreamerNotes: `${yellowHatLabel} ${yellowHat?.benefits || ''}\n\n${greenHatLabel} ${greenHat?.creativity || ''}`,
      realistNotes: `${whiteHatLabel} ${whiteHat?.facts || ''}\n\n${blueHatLabel} ${blueHat?.overview || ''}`,
      criticNotes: `${blackHatLabel} ${blackHat?.risks || ''}\n\n${redHatLabel} ${redHat?.emotions || ''}`,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 