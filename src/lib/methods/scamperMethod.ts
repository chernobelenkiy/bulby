import { generateObject } from 'ai';
import { z } from 'zod';
import { aiModel } from './ai-models';
import { GeneratedIdea } from '@/types/ideas';

// Schema for individual SCAMPER technique agents
const singleTechniqueSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      notes: z.string().optional(),
    })
  ),
  reasoning: z.string(),
});

// Schema for evaluation agent
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

// Interface for tracking SCAMPER ideas
interface ScamperIdea {
  title: string;
  description: string;
  scamperTechnique: string;
  notes?: string;
  score?: number;
}

/**
 * Implements SCAMPER method to transform existing ideas
 * Uses a Multi-Agent Collaboration approach with specialized agents:
 * - Seven technique-specific agents (one for each SCAMPER technique)
 * - Implementation Evaluator agent for feasibility assessment
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
  
  // Define all SCAMPER techniques with descriptions
  const techniques = [
    {
      name: 'Substitute',
      description: 'Replace parts of a product, service, or process with something else',
      examples: 'Using different materials, changing components, replacing team members or technologies',
      russianName: 'Замена',
    },
    {
      name: 'Combine',
      description: 'Merge elements or ideas together to create something new',
      examples: 'Merging products or services, combining functions, integrating technologies',
      russianName: 'Комбинирование',
    },
    {
      name: 'Adapt',
      description: 'Modify something for another purpose or use',
      examples: 'Adapting existing products for new markets, adjusting processes for new contexts',
      russianName: 'Адаптация',
    },
    {
      name: 'Modify',
      description: 'Change aspects like size, shape, frequency, or other attributes',
      examples: 'Increasing/decreasing size, changing color, altering frequency of service',
      russianName: 'Модификация',
    },
    {
      name: 'Put to another use',
      description: 'Find new ways to use existing products or services',
      examples: 'Finding new user groups, repurposing products, identifying new applications',
      russianName: 'Применение в другой области',
    },
    {
      name: 'Eliminate',
      description: 'Remove elements or simplify concepts',
      examples: 'Removing features, streamlining processes, reducing complexity',
      russianName: 'Исключение',
    },
    {
      name: 'Reverse',
      description: 'Flip aspects or consider opposite approaches',
      examples: 'Reversing roles, inverting processes, changing the order of operations',
      russianName: 'Обращение',
    }
  ];

  // Store all generated ideas
  const allIdeas: ScamperIdea[] = [];
  
  // Generate ideas using each SCAMPER technique separately
  for (const technique of techniques) {
    // Get localized technique name
    const techniqueName = language === 'ru' ? technique.russianName : technique.name;
    
    // Create technique-specific agent
    const { object: techniqueResponse } = await generateObject({
      model: aiModel,
      system: `You are an expert in the "${technique.name}" technique from the SCAMPER method.
      
      The "${technique.name}" technique involves: ${technique.description}
      Examples include: ${technique.examples}
      
      Your ONLY job is to generate exactly 2 creative and innovative ideas using EXCLUSIVELY the "${technique.name}" technique.
      Do NOT use any other SCAMPER techniques for your ideas.
      
      For each idea, provide:
      1. A descriptive title
      2. A detailed description (2-3 paragraphs) focusing on how the "${technique.name}" technique is applied
      3. Optional additional notes highlighting what makes this idea especially valuable
      
      Think deeply about non-obvious applications of this technique to the user's prompt.
      ${languageInstruction}
      IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
      prompt,
      schema: singleTechniqueSchema,
    });
    
    // Process and store ideas with their technique
    techniqueResponse.ideas.forEach(idea => {
      allIdeas.push({
        ...idea,
        scamperTechnique: techniqueName
      });
    });
  }
  
  // Select top ideas for evaluation (max 2 per technique to maintain diversity)
  const selectedIdeas = selectDiverseIdeas(allIdeas, 10);
  
  // Implementation Evaluator agent - assesses feasibility and implementation
  const { object: implementationResponse } = await generateObject({
    model: aiModel,
    system: `You are an expert in evaluating the practicality and implementation of innovative ideas.
    Your job is to assess each idea based on its feasibility, implementation path, and potential challenges.
    For each idea, provide:
    1. A score from 1-10 reflecting overall feasibility and innovation value (be discriminating in your scoring)
    2. Implementation details - concrete steps to realize this idea
    3. Potential challenges and how to overcome them
    
    Be honest and thorough in your assessment. Consider technical, financial, and practical factors.
    Prioritize ideas that balance innovation with feasibility.
    ${languageInstruction}
    IMPORTANT: Respond in ${language === 'ru' ? 'Russian' : 'English'} language only.`,
    prompt: `Evaluate these SCAMPER-generated ideas:
    ${selectedIdeas.map(idea => 
      `- ${idea.title}: ${idea.description} (SCAMPER Technique: ${idea.scamperTechnique})`
    ).join('\n')}`,
    schema: implementationSchema,
  });

  // Process all ideas with evaluations
  selectedIdeas.forEach(idea => {
    const evaluation = implementationResponse.evaluations.find(
      evaluation => evaluation.title === idea.title
    );
    idea.score = evaluation?.score || 5;
  });
  
  // Sort by score and select top 3
  selectedIdeas.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top3Ideas = selectedIdeas.slice(0, 3);

  // Combine and process the results for final output
  const finalIdeas: GeneratedIdea[] = top3Ideas.map(idea => {
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

  return finalIdeas;
}

/**
 * Helper function to select diverse ideas across SCAMPER techniques
 * Ensures we don't have too many ideas from one technique
 */
function selectDiverseIdeas(ideas: ScamperIdea[], maxCount: number): ScamperIdea[] {
  // Group ideas by technique
  const ideasByTechnique: Record<string, ScamperIdea[]> = {};
  
  ideas.forEach(idea => {
    if (!ideasByTechnique[idea.scamperTechnique]) {
      ideasByTechnique[idea.scamperTechnique] = [];
    }
    ideasByTechnique[idea.scamperTechnique].push(idea);
  });
  
  // Select top ideas from each technique (max 2 per technique)
  const selected: ScamperIdea[] = [];
  Object.values(ideasByTechnique).forEach(techniqueIdeas => {
    // Take max 2 ideas from each technique
    selected.push(...techniqueIdeas.slice(0, 2));
  });
  
  // If we still need more ideas to reach maxCount, get additional ideas
  if (selected.length < maxCount) {
    const remaining = ideas.filter(idea => !selected.includes(idea));
    selected.push(...remaining.slice(0, maxCount - selected.length));
  }
  
  // Return maximum maxCount ideas
  return selected.slice(0, maxCount);
} 